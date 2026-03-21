# PVC Heart Localization Tool — Agent Context

## IMPORTANT: Keep This File Updated

**Any agent working on this project MUST update this file and the project plan (`PVC-Heart-Visualization-Project-Plan.md`) before ending a session.** When you make architectural changes, add features, fix bugs, or change data structures — reflect those changes here immediately. Future agents depend on this file for accurate context. If you add a new component, update the architecture section. If you change how data flows, update the data layer section. If you complete a task, update the status section.

---

## What This Project Is

An interactive web-based educational tool for electrophysiology (EP) education. Users explore a 3D heart model, click on PVC origin locations, and see corresponding 12-lead ECG morphologies with clinical descriptions and ablation approaches.

**Audience:** Medical students, residents, cardiology/EP fellows. **Cost:** Free.

**Critical constraint:** Clinical accuracy is paramount. All content is AI-drafted from published EP literature with full citations. Every entry requires EP physician validation before production use.

## How to Run

```bash
npm install
npm run dev          # Dev server (port 5173)
npm run build        # Production build → dist/
vercel --prod --yes  # Deploy to Vercel
```

Models go in `public/models/` (gitignored — see `heart-models.md` for download links).

**Live deployment:** https://pvc-heart-tool.vercel.app
**GitHub:** https://github.com/karansuraj/pvc-heart-tool (private)

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **React Three Fiber** + **@react-three/drei** — 3D rendering
- **three-mesh-bvh** — BVH acceleration for fast raycasting on high-poly models
- **Vercel** — deployment (static assets + CDN)

## Architecture

```
App.tsx                         — Root: selectedId, detailId, hoveredId, mappingMode, model state
├── HeartViewer.tsx              — R3F Canvas, lighting, camera, model, hotspots, visual settings
│   ├── HeartModel.tsx           — GLB loader, auto-center/scale, BVH, visual settings application
│   ├── Hotspot.tsx              — Clickable markers with labels, hover/selection state
│   ├── CameraController.tsx     — OrbitControls, smooth zoom, spin-to-hotspot, save/load default view
│   ├── SurfacePointer.tsx       — Raycasts mouse position on heart surface (mapping mode)
│   ├── ViewerControls.tsx       — Toolbar: zoom, reset, rotate, focus, save view, settings
│   └── VisualSettings.tsx       — Settings panel: brightness, roughness, metalness, opacity, wireframe, color tint
├── MappingPanel.tsx             — Interactive hotspot position mapping tool
├── RegionList.tsx               — PVC origin list with select/hover/detail actions
├── ECGPanel.tsx                 — 12-lead ECG renderer with expandable modal
├── ClinicalInfoPanel.tsx        — Clinical descriptions, ECG features, ablation, references
└── ResizablePanel.tsx           — Collapsible horizontal split panel
```

## Data Layer

| File | Purpose |
|------|---------|
| `src/data/pvcOrigins.ts` | 23 PVC origin entries with clinical content, ECG features, citations |
| `src/data/modelConfigs.ts` | Per-model configs: file path, hidden meshes, hotspot positions, scale |
| `src/data/ecgProfiles.ts` | Literature-derived per-lead ECG morphology profiles for all 23 origins |

### Key data types:
- `PVCOrigin` — id, name, category, hotspotPosition, ecgFeatures, description, ablationApproach, references, reviewStatus
- `ModelConfig` — id, name, file, hiddenMeshes, scale, positionOffset, hotspotPositions (Record<string, [x,y,z] | null>)
- `ECGProfile` — per-lead { qrs, initial, terminal, width, notch } for all 12 leads

### Origin IDs (23 total — must stay in sync across all 3 data files):
RVOT: `rvot-septal`, `rvot-freewall`, `rvot-anterior`, `rvot-posterior`
LVOT: `lvot-lcc`, `lvot-rcc`, `lvot-lcc-rcc`
Mitral: `mitral-anterior`, `mitral-posterior`, `mitral-lateral`
Tricuspid: `tricuspid-septal`, `tricuspid-anterior`, `tricuspid-posterior`
LV Papillary: `papillary-anterolateral`, `papillary-posteromedial`
RV Papillary: `papillary-rv-anterior`, `papillary-rv-posterior`, `papillary-rv-septal`
LV Summit: `lv-summit-gcv`, `lv-summit-aiv`
Other: `his-bundle`, `moderator-band`, `crux`

