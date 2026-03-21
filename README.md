# PVC Heart Localization Tool

Interactive 3D cardiac anatomy viewer for mapping premature ventricular contraction (PVC) origins to 12-lead ECG morphologies. Built for electrophysiology education.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── App.tsx                          # Main layout, routing between views
├── components/
│   ├── HeartViewer.tsx              # 3D canvas, lighting, camera, hotspots
│   ├── HeartModel.tsx               # GLB loader, auto-center/scale, BVH acceleration
│   ├── CameraController.tsx         # Orbit controls, smooth zoom, reset view
│   ├── ViewerControls.tsx           # Toolbar: zoom, rotate, brightness slider
│   ├── Hotspot.tsx                  # Clickable PVC origin markers on heart surface
│   ├── MappingPanel.tsx             # Interactive hotspot position mapping tool
│   ├── ECGPanel.tsx                 # 12-lead ECG display
│   ├── ClinicalInfoPanel.tsx        # Clinical descriptions, ECG features, references
│   ├── RegionList.tsx               # Selectable PVC origin list
│   └── ResizablePanel.tsx           # Collapsible horizontal split panel
├── data/
│   ├── pvcOrigins.ts                # Clinical data for all PVC origins (14 entries)
│   └── modelConfigs.ts              # Per-model configs: file, hidden meshes, hotspot positions
public/
├── models/                          # GLB heart models
│   ├── heart.glb                    # Active model (34MB)
│   ├── heart-0.glb                  # Large detailed model (116MB)
│   ├── heart-1.glb                  # Medium model (4.2MB)
│   └── heart-2.glb                  # Small model (751K)
├── ecg/                             # ECG images (pending EP physician sourcing)
```

## Swapping Heart Models

1. Drop a `.glb` file into `public/models/`
2. Add a config entry in `src/data/modelConfigs.ts`
3. Set `activeModelId` to the new config's ID
4. Use **Mapping Mode** to place hotspots (see below)

## Mapping Mode

Maps PVC origin hotspot positions to any heart model — no code changes needed.

1. Open the app, ensure no PVC origin is selected (right panel shows the list)
2. Click **"Edit Mappings"** button in the right panel header
3. Click on the heart surface to place a marker
4. Select the PVC origin from the dropdown to assign that position
5. Repeat for all 14 origins — green markers show mapped positions
6. Click **"Copy mappings as JSON"** to export, then paste into `modelConfigs.ts`
7. Click **"Exit"** to return to normal mode

## Viewer Controls

| Action | Input |
|--------|-------|
| Rotate | Left-click drag |
| Zoom | Scroll wheel / toolbar buttons |
| Pan | Right-click drag / middle-click drag |
| Zoom inside model | Scroll past the surface (min distance = 0) |
| Reset view | Toolbar button |
| Auto-rotate | Toolbar toggle (off by default) |
| Brightness | Vertical slider on toolbar (10%–300%) |
| Collapse right panel | Chevron button or double-click divider |

## Tech Stack

- **React 19** + **TypeScript**
- **React Three Fiber** + **Three.js** — 3D rendering
- **@react-three/drei** — OrbitControls, useGLTF, Environment, ContactShadows
- **three-mesh-bvh** — BVH acceleration for fast raycasting on high-poly models
- **Vite** — dev server and build

## Key Design Decisions

- **Hotspot overlay approach** — clickable markers placed at 3D coordinates, not mesh segmentation. Works with any single-mesh heart model. See `Guide-3D-Model-Preparation.md` for alternatives.
- **Per-model config system** — each model stores its own hotspot positions, hidden meshes, and scale. Swap models without losing mapping work.
- **Clinical accuracy first** — all content is AI-drafted with citations but gated behind `reviewStatus: "draft"` until EP physician validates. See `PVC-Heart-Visualization-Project-Plan.md` for the full content pipeline.

## Documentation

- [`PVC-Heart-Visualization-Project-Plan.md`](./PVC-Heart-Visualization-Project-Plan.md) — Full project plan, architecture, clinical accuracy requirements, progress log
- [`Guide-3D-Model-Preparation.md`](./Guide-3D-Model-Preparation.md) — How to prepare and evaluate heart models (hotspot vs segmentation approaches)
- [`heart-models.md`](./heart-models.md) — Curated links to free heart 3D models (external surface + cross-sectional)
