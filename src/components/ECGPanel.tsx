import { useRef, useEffect, useState, useCallback } from "react";
import type { PVCOrigin } from "../data/pvcOrigins";
import { ECG_PROFILES } from "../data/ecgProfiles";
import type { LeadProfile, LeadName } from "../data/ecgProfiles";

interface ECGPanelProps {
  origin: PVCOrigin;
}

// ─── Waveform drawing ───

function drawQRS(
  ctx: CanvasRenderingContext2D,
  x0: number,
  baseline: number,
  cellW: number,
  amp: number,
  profile: LeadProfile,
): void {
  const waveWidth = cellW - 16;
  const steps = 300;

  ctx.beginPath();

  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const px = x0 + 6 + t * waveWidth;
    let py = baseline;

    // Time segments: baseline | P wave | PR | QRS | ST | T wave | baseline
    if (t >= 0.08 && t < 0.15) {
      // P wave — small upward bump
      const pt = (t - 0.08) / 0.07;
      py = baseline - Math.sin(pt * Math.PI) * amp * 0.06;
    } else if (t >= 0.20 && t < 0.20 + 0.22 * profile.width) {
      // QRS complex
      const qrsDuration = 0.22 * profile.width;
      const pt = (t - 0.20) / qrsDuration;

      let deflection = 0;

      // Initial deflection (q or small r)
      if (pt < 0.12 && profile.initial !== 0) {
        deflection = profile.initial * Math.sin(pt / 0.12 * Math.PI);
      }
      // Main QRS deflection
      else if (pt < 0.55) {
        const mainPt = (pt - 0.12) / 0.43;
        deflection = profile.qrs * Math.sin(mainPt * Math.PI);

        // Notching
        if (profile.notch && mainPt > 0.35 && mainPt < 0.55) {
          deflection *= 0.7 + 0.3 * Math.sin((mainPt - 0.35) / 0.2 * Math.PI);
        }
      }
      // Terminal deflection
      else if (pt < 0.85 && profile.terminal !== 0) {
        const termPt = (pt - 0.55) / 0.30;
        deflection = profile.terminal * Math.sin(termPt * Math.PI);
      }
      // Return to baseline
      else {
        const retPt = (pt - 0.85) / 0.15;
        deflection = (profile.terminal || profile.qrs * 0.05) * (1 - retPt) * Math.sin(Math.PI * 0.8);
      }

      py = baseline - deflection * amp;
    } else if (t >= 0.20 + 0.22 * profile.width + 0.02 && t < 0.20 + 0.22 * profile.width + 0.02 + 0.15) {
      // ST segment + T wave (discordant — opposite to QRS)
      const tStart = 0.20 + 0.22 * profile.width + 0.02;
      const tPt = (t - tStart) / 0.15;

      // ST elevation/depression proportional to QRS
      const stOffset = -profile.qrs * 0.08;
      // T wave discordant to QRS
      const tWave = -profile.qrs * 0.25 * Math.sin(tPt * Math.PI);

      py = baseline - (stOffset + tWave) * amp;
    } else {
      // Baseline with very subtle noise for realism
      py = baseline + Math.sin(t * 120 + profile.qrs * 10) * 0.2;
    }

    if (s === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.stroke();
}

function drawECG(canvas: HTMLCanvasElement, origin: PVCOrigin) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = 2; // render at 2x for crisp lines
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // ECG paper background
  ctx.fillStyle = "#fdfaf4";
  ctx.fillRect(0, 0, w, h);

  // Minor grid (1mm equivalent)
  const grid = 10 * dpr;
  ctx.strokeStyle = "#f2ddd0";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += grid / 5) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += grid / 5) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Major grid (5mm equivalent)
  ctx.strokeStyle = "#e8c8b8";
  ctx.lineWidth = 0.8;
  for (let x = 0; x < w; x += grid) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += grid) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Get lead profiles — hardcoded literature-derived data
  const profiles = ECG_PROFILES[origin.id] ?? ECG_PROFILES["rvot-septal"]; // fallback
  const leads: LeadName[] = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
  const cols = 4;
  const rows = 3;
  const cellW = w / cols;
  const cellH = h / rows;

  leads.forEach((lead, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x0 = col * cellW;
    const y0 = row * cellH;
    const baseline = y0 + cellH / 2;

    // Lead label background
    ctx.fillStyle = "rgba(253, 250, 244, 0.85)";
    ctx.fillRect(x0 + 4, y0 + 3, 28, 14);

    // Lead label
    ctx.fillStyle = "#666";
    ctx.font = `bold ${10 * dpr / 2}px "SF Mono", "Menlo", monospace`;
    ctx.fillText(lead, x0 + 6, y0 + 13);

    // Calibration mark (small vertical bar at start)
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0 + 3, baseline);
    ctx.lineTo(x0 + 3, baseline - cellH * 0.15);
    ctx.lineTo(x0 + 6, baseline - cellH * 0.15);
    ctx.lineTo(x0 + 6, baseline);
    ctx.stroke();

    // Draw the waveform
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const profile = profiles[lead];
    drawQRS(ctx, x0, baseline, cellW, cellH * 0.38, profile);
  });

  // Cell borders (subtle)
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 0.5;
  for (let c = 1; c < cols; c++) {
    ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, h); ctx.stroke();
  }
  for (let r = 1; r < rows; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(w, r * cellH); ctx.stroke();
  }

  // Disclaimer
  ctx.fillStyle = "rgba(180, 0, 0, 0.12)";
  ctx.font = `bold ${9 * dpr / 2}px system-ui`;
  ctx.textAlign = "center";
  ctx.fillText("SCHEMATIC — NOT CLINICAL ECG — PENDING EP PHYSICIAN REVIEW", w / 2, h - 5);
  ctx.textAlign = "start";
}

