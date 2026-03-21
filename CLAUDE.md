# PVC Heart Localization Tool — Project Context for AI Agents

## What This Project Is

An interactive web-based educational tool for cardiology and electrophysiology (EP) fellows. Users click on anatomical locations of a 3D heart model and see the corresponding PVC (premature ventricular contraction) morphology on a 12-lead ECG, along with clinical descriptions and ablation approaches. This is a free educational resource.

**Audience:** Medical students, internal medicine residents, cardiology fellows, and EP fellows.

**Critical constraint:** Clinical accuracy is paramount. All clinical content is AI-drafted from published EP literature with full citations and requires EP physician validation before being considered accurate. Never generate clinical content without citations.

## How to Run

```bash
cd pvc-heart-tool
npm install
npm run dev        # Starts Vite dev server (typically port 5173 or 5174)
npm run build      # Production build (output: dist/)
```

**Known issue:** If Vite throws EPERM errors on cache, the `vite.config.ts` already routes cache to `/tmp/vite-cache`. If building to `dist/` fails due to locked files, use `--outDir dist2`.

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **React Three Fiber (R3F)** + **@react-three/drei** for 3D rendering
- **Three.js** for geometry, materials, raycasting
- No backend — purely client-side SPA

## Architecture Overview

```
App.tsx                    — Root layout: header + ResizablePanel (75/25 split)
  ├── HeartViewer.tsx      — R3F Canvas, camera, lighting, OrbitControls
  │     ├── HeartModel.tsx — Procedural 3D heart (placeholder for GLB)
  │     └── Hotspot.tsx    — Clickable glowing spheres at PVC origin coordinates
  ├── RegionList.tsx       — Sidebar list of PVC origins grouped by category
  ├── ECGPanel.tsx         — Canvas-drawn schematic ECG (placeholder for real images)
  ├── ClinicalInfoPanel.tsx— Description, ECG features, ablation, references
  └── ResizablePanel.tsx   — Draggable horizontal split panel
```

**Data layer:** `src/data/pvcOrigins.ts` — 14 PVC origin entries, each with:
- 3D hotspot coordinates, ECG features (axis, morphology, transition)
- Clinical description, ablation approach, differential locations, prevalence
- Full references with DOI links
- Review status (`"draft"` or `"reviewed"`) — all currently `"draft"`

## Key Design Decisions

1. **One-directional only (MVP):** Click heart → see ECG. Reverse (ECG → heart location) is deferred to a future phase.

2. **Hotspot overlay approach (no Blender):** Invisible clickable spheres are placed at 3D coordinates over the heart model. This avoids needing Blender-segmented mesh regions. Hotspot positions are defined in `pvcOrigins.ts`.

3. **Procedural heart model is a placeholder:** The current heart in `HeartModel.tsx` is built from ~20 Three.js geometries (spheres, cylinders, cones, torus). It approximates anatomical structures but needs to be replaced with a real GLB model.

4. **ECG panel is a placeholder:** `ECGPanel.tsx` draws schematic waveforms procedurally on canvas. The EP physician will source real static 12-lead ECG images from published literature. The panel has a prominent watermark: "SCHEMATIC — NOT CLINICAL ECG."

5. **Clinical content validation flow:** AI drafts content with citations → EP physician reviews and validates → status changes from `"draft"` to `"reviewed"`. The `reviewStatus` field gates what should be shown as validated.

6. **No AI hallucinations policy:** Every piece of clinical content must trace back to published sources. The `references` array on each PVC origin entry contains full citations (authors, title, journal, year, DOI, relevance).

## File-by-File Guide

| File | Purpose | Key Details |
|------|---------|-------------|
| `src/App.tsx` | Root component | Manages `selectedId` state, renders header + ResizablePanel with left (heart + region list) and right (ECG + clinical info) panels |
| `src/components/HeartModel.tsx` | 3D heart geometry | Procedural model from Three.js primitives. Contains commented-out `GLBHeart` component ready for swap. Slow idle rotation via `useFrame`. |
| `src/components/HeartViewer.tsx` | R3F scene setup | Canvas, camera at `[0, 0.5, 4]`, ambient + directional + point lighting, `Environment` preset, `ContactShadows`, `OrbitControls`. Renders HeartModel + all Hotspots. |
| `src/components/Hotspot.tsx` | Clickable markers | Pulsing animated spheres at 3D positions. HTML labels on hover/selection via drei's `Html`. Glow effect on selection. |
| `src/components/ECGPanel.tsx` | ECG display | Canvas-based procedural 12-lead ECG grid. Generates lead-specific morphologies from `ecgFeatures`. **Placeholder only — not clinically accurate.** |
| `src/components/ClinicalInfoPanel.tsx` | Clinical details | Shows review status badge, description, ECG characteristics, ablation approach, prevalence, differentials, cited references with DOI links. |
| `src/components/RegionList.tsx` | Origin list sidebar | Grouped by category (RVOT, Aortic Cusps, etc.). Color-coded dots, selection highlighting. |
| `src/components/ResizablePanel.tsx` | Resizable split layout | Horizontal split with draggable divider. Props: `defaultRightWidth=380`, `minRightWidth=280`, `maxRightWidth=700`. |
| `src/data/pvcOrigins.ts` | Clinical data store | 14 PVC origins with full TypeScript interfaces (`PVCOrigin`, `Reference`). Helper functions: `getCategories()`, `getOriginsByCategory()`, `getOriginById()`. |
| `vite.config.ts` | Build config | `cacheDir: '/tmp/vite-cache'` to avoid EPERM issues on some filesystems. |

