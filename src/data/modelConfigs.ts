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
  // RVOT
  "rvot-septal",
  "rvot-freewall",
  "rvot-anterior",
  "rvot-posterior",
  // LVOT / Aortic Cusps
  "lvot-lcc",
  "lvot-rcc",
  "lvot-lcc-rcc",
  // Mitral Annulus
  "mitral-anterior",
  "mitral-posterior",
  "mitral-lateral",
  // Tricuspid Annulus
  "tricuspid-septal",
  "tricuspid-anterior",
  "tricuspid-posterior",
  // Papillary Muscles (LV)
  "papillary-anterolateral",
  "papillary-posteromedial",
  // Papillary Muscles (RV)
  "papillary-rv-anterior",
  "papillary-rv-posterior",
  "papillary-rv-septal",
  // LV Summit
  "lv-summit-gcv",
  "lv-summit-aiv",
  // Other
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

const interiorHeartHighDetail: ModelConfig = {
  id: "university-of-dundee-interior-heart-high-detail",
  name: "Interior Heart — High Detail",
  file: "models/university-of-dundee-interior-heart-high-detail.glb",
  hiddenMeshes: [],
  scale: null,
  positionOffset: null,
  // hotspotPositions: blankHotspots(),
  hotspotPositions: {
    "rvot-septal": [0.056, -0.095, 0.267],
    "rvot-freewall": [0.055, 0.102, 0.570],
    "rvot-anterior": [0.309, -0.121, 0.517],
    "rvot-posterior": [-0.166, -0.042, 0.558],
    "lvot-lcc": [0.023, -0.066, -0.053],
    "lvot-rcc": [0.066, -0.096, 0.167],
    "lvot-lcc-rcc": [0.085, -0.016, 0.048],
    "mitral-anterior": [0.258, -0.210, -0.111],
    "mitral-posterior": [-0.035, -0.610, -0.195],
    "mitral-lateral": [0.190, -0.438, -0.240],
    "tricuspid-septal": [-0.245, -0.462, 0.030],
    "tricuspid-anterior": [-0.251, -0.204, 0.302],
    "tricuspid-posterior": [-0.404, -0.599, 0.249],
    "papillary-anterolateral": [0.485, -0.582, 0.140],
    "papillary-posteromedial": [0.337, -0.498, 0.394],
    "papillary-rv-anterior": [0.204, -0.687, 0.651],
    "papillary-rv-posterior": [-0.052, -0.760, 0.462],
    "papillary-rv-septal": [0.000, -0.336, 0.306],
    "lv-summit-gcv": [0.312, -0.016, -0.014],
    "lv-summit-aiv": [0.467, 0.043, 0.254],
    "his-bundle": [-0.139, -0.185, 0.254],
    "moderator-band": [0.267, -0.424, 0.578],
    "crux": [-0.166, -0.704, 0.016]
  },
};

const heartCurrent: ModelConfig = {
  id: "human-heart-internal-structure-3d-model",
  name: "Human Heart Internal Structure 3D Model",
  file: "models/human-heart-internal-structure-3d-model.glb",
  hiddenMeshes: [],
  scale: null,
  positionOffset: null,
  hotspotPositions: blankHotspots(),
};

const heartSmall: ModelConfig = {
  id: "3d-edutex-human-heart",
  name: "3D EduTex Human Heart",
  file: "models/3d-edutex-human-heart.glb",
  hiddenMeshes: [],
  scale: null,
  positionOffset: null,
  hotspotPositions: blankHotspots(),
};

const heartMedium: ModelConfig = {
  id: "heart-medium",
  name: "Heart Model (Medium)",
  file: "models/heart-1_compressed.glb",
  hiddenMeshes: [],
  scale: null,
  positionOffset: null,
  hotspotPositions: blankHotspots(),
};

// ─── Registry ───

export const modelConfigs: Record<string, ModelConfig> = {
  "university-of-dundee-interior-heart-high-detail": interiorHeartHighDetail,
  "human-heart-internal-structure-3d-model": heartCurrent,
  "3d-edutex-human-heart": heartSmall,
  "heart-medium": heartMedium,
};

/** Which model to use — change this to swap models */
export const activeModelId = "university-of-dundee-interior-heart-high-detail";

export function getActiveModelConfig(): ModelConfig {
  return modelConfigs[activeModelId];
}

export function getModelConfig(id: string): ModelConfig | undefined {
  return modelConfigs[id];
}

export function listModelConfigs(): ModelConfig[] {
  return Object.values(modelConfigs);
}
