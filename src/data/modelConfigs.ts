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
  "aortic-ncc",
  "mitral-anterior",
  "mitral-posterior",
  "tricuspid-septal",
  "papillary-anterolateral",
  "papillary-posteromedial",
  "lv-summit-gcv",
  "his-bundle",
  "moderator-band",
  "crux",
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
  hotspotPositions: {
    "rvot-septal": [-0.275, 0.371, 0.094],
    "rvot-freewall": [-0.051, -0.043, -0.060],
    "lvot-lcc": [-0.380, 0.360, 0.394],
    "lvot-rcc": [0.064, -0.220, 0.124],
    "aortic-ncc": [0.446, -0.746, -0.479],
    "mitral-anterior": [-0.175, -0.252, 0.138],
    "mitral-posterior": [0.296, -0.225, -0.207],
    "tricuspid-septal": [0.030, 0.273, -0.194],
    "papillary-anterolateral": [0.033, -0.018, -0.238],
    "papillary-posteromedial": [0.086, -0.165, -0.068],
    "lv-summit-gcv": [-0.549, 0.812, -0.024],
    "his-bundle": [-0.105, 0.509, -0.381],
    "moderator-band": [-0.255, -0.059, 0.091],
    "crux": [-0.291, 0.182, 0.043]
  }
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
