import { useRef, useEffect } from "react";
import type { PVCOrigin } from "../data/pvcOrigins";

interface ECGPanelProps {
  origin: PVCOrigin;
}

/**
 * Generates a procedural ECG-style waveform on a canvas.
 * This is a placeholder visualization until real ECG images are sourced
 * from published literature by the EP physician.
 *
 * IMPORTANT: These waveforms are schematic representations only.
 * They are NOT clinically accurate ECG tracings.
 * Real ECG images must be sourced for the production tool.
 */
function drawECG(
  canvas: HTMLCanvasElement,
  origin: PVCOrigin
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Background - ECG paper style
  ctx.fillStyle = "#fef9f0";
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = "#f0d0d0";
  ctx.lineWidth = 0.5;
  const gridSize = 12;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // Major grid lines
  ctx.strokeStyle = "#e0b0b0";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += gridSize * 5) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize * 5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Lead labels and waveform configuration
  const leads = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
  const cols = 4;
  const rows = 3;
  const cellW = w / cols;
  const cellH = h / rows;

  // Determine waveform characteristics based on origin
  const isLBBB = origin.ecgFeatures.morphology.toLowerCase().includes("lbbb");
  const isInferiorAxis = origin.ecgFeatures.axis.toLowerCase().includes("inferior");
  const isSuperiorAxis = origin.ecgFeatures.axis.toLowerCase().includes("superior");
  const hasEarlyTransition = origin.ecgFeatures.transition.toLowerCase().includes("v1") ||
    origin.ecgFeatures.transition.toLowerCase().includes("v2");

  // Seed-based variation per origin so each looks different
  const seed = origin.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  leads.forEach((lead, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x0 = col * cellW + 8;
    const y0 = row * cellH;
    const baseline = y0 + cellH / 2;

    // Lead label
    ctx.fillStyle = "#333";
    ctx.font = "bold 11px monospace";
    ctx.fillText(lead, x0, y0 + 14);

    // Draw PVC waveform
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const waveWidth = cellW - 20;
    const amp = cellH * 0.35;
    const steps = 200;

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const px = x0 + 5 + t * waveWidth;
      let py = baseline;

      // Generate lead-specific waveform shape
      const pvcPhase = t > 0.25 && t < 0.75;

      if (pvcPhase) {
        const pt = (t - 0.25) / 0.5; // normalized PVC phase 0-1
        let deflection = 0;

        // V1 morphology
        if (lead === "V1") {
          if (isLBBB) {
            // QS or rS pattern
            deflection = -Math.sin(pt * Math.PI) * 0.8;
            if (pt < 0.15) deflection = Math.sin(pt * Math.PI / 0.15) * 0.1;
          } else {
            // RBBB - tall R
            deflection = Math.sin(pt * Math.PI) * 0.7;
            if (pt > 0.6) deflection = -Math.sin((pt - 0.6) * Math.PI / 0.4) * 0.2;
          }
        }
        // V2-V6 transition
        else if (lead.startsWith("V")) {
          const vNum = parseInt(lead[1]);
          const transitionPoint = hasEarlyTransition ? 2 : 4;
          const rWave = vNum >= transitionPoint ? 0.7 : -0.3 + (vNum / 6) * 0.8;
          deflection = Math.sin(pt * Math.PI) * rWave;
          if (pt > 0.65) {
            deflection = -Math.sin((pt - 0.65) * Math.PI / 0.35) * (1 - rWave) * 0.4;
          }
        }
        // Inferior leads (II, III, aVF)
        else if (lead === "II" || lead === "III" || lead === "aVF") {
          if (isInferiorAxis) {
            deflection = Math.sin(pt * Math.PI) * 0.8; // tall R
          } else if (isSuperiorAxis) {
            deflection = -Math.sin(pt * Math.PI) * 0.7; // deep S
          } else {
            deflection = Math.sin(pt * Math.PI) * (0.3 + (seed % 5) * 0.1);
          }
        }
        // aVR - typically opposite of inferior leads
        else if (lead === "aVR") {
          if (isInferiorAxis) {
            deflection = -Math.sin(pt * Math.PI) * 0.7;
          } else {
            deflection = Math.sin(pt * Math.PI) * 0.5;
          }
        }
        // Lead I
        else if (lead === "I") {
          deflection = Math.sin(pt * Math.PI) * (0.2 + (seed % 3) * 0.15);
        }
        // aVL
        else if (lead === "aVL") {
          if (isInferiorAxis) {
            deflection = -Math.sin(pt * Math.PI) * 0.3;
          } else {
            deflection = Math.sin(pt * Math.PI) * 0.5;
          }
        }

        // Add QRS width effect (broader for LBBB, certain origins)
        const widthFactor = isLBBB ? 1.2 : 1.0;
        const adjustedPt = Math.pow(pt, 1 / widthFactor);

        py = baseline - deflection * amp * (1 - Math.abs(adjustedPt - 0.5) * 0.3);
      } else {
        // Baseline with subtle noise
        py = baseline + Math.sin(t * 50 + seed) * 0.3;
      }

      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  });

  // Disclaimer watermark
  ctx.fillStyle = "rgba(200, 0, 0, 0.15)";
  ctx.font = "bold 14px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("SCHEMATIC — NOT CLINICAL ECG — PENDING EP PHYSICIAN REVIEW", w / 2, h - 8);
  ctx.textAlign = "start";
}

export function ECGPanel({ origin }: ECGPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawECG(canvasRef.current, origin);
    }
  }, [origin]);

  return (
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
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      />
    </div>
  );
}
