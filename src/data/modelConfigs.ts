/**
 * Model configuration system.
 *
 * Each heart GLB model gets its own config defining:
 * - File path and display name
 * - Which mesh names to hide (e.g. built-in labels)
 * - Hotspot position mappings for PVC origins
 * - Scale/position overrides if needed
 *
 * To add a new model:
 * 1. Drop the .glb into public/models/
 * 2. Add a config entry below
 * 3. Map hotspot positions using Mapping Mode in the viewer
 * 4. Set it as activeModelId
 */

export interface ModelConfig {
  id: string;
  name: string;
  file: string; // path relative to public/
  /** Mesh names or indices to hide (e.g. built-in labels/annotations) */
  hiddenMeshes: (string | number)[];
  /** Override scale — null = auto-fit */
  scale: number | null;
  /** Override position offset [x, y, z] — null = auto-center */
  positionOffset: [number, number, number] | null;
  /** Hotspot positions keyed by PVC origin ID. null = not yet mapped */
  hotspotPositions: Record<string, [number, number, number] | null>;
}

// ─── Shared origin IDs (must match pvcOrigins.ts) ───
export const ORIGIN_IDS = [
  "rvot-septal",
  "rvot-freewall",
  "lvot-lcc",
  "lvot-rcc",
  "lvot-rlcc",
  "mitral-annulus-anterior",
  "mitral-annulus-posterior",
  "tricuspid-annulus-septal",
  "lv-papillary-anterolateral",
  "lv-papillary-posteromedial",
  "lv-summit",
  "aortic-cusp-noncoronary",
  "rv-moderator-band",
  "crux-of-heart",
] as const;

/** Creates a blank hotspot map with all origins set to null (unmapped) */
export function blankHotspots(): Record<string, [number, number, number] | null> {
  const map: Record<string, [number, number, number] | null> = {};
  for (const id of ORIGIN_IDS) {
    map[id] = null;
  }
  return map;
}

// ─── Model Configs ───

const heartCurrent: ModelConfig = {
  id: "heart-current",
  name: "Heart Model (Current)",
  file: "models/heart.glb",
  hiddenMeshes: [],
  scale: null,
  positionOffset: null,
  hotspotPositions: blankHotspots(),
};

const heartLarge: ModelConfig = {
  id: "heart-large",
  name: "Detailed Anatomical Heart (Large)",
  file: "models/heart-0.glb",
  hiddenMeshes: [0, 2, 6, 22, 23, 30],
  scale: null,
  positionOffset: null,
  hotspotPositions: blankHotspots(),
};

const heartMedium: ModelConfig = {
  id: "heart-medium",
  name: "Heart Model (Medium)",
  file: "models/heart-1.glb",
  hiddenMeshes: [],
  scale: null,
  positionOffset: null,
  hotspotPositions: blankHotspots(),
};

const heartSmall: ModelConfig = {
  id: "heart-small",
  name: "3D EduTex Heart (Small)",
  file: "models/heart-2.glb",
  hiddenMeshes: [],
  scale: null,
  positionOffset: null,
  hotspotPositions: blankHotspots(),
};

// ─── Registry ───

export const modelConfigs: Record<string, ModelConfig> = {
  "heart-current": heartCurrent,
  "heart-large": heartLarge,
  "heart-medium": heartMedium,
  "heart-small": heartSmall,
};

/** Which model to use — change this to swap models */
export const activeModelId = "heart-current";

export function getActiveModelConfig(): ModelConfig {
  return modelConfigs[activeModelId];
}

export function getModelConfig(id: string): ModelConfig | undefined {
  return modelConfigs[id];
}

export function listModelConfigs(): ModelConfig[] {
  return Object.values(modelConfigs);
}