## Key Features

### 3D Viewer
- GLB model loading with auto-center/scale/BVH acceleration
- Model switcher dropdown (top-right) — 4 models registered, Draco-compressed models supported
- Visual settings panel: brightness, exposure, roughness, metalness, opacity, color tint, wireframe, double-sided
- Camera: smooth zoom (trackpad-optimized), horizontal spin-to-hotspot, save/load default view
- Hotspots: colored markers per origin, labels on hover, click opens detail view

### Mapping Mode
- Enter via "Edit Mappings" button in right panel
- Click heart surface → orange pending marker + coordinates displayed
- Assign to PVC origin via dropdown → colored marker appears
- Live coordinate readout at bottom-left while hovering
- "Copy mappings as JSON" exports for pasting into `modelConfigs.ts`
- Per-model positions stored in `modelConfigs.ts`

### ECG Renderer
- Literature-derived per-lead profiles in `src/data/ecgProfiles.ts`
- Each origin has hardcoded QRS polarity, amplitude, initial/terminal deflections, width, notching
- Sources: Dixit 2003, Yamada 2008, Tada 2005/2007, Yamada 2010, Enriquez 2017, Sadek 2015
- Click-to-expand modal with full-size rendering + ECG feature summary
- Still marked as schematic pending EP physician validation

### Right Panel
- **List view**: click to select (highlight + spin), double-click or arrow for details
- **Detail view**: ECG + clinical info + back button
- Hover highlight: hovering hotspot on 3D model highlights + auto-scrolls to list item
- Collapsible via chevron button

## Models

| File | Size | Config ID | Deployed |
|------|------|-----------|----------|
| `university-of-dundee-interior-heart-high-detail.glb` | 11MB | `university-of-dundee-interior-heart-high-detail` | Yes (default) |
| `human-heart-internal-structure-3d-model.glb` | 34MB | `human-heart-internal-structure-3d-model` | Yes |
| `heart-1.glb` | 4.2MB | `heart-medium` | Yes |
| `3d-edutex-human-heart.glb` | 751K | `3d-edutex-human-heart` | Yes |

Models are gitignored and Draco-compressed for deployment. Drei's `useGLTF` has built-in Draco decoder support. See `heart-models.md` for download links and ECG reference sources.

## What's Done vs What's Remaining

### Done
- [x] 3D viewer with GLB loading, controls, visual settings
- [x] 23 PVC origins with clinical content and citations
- [x] Literature-derived ECG profiles for all 23 origins
- [x] Interactive mapping mode for hotspot positioning
- [x] Per-model config system with model switcher
- [x] Collapsible resizable panels
- [x] Fly-to-hotspot (horizontal spin)
- [x] Hover highlight + auto-scroll
- [x] ECG modal expansion
- [x] Vercel deployment
- [x] GitHub repo

### Remaining
- [ ] EP physician validation of all clinical content (all 23 entries are "draft")
- [ ] Real ECG images to replace/supplement schematic renderer
- [ ] Hotspot position refinement for all 23 origins
- [ ] Landing/intro page
- [ ] Mobile responsive layout
- [ ] Cross-sectional heart model (ideal for internal PVC origins)

## Code Conventions
- Functional React components with hooks
- Inline styles (no CSS library)
- TypeScript strict mode
- All clinical data in `src/data/` (single source of truth)
- R3F patterns: `useFrame` for animation, `useGLTF` for models, `forwardRef` + `useImperativeHandle` for camera control

## Documentation Files
- `CLAUDE.md` — This file. Agent context and instructions.
- `PVC-Heart-Visualization-Project-Plan.md` — Full project plan, architecture, progress log
- `Guide-3D-Model-Preparation.md` — How to prepare heart models (hotspot vs segmentation approaches)
- `heart-models.md` — Curated links to heart models, ECG references, mapping guide
- `README.md` — Setup, deployment, and user-facing documentation