## GLB Model Swap Path (Priority Upgrade)

The procedural heart is the biggest visual gap. To replace it with a real anatomical model:

1. Source a GLB/GLTF anatomical heart model (Sketchfab, NIH 3D Print Exchange, etc.)
2. Place it at `public/models/heart.glb`
3. In `HeartModel.tsx`, uncomment the `GLBHeart` component and comment out `ProceduralHeart`
4. Adjust hotspot coordinates in `pvcOrigins.ts` to match the new model's coordinate space
5. Consider building a dev-only coordinate picker tool to help position hotspots on the new model

**Recommended sources:**
- Sketchfab (search "anatomical heart" with Creative Commons license)
- NIH 3D Print Exchange (https://3d.nih.gov)
- Three.js examples repository

## PVC Origins Covered (14 locations)

| ID | Name | Category |
|----|------|----------|
| rvot-septal | RVOT Septal | RVOT |
| rvot-free-wall | RVOT Free Wall | RVOT |
| lcc | Left Coronary Cusp | Aortic Cusps |
| rcc | Right Coronary Cusp | Aortic Cusps |
| ncc | Non-Coronary Cusp | Aortic Cusps |
| mitral-anterior | Anterior Mitral Annulus | Mitral Annular |
| mitral-posterior | Posterior Mitral Annulus | Mitral Annular |
| tricuspid-septal | Tricuspid Septal Annulus | Tricuspid Annular |
| papillary-anterolateral | Anterolateral Papillary | Papillary Muscles |
| papillary-posteromedial | Posteromedial Papillary | Papillary Muscles |
| lv-summit | LV Summit (GCV/AIV) | Epicardial |
| his-bundle | His Bundle / Para-Hisian | Septal |
| moderator-band | Moderator Band | RV |
| crux | Crux of the Heart | Epicardial |

## Priority Tasks (in order)

1. **Source and integrate a real anatomical heart GLB model** — Replace the procedural placeholder. This is the single most impactful visual improvement.
2. **Build a dev-only hotspot coordinate picker** — A tool that lets you click on the GLB model surface and log 3D coordinates, so hotspot positions can be precisely placed.
3. **Refine hotspot positions** — Once the GLB is loaded, adjust all 14 hotspot coordinates in `pvcOrigins.ts`.
4. **ECG image integration** — The EP physician will provide static 12-lead ECG images from literature. When available, update each origin's `ecgImage` field and modify `ECGPanel.tsx` to display real images instead of procedural schematics.
5. **Clinical content review** — EP physician validates each origin's `description`, `ecgFeatures`, `ablationApproach`, and `references`. Update `reviewStatus` to `"reviewed"` for validated entries.
6. **UI polish** — Responsive design, mobile support, loading states, error boundaries, accessibility.
7. **Future phase: bidirectional lookup** — Given an ECG pattern, identify possible heart locations (reverse direction).

## Companion Documents

- `../PVC-Heart-Visualization-Project-Plan.md` — Full project plan with vision, rationale, tech stack details, development timeline (~8 days with AI assistance), risk mitigations
- `../Guide-3D-Model-Preparation.md` — Detailed guide for 3D model preparation with three approaches (A: hotspot overlays, B: pre-segmented, C: full Blender segmentation)

## Code Style & Conventions

- Functional React components with hooks (no class components)
- Inline styles (no CSS-in-JS library or CSS modules — kept simple for MVP)
- TypeScript strict mode
- All clinical data centralized in `pvcOrigins.ts` (single source of truth)
- Materials are memoized with `useMemo` in Three.js components
- R3F patterns: `useFrame` for animation, `useGLTF` for model loading (drei)
