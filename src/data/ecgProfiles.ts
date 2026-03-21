/**
 * Literature-derived 12-lead ECG morphology profiles for each PVC origin.
 *
 * Each lead profile defines:
 * - qrs: dominant QRS deflection (-1.0 deep negative to +1.0 tall positive)
 * - initial: small initial deflection (q or r wave, -0.3 to +0.3)
 * - terminal: terminal deflection (s or r' wave, -0.5 to +0.5)
 * - width: QRS width multiplier (0.8 = narrow, 1.0 = normal, 1.5 = wide)
 * - notch: QRS notching present
 *
 * Sources:
 * - Dixit et al. 2003 (RVOT septal vs free wall)
 * - Yamada et al. 2008 (aortic cusp patterns)
 * - Tada et al. 2005 (mitral annular patterns)
 * - Tada et al. 2007 (tricuspid annular patterns)
 * - Yamada et al. 2010 (papillary muscle patterns)
 * - Enriquez et al. 2017 (LV summit patterns)
 * - Sadek et al. 2015 (moderator band patterns)
 */

export interface LeadProfile {
  qrs: number;
  initial: number;
  terminal: number;
  width: number;
  notch: boolean;
}

export type LeadName = "I" | "II" | "III" | "aVR" | "aVL" | "aVF" | "V1" | "V2" | "V3" | "V4" | "V5" | "V6";

export type ECGProfile = Record<LeadName, LeadProfile>;

