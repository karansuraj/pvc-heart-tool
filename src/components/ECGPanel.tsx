import { useRef, useEffect, useState, useCallback } from "react";
import type { PVCOrigin } from "../data/pvcOrigins";
import { ECG_PROFILES } from "../data/ecgProfiles";
import type { LeadProfile, LeadName } from "../data/ecgProfiles";

interface ECGPanelProps {
  origin: PVCOrigin;
}

// ─── Waveform drawing ───
// Uses piecewise-linear segments with sharp peaks for realistic QRS morphology.
// PVCs have no preceding P wave, wide QRS, discordant T waves, and compensatory pause.
// Epicardial origins (width >= 1.4) get a slurred upstroke (pseudo-delta wave).

/** Attempt at interpolation between keyframe points for sharp, angular waveforms */
function interpolateKeyframes(
  keyframes: { t: number; v: number }[],
  t: number,
): number {
  if (t <= keyframes[0].t) return keyframes[0].v;
  if (t >= keyframes[keyframes.length - 1].t) return keyframes[keyframes.length - 1].v;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (t >= keyframes[i].t && t < keyframes[i + 1].t) {
      const frac = (t - keyframes[i].t) / (keyframes[i + 1].t - keyframes[i].t);
      return keyframes[i].v + frac * (keyframes[i + 1].v - keyframes[i].v);
    }
  }
  return 0;
}

function drawQRS(
  ctx: CanvasRenderingContext2D,
  x0: number,
  baseline: number,
  cellW: number,
  amp: number,
  profile: LeadProfile,
): void {
  const waveWidth = cellW - 16;
  const steps = 400;
  const isEpicardial = profile.width >= 1.4;

  // Build keyframe-based QRS waveform for sharp, angular morphology
  // Time is normalized 0-1 across the cell width
  const qrsStart = 0.15;
  const qrsDur = 0.20 * profile.width;
  const qrsEnd = qrsStart + qrsDur;
  const stEnd = qrsEnd + 0.03; // short ST segment
  const tWaveEnd = stEnd + 0.18;

  // QRS keyframes (normalized within QRS duration)
  const qrsKeyframes: { t: number; v: number }[] = [];

  if (isEpicardial) {
    // Pseudo-delta wave: slow slurred upstroke before the sharp QRS peak
    qrsKeyframes.push({ t: 0, v: 0 });
    // Slurred initial upstroke (pseudo-delta) — takes 25% of QRS
    if (profile.initial !== 0) {
      qrsKeyframes.push({ t: 0.08, v: profile.initial * 0.5 });
      qrsKeyframes.push({ t: 0.15, v: profile.initial });
      qrsKeyframes.push({ t: 0.20, v: profile.initial * 0.3 });
    } else {
      qrsKeyframes.push({ t: 0.15, v: profile.qrs * 0.15 });
      qrsKeyframes.push({ t: 0.25, v: profile.qrs * 0.3 });
    }
    // Main peak — slower rise due to epicardial activation
    qrsKeyframes.push({ t: 0.45, v: profile.qrs });
    // Terminal
    if (profile.terminal !== 0) {
      qrsKeyframes.push({ t: 0.60, v: 0 });
      qrsKeyframes.push({ t: 0.75, v: profile.terminal });
      qrsKeyframes.push({ t: 0.90, v: profile.terminal * 0.2 });
    } else {
      qrsKeyframes.push({ t: 0.75, v: profile.qrs * 0.1 });
    }
    qrsKeyframes.push({ t: 1, v: 0 });
  } else {
    // Standard sharp QRS
    qrsKeyframes.push({ t: 0, v: 0 });

    // Initial deflection (q or small r wave)
    if (profile.initial !== 0) {
      qrsKeyframes.push({ t: 0.08, v: profile.initial * 0.7 });
      qrsKeyframes.push({ t: 0.12, v: profile.initial });
      qrsKeyframes.push({ t: 0.16, v: profile.initial * 0.2 });
    }

    // Main QRS peak — sharp triangular
    const peakStart = profile.initial !== 0 ? 0.18 : 0.05;
    qrsKeyframes.push({ t: peakStart, v: profile.qrs * 0.05 });
    qrsKeyframes.push({ t: 0.35, v: profile.qrs }); // sharp peak

    // Notching — dip and return
    if (profile.notch) {
      qrsKeyframes.push({ t: 0.42, v: profile.qrs * 0.55 });
      qrsKeyframes.push({ t: 0.50, v: profile.qrs * 0.8 });
    }

    // Descent from main peak
    qrsKeyframes.push({ t: 0.55, v: profile.qrs * 0.1 });

    // Terminal deflection (s wave or r')
    if (profile.terminal !== 0) {
      qrsKeyframes.push({ t: 0.60, v: 0 });
      qrsKeyframes.push({ t: 0.72, v: profile.terminal });
      qrsKeyframes.push({ t: 0.85, v: profile.terminal * 0.15 });
    }

    qrsKeyframes.push({ t: 0.95, v: 0 });
    qrsKeyframes.push({ t: 1, v: 0 });
  }

  ctx.beginPath();

  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const px = x0 + 6 + t * waveWidth;
    let py = baseline;

    if (t >= qrsStart && t < qrsEnd) {
      // QRS complex — use angular keyframes
      const pt = (t - qrsStart) / qrsDur;
      const deflection = interpolateKeyframes(qrsKeyframes, pt);
      py = baseline - deflection * amp;
    } else if (t >= stEnd && t < tWaveEnd) {
      // T wave — discordant to QRS (smooth, rounded)
      const tPt = (t - stEnd) / (tWaveEnd - stEnd);
      // Discordant T: opposite polarity to main QRS deflection
      const tAmp = -profile.qrs * 0.22;
      // Smooth bell shape
      const tWave = tAmp * Math.sin(tPt * Math.PI);
      // Slight ST offset (same direction as T)
      const stOffset = -profile.qrs * 0.05;
      py = baseline - (stOffset + tWave) * amp;
    } else if (t >= qrsEnd && t < stEnd) {
      // ST segment — slight offset from baseline
      const stOffset = -profile.qrs * 0.05;
      py = baseline - stOffset * amp;
    } else {
      // Baseline — flat (no P wave for PVCs, compensatory pause after)
      py = baseline;
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
