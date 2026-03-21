import { useRef, useEffect } from "react";
import type { PVCOrigin } from "../data/pvcOrigins";

interface ECGPanelProps {
  origin: PVCOrigin;
}

// ─── Lead-specific QRS amplitude profiles ───
// Values range from -1 (fully negative/deep S) to +1 (tall R)
// Derived from axis, morphology, and transition data per origin

interface LeadProfile {
  /** QRS main deflection: -1 to 1 */
  qrs: number;
  /** Small initial deflection (q or r wave): -1 to 1, 0 = none */
  initial: number;
  /** Terminal deflection (s or r'): -1 to 1, 0 = none */
  terminal: number;
  /** QRS width multiplier (1 = normal, 1.5 = wide) */
  width: number;
  /** Notching in QRS */
  notch: boolean;
}

type LeadName = "I" | "II" | "III" | "aVR" | "aVL" | "aVF" | "V1" | "V2" | "V3" | "V4" | "V5" | "V6";

function getLeadProfiles(origin: PVCOrigin): Record<LeadName, LeadProfile> {
  const f = origin.ecgFeatures;
  const morph = f.morphology.toLowerCase();
  const axis = f.axis.toLowerCase();
  const trans = f.transition.toLowerCase();
  const features = f.otherFeatures.join(" ").toLowerCase();

  const isLBBB = morph.includes("lbbb");
  const isRBBB = morph.includes("rbbb");
  const isInferior = axis.includes("inferior");
  const isSuperior = axis.includes("superior");
  const isLeftward = axis.includes("left");
  const isRightward = axis.includes("right");

  // Determine precordial transition lead number
  let transitionLead = 4; // default V4
  if (trans.includes("v1")) transitionLead = 1;
  else if (trans.includes("v2")) transitionLead = 2;
  else if (trans.includes("v3")) transitionLead = 3;
  else if (trans.includes("v4")) transitionLead = 4;
  else if (trans.includes("v5")) transitionLead = 5;
  else if (trans.includes("v6")) transitionLead = 6;
  if (trans.includes("early")) transitionLead = Math.min(transitionLead, 2);
  if (trans.includes("late")) transitionLead = Math.max(transitionLead, 5);

  const wide = features.includes("> 140") || features.includes("> 150") || features.includes("broad");
  const narrow = features.includes("narrow") || features.includes("< 120");
  const widthMult = narrow ? 0.8 : wide ? 1.4 : 1.1;

  const notchInferior = features.includes("notch");

  // ─── Limb leads based on axis ───
  let leadI: LeadProfile, leadII: LeadProfile, leadIII: LeadProfile;
  let aVR: LeadProfile, aVL: LeadProfile, aVF: LeadProfile;

  if (isInferior) {
    // Inferior axis: positive II, III, aVF; negative aVR
    leadII =  { qrs:  0.85, initial: 0, terminal: -0.1, width: widthMult, notch: notchInferior };
    leadIII = { qrs:  0.75, initial: 0, terminal: -0.1, width: widthMult, notch: notchInferior };
    aVF =     { qrs:  0.80, initial: 0, terminal: -0.1, width: widthMult, notch: notchInferior };
    aVR =     { qrs: -0.70, initial: 0.05, terminal: 0, width: widthMult, notch: false };
    leadI =   { qrs:  0.25, initial: 0, terminal: -0.1, width: widthMult, notch: false };
    aVL =     { qrs: -0.20, initial: 0.05, terminal: 0, width: widthMult, notch: false };

    if (isRightward) {
      leadI.qrs = -0.15;
      aVL.qrs = -0.40;
    }
  } else if (isSuperior) {
    // Superior axis: negative II, III, aVF; positive aVL
    leadII =  { qrs: -0.70, initial: 0.05, terminal: 0, width: widthMult, notch: false };
    leadIII = { qrs: -0.80, initial: 0.05, terminal: 0, width: widthMult, notch: false };
    aVF =     { qrs: -0.75, initial: 0.05, terminal: 0, width: widthMult, notch: false };
    aVR =     { qrs:  0.40, initial: 0, terminal: -0.1, width: widthMult, notch: false };
    leadI =   { qrs:  0.40, initial: 0, terminal: -0.1, width: widthMult, notch: false };
    aVL =     { qrs:  0.60, initial: 0, terminal: -0.1, width: widthMult, notch: false };

    if (isRightward) {
      leadI.qrs = -0.30;
      aVL.qrs = -0.20;
    }
  } else if (isLeftward) {
    leadII =  { qrs:  0.20, initial: 0, terminal: -0.2, width: widthMult, notch: false };
    leadIII = { qrs: -0.40, initial: 0.05, terminal: 0, width: widthMult, notch: false };
    aVF =     { qrs: -0.10, initial: 0, terminal: 0, width: widthMult, notch: false };
    aVR =     { qrs: -0.50, initial: 0.05, terminal: 0, width: widthMult, notch: false };
    leadI =   { qrs:  0.60, initial: 0, terminal: -0.1, width: widthMult, notch: false };
    aVL =     { qrs:  0.55, initial: 0, terminal: -0.1, width: widthMult, notch: false };
  } else {
    // Normal / variable axis
    leadII =  { qrs:  0.50, initial: 0, terminal: -0.15, width: widthMult, notch: false };
    leadIII = { qrs:  0.20, initial: 0, terminal: -0.2, width: widthMult, notch: false };
    aVF =     { qrs:  0.35, initial: 0, terminal: -0.15, width: widthMult, notch: false };
    aVR =     { qrs: -0.55, initial: 0.05, terminal: 0, width: widthMult, notch: false };
    leadI =   { qrs:  0.35, initial: 0, terminal: -0.15, width: widthMult, notch: false };
    aVL =     { qrs:  0.15, initial: 0, terminal: -0.1, width: widthMult, notch: false };
  }

  // ─── Precordial leads based on morphology + transition ───
  const precordial: Record<string, LeadProfile> = {};

  for (let v = 1; v <= 6; v++) {
    const lead = `V${v}` as LeadName;

    if (isLBBB) {
      // LBBB: negative in V1 (QS/rS), progressively positive through transition
      if (v < transitionLead) {
        // Pre-transition: predominantly negative
        const depth = v === 1 ? -0.85 : -0.85 + (v - 1) * 0.15;
        const smallR = v === 1 && morph.includes("rs") ? 0.1 : 0;
        precordial[lead] = { qrs: depth, initial: smallR, terminal: 0, width: widthMult, notch: false };
      } else if (v === transitionLead) {
        // Transition: biphasic
        precordial[lead] = { qrs: 0.15, initial: 0, terminal: -0.3, width: widthMult, notch: false };
      } else {
        // Post-transition: predominantly positive
        const height = 0.4 + (v - transitionLead) * 0.15;
        precordial[lead] = { qrs: Math.min(height, 0.8), initial: 0, terminal: -0.1, width: widthMult, notch: false };
      }
    } else if (isRBBB) {
      // RBBB: positive in V1 (R, Rs, rsR'), deep S in V5-V6
      if (v === 1) {
        const hasRSR = morph.includes("rsr") || morph.includes("m-shape");
        precordial[lead] = {
          qrs: 0.75,
          initial: hasRSR ? 0.2 : 0,
          terminal: hasRSR ? -0.3 : -0.1,
          width: widthMult,
          notch: hasRSR,
        };
      } else if (v === 2) {
        precordial[lead] = { qrs: 0.55, initial: 0, terminal: -0.2, width: widthMult, notch: false };
      } else if (v <= transitionLead) {
        const progress = (v - 2) / (transitionLead - 2 || 1);
        precordial[lead] = { qrs: 0.55 - progress * 0.3, initial: 0, terminal: -0.2 - progress * 0.2, width: widthMult, notch: false };
      } else {
        precordial[lead] = { qrs: 0.4 + (v - transitionLead) * 0.1, initial: 0, terminal: -0.35, width: widthMult, notch: false };
      }
    } else {
      // Multiphasic / variable — interpolate based on transition
      if (v < transitionLead) {
        const depth = -0.5 + (v - 1) * 0.15;
        precordial[lead] = { qrs: depth, initial: 0.1, terminal: 0, width: widthMult, notch: false };
      } else {
        const height = 0.3 + (v - transitionLead) * 0.15;
        precordial[lead] = { qrs: Math.min(height, 0.7), initial: -0.1, terminal: -0.1, width: widthMult, notch: false };
      }
    }
  }

  return {
    I: leadI, II: leadII, III: leadIII,
    aVR, aVL, aVF,
    V1: precordial.V1, V2: precordial.V2, V3: precordial.V3,
    V4: precordial.V4, V5: precordial.V5, V6: precordial.V6,
  };
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

  // Get lead profiles
  const profiles = getLeadProfiles(origin);
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
        width={800}
        height={450}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "4px",
          border: "1px solid #e0d8d0",
        }}
      />
    </div>
  );
}