export const ECG_PROFILES: Record<string, ECGProfile> = {

  // ── RVOT ──────────────────────────────────────────────────────────────
  // Dixit 2003: LBBB, inferior axis, transition V3. QRS ~120-140ms.
  "rvot-septal": {
    I:    { qrs: 0.1,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    II:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    III:  { qrs: 0.85, initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    aVR:  { qrs: -0.8, initial: 0,    terminal: 0,    width: 1.2, notch: false },
    aVL:  { qrs: -0.4, initial: 0,    terminal: 0,    width: 1.2, notch: false },
    aVF:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    V1:   { qrs: -0.9, initial: 0,    terminal: 0,    width: 1.2, notch: false },
    V2:   { qrs: -0.7, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    V3:   { qrs: 0.5,  initial: 0.2,  terminal: -0.2, width: 1.2, notch: false },
    V4:   { qrs: 0.8,  initial: 0.1,  terminal: -0.1, width: 1.2, notch: false },
    V5:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    V6:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
  },

  // Dixit 2003: LBBB, inferior axis, later transition V4-V5, wider QRS, notching inferior leads
  "rvot-freewall": {
    I:    { qrs: 0.3,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    II:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.4, notch: true  },
    III:  { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.4, notch: true  },
    aVR:  { qrs: -0.7, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    aVL:  { qrs: -0.2, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    aVF:  { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.4, notch: true  },
    V1:   { qrs: -0.9, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    V2:   { qrs: -0.85,initial: 0,    terminal: 0,    width: 1.4, notch: false },
    V3:   { qrs: -0.5, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    V4:   { qrs: 0.3,  initial: 0.2,  terminal: -0.2, width: 1.4, notch: false },
    V5:   { qrs: 0.7,  initial: 0.1,  terminal: -0.1, width: 1.4, notch: false },
    V6:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
  },

  // LBBB, lead I negative/isoelectric, tall inferior leads
  "rvot-anterior": {
    I:    { qrs: -0.2, initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    II:   { qrs: 0.85, initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    III:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    aVR:  { qrs: -0.6, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVL:  { qrs: -0.6, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVF:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    V1:   { qrs: -0.9, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    V2:   { qrs: -0.8, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    V3:   { qrs: -0.3, initial: 0.2,  terminal: 0,    width: 1.3, notch: false },
    V4:   { qrs: 0.5,  initial: 0.1,  terminal: -0.2, width: 1.3, notch: false },
    V5:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    V6:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
  },

  // LBBB, lead I positive, II > III, closer to cusp territory
  "rvot-posterior": {
    I:    { qrs: 0.4,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    II:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    III:  { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    aVR:  { qrs: -0.7, initial: 0,    terminal: 0,    width: 1.2, notch: false },
    aVL:  { qrs: 0.0,  initial: 0,    terminal: 0,    width: 1.2, notch: false },
    aVF:  { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    V1:   { qrs: -0.9, initial: 0,    terminal: 0,    width: 1.2, notch: false },
    V2:   { qrs: -0.6, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    V3:   { qrs: 0.3,  initial: 0.2,  terminal: -0.2, width: 1.2, notch: false },
    V4:   { qrs: 0.7,  initial: 0.1,  terminal: -0.1, width: 1.2, notch: false },
    V5:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    V6:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
  },

  // ── LVOT / Aortic Cusps ───────────────────────────────────────────────
  // Yamada 2008: tall R V1-V2, negative lead I, inferior axis
  "lvot-lcc": {
    I:    { qrs: -0.3, initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    II:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    III:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    aVR:  { qrs: -0.6, initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVL:  { qrs: -0.6, initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVF:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V1:   { qrs: 0.6,  initial: 0,    terminal: -0.3, width: 1.1, notch: false },
    V2:   { qrs: 0.8,  initial: 0,    terminal: -0.2, width: 1.1, notch: false },
    V3:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V4:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V5:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V6:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
  },

  // Yamada 2008: LBBB, transition V3, lead I positive
  "lvot-rcc": {
    I:    { qrs: 0.2,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    II:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    III:  { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    aVR:  { qrs: -0.7, initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVL:  { qrs: -0.3, initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVF:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V1:   { qrs: -0.5, initial: 0.2,  terminal: 0,    width: 1.1, notch: false },
    V2:   { qrs: 0.3,  initial: 0.2,  terminal: -0.2, width: 1.1, notch: false },
    V3:   { qrs: 0.7,  initial: 0.1,  terminal: -0.1, width: 1.1, notch: false },
    V4:   { qrs: 0.85, initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V5:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V6:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
  },

  // Yamada 2008: intermediate between LCC and RCC
  "lvot-lcc-rcc": {
    I:    { qrs: 0.0,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    II:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    III:  { qrs: 0.85, initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    aVR:  { qrs: -0.7, initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVL:  { qrs: -0.5, initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVF:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V1:   { qrs: 0.1,  initial: 0.1,  terminal: -0.2, width: 1.1, notch: false },
    V2:   { qrs: 0.6,  initial: 0.1,  terminal: -0.2, width: 1.1, notch: false },
    V3:   { qrs: 0.8,  initial: 0.1,  terminal: -0.1, width: 1.1, notch: false },
    V4:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V5:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V6:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
  },


  // ── Mitral Annulus ────────────────────────────────────────────────────
  // Tada 2005: RBBB, superior axis, negative inferior leads
  "mitral-anterior": {
    I:    { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    II:   { qrs: -0.5, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    III:  { qrs: -0.8, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    aVR:  { qrs: 0.1,  initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVL:  { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    aVF:  { qrs: -0.7, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    V1:   { qrs: 0.7,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
    V2:   { qrs: 0.6,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
    V3:   { qrs: 0.4,  initial: 0,    terminal: -0.3, width: 1.3, notch: false },
    V4:   { qrs: 0.2,  initial: 0,    terminal: -0.3, width: 1.3, notch: false },
    V5:   { qrs: 0.3,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
    V6:   { qrs: 0.4,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
  },

  // Tada 2005: RBBB, inferior axis
  "mitral-posterior": {
    I:    { qrs: 0.3,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    II:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    III:  { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    aVR:  { qrs: -0.6, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVL:  { qrs: -0.1, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVF:  { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    V1:   { qrs: 0.6,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
    V2:   { qrs: 0.5,  initial: 0,    terminal: -0.3, width: 1.3, notch: false },
    V3:   { qrs: 0.3,  initial: 0,    terminal: -0.3, width: 1.3, notch: false },
    V4:   { qrs: 0.1,  initial: 0,    terminal: -0.3, width: 1.3, notch: false },
    V5:   { qrs: 0.3,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
    V6:   { qrs: 0.4,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
  },

  // Tada 2005: RBBB, rightward axis, lead I negative
  "mitral-lateral": {
    I:    { qrs: -0.5, initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    II:   { qrs: 0.3,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    III:  { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    aVR:  { qrs: 0.1,  initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVL:  { qrs: -0.6, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVF:  { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    V1:   { qrs: 0.7,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
    V2:   { qrs: 0.6,  initial: 0,    terminal: -0.3, width: 1.3, notch: false },
    V3:   { qrs: 0.4,  initial: 0,    terminal: -0.3, width: 1.3, notch: false },
    V4:   { qrs: 0.2,  initial: 0,    terminal: -0.3, width: 1.3, notch: false },
    V5:   { qrs: 0.1,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
    V6:   { qrs: -0.1, initial: 0,    terminal: -0.2, width: 1.3, notch: false },
  },

  // ── Tricuspid Annulus ─────────────────────────────────────────────────
  // Tada 2007: LBBB, leftward axis, narrow-ish
  "tricuspid-septal": {
    I:    { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    II:   { qrs: 0.4,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    III:  { qrs: -0.1, initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVR:  { qrs: -0.5, initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVL:  { qrs: 0.3,  initial: 0,    terminal: 0,    width: 1.1, notch: false },
    aVF:  { qrs: 0.2,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V1:   { qrs: -0.8, initial: 0.1,  terminal: 0,    width: 1.1, notch: false },
    V2:   { qrs: -0.6, initial: 0.1,  terminal: 0,    width: 1.1, notch: false },
    V3:   { qrs: -0.2, initial: 0.2,  terminal: 0,    width: 1.1, notch: false },
    V4:   { qrs: 0.4,  initial: 0.1,  terminal: -0.2, width: 1.1, notch: false },
    V5:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
    V6:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.1, notch: false },
  },

  // Tada 2007: LBBB, inferior axis, lead I negative
  "tricuspid-anterior": {
    I:    { qrs: -0.3, initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    II:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    III:  { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    aVR:  { qrs: -0.4, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVL:  { qrs: -0.6, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVF:  { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    V1:   { qrs: -0.9, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    V2:   { qrs: -0.8, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    V3:   { qrs: -0.5, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    V4:   { qrs: -0.1, initial: 0.2,  terminal: -0.1, width: 1.3, notch: false },
    V5:   { qrs: 0.4,  initial: 0.1,  terminal: -0.2, width: 1.3, notch: false },
    V6:   { qrs: 0.5,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
  },

  // Tada 2007: LBBB, superior axis, lead I positive
  "tricuspid-posterior": {
    I:    { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    II:   { qrs: -0.3, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    III:  { qrs: -0.6, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    aVR:  { qrs: -0.1, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVL:  { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    aVF:  { qrs: -0.5, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    V1:   { qrs: -0.9, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    V2:   { qrs: -0.7, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    V3:   { qrs: -0.4, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    V4:   { qrs: 0.1,  initial: 0.2,  terminal: -0.2, width: 1.3, notch: false },
    V5:   { qrs: 0.5,  initial: 0.1,  terminal: -0.1, width: 1.3, notch: false },
    V6:   { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
  },

  // ── Papillary Muscles (LV) ───────────────────────────────────────────
  // Yamada 2010: RBBB, right superior axis, notching
  "papillary-anterolateral": {
    I:    { qrs: -0.4, initial: 0.1,  terminal: 0,    width: 1.2, notch: true  },
    II:   { qrs: -0.3, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    III:  { qrs: 0.2,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    aVR:  { qrs: 0.3,  initial: 0,    terminal: 0,    width: 1.2, notch: false },
    aVL:  { qrs: -0.4, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    aVF:  { qrs: -0.1, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    V1:   { qrs: 0.8,  initial: 0,    terminal: -0.2, width: 1.2, notch: false },
    V2:   { qrs: 0.7,  initial: 0,    terminal: -0.3, width: 1.2, notch: false },
    V3:   { qrs: 0.4,  initial: 0,    terminal: -0.3, width: 1.2, notch: false },
    V4:   { qrs: 0.1,  initial: 0,    terminal: -0.3, width: 1.2, notch: true  },
    V5:   { qrs: -0.2, initial: 0.1,  terminal: -0.2, width: 1.2, notch: true  },
    V6:   { qrs: -0.3, initial: 0.1,  terminal: -0.1, width: 1.2, notch: true  },
  },

  // Yamada 2010: RBBB, right axis, positive inferior
  "papillary-posteromedial": {
    I:    { qrs: -0.6, initial: 0.1,  terminal: 0,    width: 1.2, notch: true  },
    II:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    III:  { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    aVR:  { qrs: 0.2,  initial: 0,    terminal: 0,    width: 1.2, notch: false },
    aVL:  { qrs: -0.8, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    aVF:  { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    V1:   { qrs: 0.8,  initial: 0,    terminal: -0.2, width: 1.2, notch: false },
    V2:   { qrs: 0.7,  initial: 0,    terminal: -0.3, width: 1.2, notch: false },
    V3:   { qrs: 0.5,  initial: 0,    terminal: -0.3, width: 1.2, notch: false },
    V4:   { qrs: 0.2,  initial: 0,    terminal: -0.3, width: 1.2, notch: true  },
    V5:   { qrs: -0.1, initial: 0.1,  terminal: -0.2, width: 1.2, notch: true  },
    V6:   { qrs: -0.2, initial: 0.1,  terminal: -0.1, width: 1.2, notch: true  },
  },

  // ── Papillary Muscles (RV) ───────────────────────────────────────────
  // LBBB, leftward axis, wide QRS, beat-to-beat variability
  "papillary-rv-anterior": {
    I:    { qrs: 0.4,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    II:   { qrs: 0.3,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    III:  { qrs: -0.1, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    aVR:  { qrs: -0.4, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    aVL:  { qrs: 0.3,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    aVF:  { qrs: 0.1,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    V1:   { qrs: -0.9, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    V2:   { qrs: -0.8, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    V3:   { qrs: -0.5, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    V4:   { qrs: -0.1, initial: 0.2,  terminal: -0.1, width: 1.4, notch: true  },
    V5:   { qrs: 0.4,  initial: 0.1,  terminal: -0.2, width: 1.4, notch: true  },
    V6:   { qrs: 0.5,  initial: 0,    terminal: -0.2, width: 1.4, notch: false },
  },

  // LBBB, superior axis
  "papillary-rv-posterior": {
    I:    { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    II:   { qrs: -0.4, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    III:  { qrs: -0.7, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    aVR:  { qrs: -0.1, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    aVL:  { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    aVF:  { qrs: -0.6, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    V1:   { qrs: -0.9, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    V2:   { qrs: -0.8, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    V3:   { qrs: -0.5, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    V4:   { qrs: -0.1, initial: 0.2,  terminal: -0.1, width: 1.4, notch: true  },
    V5:   { qrs: 0.4,  initial: 0.1,  terminal: -0.2, width: 1.4, notch: false },
    V6:   { qrs: 0.5,  initial: 0,    terminal: -0.2, width: 1.4, notch: false },
  },

  // LBBB, narrow for RV, leftward axis
  "papillary-rv-septal": {
    I:    { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    II:   { qrs: 0.3,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    III:  { qrs: -0.2, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    aVR:  { qrs: -0.4, initial: 0,    terminal: 0,    width: 1.2, notch: false },
    aVL:  { qrs: 0.4,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    aVF:  { qrs: 0.1,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    V1:   { qrs: -0.7, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    V2:   { qrs: -0.5, initial: 0.1,  terminal: 0,    width: 1.2, notch: false },
    V3:   { qrs: -0.1, initial: 0.2,  terminal: 0,    width: 1.2, notch: false },
    V4:   { qrs: 0.4,  initial: 0.1,  terminal: -0.2, width: 1.2, notch: false },
    V5:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
    V6:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.2, notch: false },
  },

  // ── LV Summit ─────────────────────────────────────────────────────────
  // Enriquez 2017: wide QRS, early transition, notching V2, epicardial features
  "lv-summit-gcv": {
    I:    { qrs: -0.5, initial: 0,    terminal: -0.1, width: 1.5, notch: true  },
    II:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.5, notch: false },
    III:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.5, notch: false },
    aVR:  { qrs: -0.4, initial: 0,    terminal: 0,    width: 1.5, notch: false },
    aVL:  { qrs: -0.8, initial: 0,    terminal: 0,    width: 1.5, notch: false },
    aVF:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.5, notch: false },
    V1:   { qrs: -0.5, initial: 0.2,  terminal: 0,    width: 1.5, notch: false },
    V2:   { qrs: 0.6,  initial: 0.2,  terminal: -0.2, width: 1.5, notch: true  },
    V3:   { qrs: 0.8,  initial: 0.1,  terminal: -0.1, width: 1.5, notch: false },
    V4:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.5, notch: false },
    V5:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 1.5, notch: false },
    V6:   { qrs: 0.5,  initial: 0,    terminal: -0.2, width: 1.5, notch: false },
  },

  // Enriquez 2017: AIV-specific, early transition V2-V3, pseudo-delta wave
  "lv-summit-aiv": {
    I:    { qrs: -0.3, initial: 0,    terminal: -0.1, width: 1.4, notch: true  },
    II:   { qrs: 0.85, initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    III:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    aVR:  { qrs: -0.5, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    aVL:  { qrs: -0.7, initial: 0,    terminal: 0,    width: 1.4, notch: false },
    aVF:  { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    V1:   { qrs: -0.3, initial: 0.2,  terminal: 0,    width: 1.4, notch: false },
    V2:   { qrs: 0.5,  initial: 0.3,  terminal: -0.2, width: 1.4, notch: true  },
    V3:   { qrs: 0.8,  initial: 0.1,  terminal: -0.1, width: 1.4, notch: false },
    V4:   { qrs: 0.9,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    V5:   { qrs: 0.8,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    V6:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
  },

  // ── Other ─────────────────────────────────────────────────────────────
  // Narrow QRS, RBBB pattern, normal axis
  "his-bundle": {
    I:    { qrs: 0.4,  initial: -0.1, terminal: -0.1, width: 0.9, notch: false },
    II:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 0.9, notch: false },
    III:  { qrs: 0.4,  initial: 0,    terminal: -0.1, width: 0.9, notch: false },
    aVR:  { qrs: -0.6, initial: 0,    terminal: 0,    width: 0.9, notch: false },
    aVL:  { qrs: 0.0,  initial: -0.1, terminal: 0,    width: 0.9, notch: false },
    aVF:  { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 0.9, notch: false },
    V1:   { qrs: -0.5, initial: 0.2,  terminal: 0.1,  width: 0.9, notch: false },
    V2:   { qrs: -0.3, initial: 0.2,  terminal: 0,    width: 0.9, notch: false },
    V3:   { qrs: 0.3,  initial: 0.2,  terminal: -0.2, width: 0.9, notch: false },
    V4:   { qrs: 0.7,  initial: 0.1,  terminal: -0.1, width: 0.9, notch: false },
    V5:   { qrs: 0.7,  initial: 0,    terminal: -0.1, width: 0.9, notch: false },
    V6:   { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 0.9, notch: false },
  },

  // Sadek 2015: LBBB, left superior axis, rsR' in V1, notching
  "moderator-band": {
    I:    { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    II:   { qrs: -0.2, initial: 0.1,  terminal: 0,    width: 1.3, notch: true  },
    III:  { qrs: -0.6, initial: 0.1,  terminal: 0,    width: 1.3, notch: true  },
    aVR:  { qrs: -0.1, initial: 0,    terminal: 0,    width: 1.3, notch: false },
    aVL:  { qrs: 0.5,  initial: 0,    terminal: -0.1, width: 1.3, notch: false },
    aVF:  { qrs: -0.4, initial: 0.1,  terminal: 0,    width: 1.3, notch: true  },
    V1:   { qrs: -0.6, initial: 0.2,  terminal: 0.2,  width: 1.3, notch: true  },
    V2:   { qrs: -0.7, initial: 0.1,  terminal: 0,    width: 1.3, notch: false },
    V3:   { qrs: -0.4, initial: 0.2,  terminal: 0,    width: 1.3, notch: false },
    V4:   { qrs: 0.1,  initial: 0.2,  terminal: -0.2, width: 1.3, notch: true  },
    V5:   { qrs: 0.5,  initial: 0.1,  terminal: -0.2, width: 1.3, notch: false },
    V6:   { qrs: 0.5,  initial: 0,    terminal: -0.2, width: 1.3, notch: false },
  },

  // Epicardial posterobasal: RBBB, superior axis, slurred upstroke
  "crux": {
    I:    { qrs: 0.3,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    II:   { qrs: -0.6, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    III:  { qrs: -0.8, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    aVR:  { qrs: 0.3,  initial: 0,    terminal: 0,    width: 1.4, notch: false },
    aVL:  { qrs: 0.6,  initial: 0,    terminal: -0.1, width: 1.4, notch: false },
    aVF:  { qrs: -0.7, initial: 0.1,  terminal: 0,    width: 1.4, notch: false },
    V1:   { qrs: 0.6,  initial: 0,    terminal: -0.2, width: 1.4, notch: false },
    V2:   { qrs: 0.5,  initial: 0,    terminal: -0.3, width: 1.4, notch: false },
    V3:   { qrs: 0.3,  initial: 0,    terminal: -0.3, width: 1.4, notch: false },
    V4:   { qrs: 0.1,  initial: 0,    terminal: -0.3, width: 1.4, notch: false },
    V5:   { qrs: 0.2,  initial: 0,    terminal: -0.2, width: 1.4, notch: false },
    V6:   { qrs: 0.3,  initial: -0.1, terminal: -0.2, width: 1.4, notch: false },
  },
};
