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
- Single active model (Interior Heart — High Detail); model switcher disabled, config system supports re-enabling
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

**Active model:** `university-of-dundee-interior-heart-high-detail.glb` (11MB, Draco-compressed) — all 23 PVC origin hotspots are mapped to this model.

The model switcher UI is disabled per EP physician guidance. The model config system (`modelConfigs.ts`) still supports multiple models, but only the Interior Heart — High Detail model is shown in the UI. Other model configs remain in code for future use but have no hotspot mappings. See `heart-models.md` for download links and candidate models.

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
- [x] Collated REFERENCES.md with all peer-reviewed citations, ECG sources, and mapping references

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

## Reference Maintenance (MANDATORY)

All peer-reviewed literature, textbook citations, ECG profile sources, and anatomical mapping references are collated in `REFERENCES.md`. **Any agent that adds, modifies, or removes a reference anywhere in this project MUST update `REFERENCES.md` to stay in sync.**

### When to update REFERENCES.md

- Adding a new PVC origin with `references[]` entries
- Adding or changing a reference on an existing PVC origin in `pvcOrigins.ts`
- Adding new ECG profile source citations in `ecgProfiles.ts` header comments
- Adding anatomical/mapping references in `heart-models.md`
- Citing any peer-reviewed paper, textbook, or educational resource anywhere in the project

### How to update

1. Add a row to the appropriate topic table in `REFERENCES.md` (key, full citation, DOI, "Used By" origins)
2. If it's a new topic area, add a new subsection under "Peer-Reviewed Literature"
3. If updating an existing citation (e.g., correcting authors or DOI), update both the source file and `REFERENCES.md`
4. Verify DOI links resolve when adding new entries

### Canonical data flow

```
pvcOrigins.ts (references[] arrays)  ─┐
ecgProfiles.ts (header comments)      ├──▶  REFERENCES.md
heart-models.md (mapping references)  ─┘
```

The source of truth for per-origin citations is `pvcOrigins.ts`. `REFERENCES.md` is the collated, human-readable index for reviewers and collaborators.

## Documentation Files
- `CLAUDE.md` — This file. Agent context and instructions.
- `REFERENCES.md` — **Complete bibliography**: all peer-reviewed citations, ECG sources, mapping references, model attributions
- `PVC-Heart-Visualization-Project-Plan.md` — Full project plan, architecture, progress log
- `Guide-3D-Model-Preparation.md` — How to prepare heart models (hotspot vs segmentation approaches)
- `heart-models.md` — Curated links to heart models, ECG references, mapping guide
- `README.md` — Setup, deployment, and user-facing documentation