export function ECGPanel({ origin }: ECGPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      drawECG(canvasRef.current, origin);
    }
  }, [origin]);

  // Draw on modal canvas when it opens
  useEffect(() => {
    if (modalOpen && modalCanvasRef.current) {
      drawECG(modalCanvasRef.current, origin);
    }
  }, [modalOpen, origin]);

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const handleOpen = useCallback(() => setModalOpen(true), []);
  const handleClose = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <div style={{ width: "100%", padding: "0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            12-Lead ECG — {origin.name}
          </h3>
          <span
            style={{
              fontSize: "10px",
              color: "#c00",
              background: "#fff0f0",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            Schematic placeholder — real ECG images pending
          </span>
        </div>
        {/* Clickable thumbnail */}
        <div
          onClick={handleOpen}
          style={{ cursor: "zoom-in", position: "relative" }}
          title="Click to expand"
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "4px",
              border: "1px solid #e0d8d0",
            }}
          />
          {/* Expand hint */}
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              right: "6px",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "3px",
              pointerEvents: "none",
            }}
          >
            Click to expand
          </div>
        </div>
      </div>

      {/* Full-screen modal */}
      {modalOpen && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          {/* Header */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "1200px",
              marginBottom: "12px",
              cursor: "default",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>
                12-Lead ECG — {origin.fullName}
              </h2>
              <div style={{ display: "flex", gap: "16px", marginTop: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  <strong style={{ color: "#ccc" }}>Axis:</strong> {origin.ecgFeatures.axis}
                </span>
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  <strong style={{ color: "#ccc" }}>V1:</strong> {origin.ecgFeatures.morphology}
                </span>
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  <strong style={{ color: "#ccc" }}>Transition:</strong> {origin.ecgFeatures.transition}
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "13px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Close (Esc)
            </button>
          </div>

          {/* Large ECG canvas */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "1200px", cursor: "default" }}
          >
            <canvas
              ref={modalCanvasRef}
              width={1600}
              height={900}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
