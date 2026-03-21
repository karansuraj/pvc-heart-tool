# PVC Heart Visualization Tool — Project Plan

## Vision

An interactive, web-based educational tool that allows cardiology fellows and medical learners to explore a 3D anatomically accurate heart model. By clicking on specific anatomical locations, users see the corresponding PVC (premature ventricular contraction) morphology on a 12-lead ECG, along with clinical descriptions and treatment/ablation approaches.

**Audience:** Medical students, internal medicine residents, cardiology fellows, and electrophysiology sub-specialty fellows.

**Cost to users:** Free.

---

## Educational Rationale

When patients present with PVCs or ventricular tachycardia (VT), successful treatment depends on identifying where the arrhythmia originates within the heart. Because the heart is oriented similarly in most individuals, PVCs from specific anatomic locations produce highly reproducible ECG patterns. An experienced electrophysiologist can identify the origin within seconds of seeing the ECG.

Learning this pattern recognition currently takes a long time through clinical exposure. This tool accelerates that process by letting learners explore the anatomy-to-ECG relationship directly — click a location on the heart, immediately see its ECG signature and clinical description. The spatial, interactive format builds intuition that static textbook pages cannot.

---

## Clinical Accuracy & Source Traceability

**This is the single most important non-functional requirement of the entire project.** Medical students and fellows will use this tool to learn patterns that directly influence patient care. Every piece of clinical content must be verifiable, traceable to published literature, and reviewed by a qualified electrophysiologist before it goes live.

### Guiding Principles

**No AI-generated clinical assertions.** AI tools (including Claude) can help with code, UI, project management, and structuring content — but the clinical facts themselves (ECG morphologies, anatomic descriptions, ablation approaches) must originate from peer-reviewed medical literature or established textbooks and be verified by the EP physician. AI should never be the source of truth for what a PVC from the LCC "looks like."

**Every fact is cited.** Each PVC origin entry in the data store includes references to the specific papers, textbook chapters, or guidelines that support the claims. This serves two audiences: (1) the medical reviewers who validate the content before launch, and (2) the learners who want to go deeper or verify what they're reading.

**ECG images are sourced, not generated.** Static ECG images come from published case studies, atlases, or clinical recordings — with proper attribution and licensing. If images are reproduced or adapted, the original source is always cited.

### Content Development Workflow (MVP)

To minimize the upfront lift while maintaining accuracy, the content pipeline works as follows:

1. **AI-drafted, literature-grounded content** — Claude pre-populates the full JSON data store (descriptions, ECG features, ablation approaches) by drawing on well-established, widely-cited EP literature (Josephson, Dixit/Marchlinski, Yamada, etc.). Every entry ships with citations already attached. This is not AI "making up" clinical facts — it's structuring and summarizing what's already published, with explicit source attribution.
2. **EP physician validation pass** — The physician reviews each entry, confirms or corrects the clinical details, and flags anything that needs adjustment. This is a validation task, not an authoring task — a few focused hours rather than weeks of writing from scratch.
3. **Nothing goes live unchecked** — The `reviewStatus` field in each JSON entry gates what appears in production. Entries stay in `"draft"` until the EP physician marks them `"reviewed"`.

For post-MVP, a second reviewer and more formal editorial process can be layered on as the tool scales. But for the initial build, one qualified EP physician reviewing AI-structured content against cited sources is sufficient and keeps velocity high.

### Citation Format in the Application

For end users, citations appear at the bottom of each clinical info panel — brief enough not to clutter the learning experience, but present enough that a curious learner (or a skeptical attending) can verify any claim. Example format:

> *Sources: Dixit et al., Circ Arrhythm Electrophysiol 2003; Josephson's Clinical Cardiac Electrophysiology, 6th Ed, Ch. 11; Yamada et al., Heart Rhythm 2008.*

For reviewers, the full JSON data includes structured citation objects (see Data Model below) with DOIs and page numbers where applicable.

---

## Screen Layout

The primary interface is a single-screen split layout:

```
┌─────────────────────────────────────┬──────────────────┐
│                                     │                  │
│         3D Heart Model              │   ECG Waveform   │
│         (Interactive)               │   (Static Image) │
│                                     │                  │
│         ~75% of screen              │                  │
│                                     │   Clinical Info  │
│   - Rotate / zoom / pan             │   & Description  │
│   - Click anatomic regions          │                  │
│   - Highlighted hotspots            │   ~25% of screen │
│                                     │                  │
└─────────────────────────────────────┴──────────────────┘
```

The heart model dominates the left side (~75% width). When a user clicks a specific anatomical region, the right panel (~25%) updates to show the corresponding 12-lead ECG and clinical text.

---

## Core Feature Set (MVP)

### 1. Interactive 3D Heart Model (Left Panel — ~75% width)
- Anatomically accurate 3D rendering of the heart
- Rotate, zoom, and pan controls (orbit controls)
- Clickable regions corresponding to common PVC origin sites
- Visual highlighting of selected regions (color change, glow effect)
- Labels/tooltips on hover showing anatomical region names
- Only specific anatomic areas are clickable — not the entire surface

### 2. 12-Lead ECG Display (Right Panel — upper section)
- Static ECG images sourced from published medical literature
- Standard 12-lead layout (I, II, III, aVR, aVL, aVF, V1–V6)
- Clean, clinical-quality presentation on a grid background
- Images curated by an EP-trained physician for clinical accuracy
- Updates immediately when a new heart region is selected

### 3. Clinical Information Panel (Right Panel — lower section)
- Anatomical description of the selected PVC origin
- ECG characteristics and diagnostic features (axis, bundle branch morphology, transition, etc.)
- General approach to treatment and ablation for that location
- Key differentiating features from nearby origins — because in practice, the skill is distinguishing between adjacent locations

### 4. Educational Wrapper
- Simple, clean website scaffold around the tool
- Brief introduction explaining how to use the tool
- Mobile-responsive design (though 3D interaction is best on desktop)

---

## PVC Origin Locations to Include

These are the most clinically important and commonly tested PVC origin sites:

| Region | Key Sub-locations |
|--------|-------------------|
| **Right Ventricular Outflow Tract (RVOT)** | Septal, free wall, anterior, posterior |
| **Left Ventricular Outflow Tract (LVOT)** | Left coronary cusp, right coronary cusp, LCC-RCC commissure |
| **Aortic Cusps** | Left coronary cusp, right coronary cusp, non-coronary cusp |
| **Mitral Annulus** | Anterior, posterior, lateral |
| **Tricuspid Annulus** | Septal, anterior, posterior |
| **Papillary Muscles** | Anterolateral, posteromedial (LV); anterior, posterior, septal (RV) |
| **LV Summit / Epicardial** | Great cardiac vein, anterior interventricular vein |
| **His Bundle / Para-Hisian** | — |
| **Moderator Band** | — |
| **Crux of the Heart** | — |

This gives roughly 20–30 distinct clickable regions, which is a strong MVP scope.

---

## Recommended Tech Stack

### Frontend Framework: **React + TypeScript**
- Industry-standard for interactive web apps
- Rich ecosystem for UI components
- Strong typing catches bugs early

### 3D Rendering: **React Three Fiber (R3F) + Three.js**
- R3F is a React-native wrapper around Three.js — lets you write 3D scenes as React components
- Declarative, composable, plays well with React state management
- Ecosystem includes `@react-three/drei` (pre-built helpers: OrbitControls, loaders, annotations)
- Three.js raycasting handles click detection on the heart surface
- For complex meshes, `three-mesh-bvh` optimizes raycasting performance

### 3D Heart Model: **glTF format from open-source medical repositories**
- **Primary source:** [NIH 3D Print Exchange Heart Library](https://3d.nih.gov/collections/heart-library) — models from real patient MRI data, Creative Commons licensed
- **Alternative:** [Sketchfab Cardiac Anatomy Collection](https://sketchfab.com/anatomy_dundee/collections/cardiac-anatomy-e95b3ba669144e57badb640fbcf83bd9) (University of Dundee) — downloadable in glTF
- **Format:** glTF/GLB (optimized for web, compact, supports materials and textures)
- **MVP approach:** Use the model as-is with hotspot overlays for clickable regions — no 3D modeling tools required. See [Guide-3D-Model-Preparation.md](./Guide-3D-Model-Preparation.md) for details and post-MVP options if more visual polish is needed later

### ECG Display: **Static images (PNG/SVG)**
- Pre-made 12-lead ECG images sourced from published medical literature and curated by the EP physician
- Displayed in a standard clinical grid layout
- This is a content curation task, not a rendering task — the images already exist in textbooks, atlases, and published case studies
- Future enhancement: switch to dynamic SVG/Canvas rendering for more interactivity

### Hosting: **Vercel or Netlify**
- Free tier handles this use case easily
- Automatic deploys from Git
- CDN for fast global delivery of 3D assets

---

## Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                         React App                              │
│                                                               │
│  ┌──────────────────────────────┐  ┌────────────────────────┐ │
│  │                              │  │     ECG Panel          │ │
│  │     3D Heart Viewer          │  │     (Static 12-lead)   │ │
│  │     (R3F Canvas)             │  │                        │ │
│  │                              │  ├────────────────────────┤ │
│  │  - OrbitControls             │  │                        │ │
│  │  - Raycaster for clicks      │  │     Clinical Info      │ │
│  │  - Region highlighting       │  │     - Description      │ │
│  │                              │  │     - ECG features     │ │
│  │         ~75% width           │  │     - Ablation notes   │ │
│  │                              │  │                        │ │
│  └──────────────┬───────────────┘  └───────────▲────────────┘ │
│                 │                               │              │
│                 ▼                               │              │
│  ┌─────────────────────────────────────────────┴────────────┐ │
│  │              App State (React Context)                    │ │
│  │    selectedRegion → triggers ECG image + info load        │ │
│  └──────────────────────────┬───────────────────────────────┘ │
│                             │                                 │
│  ┌──────────────────────────▼───────────────────────────────┐ │
│  │              Clinical Data Store (JSON)                   │ │
│  │    { regionId, ecgImagePath, description,                │ │
│  │      ecgFeatures, ablationApproach, ... }                │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

**Data flow:**
1. User clicks a region on the 3D heart
2. Raycaster identifies the mesh/region ID
3. App state updates `selectedRegion`
4. ECG panel loads the corresponding 12-lead image
5. Clinical info panel renders the description, ECG features, and ablation notes

---

## Data Model

Each PVC origin is stored as a JSON object. Note the `references` field — every clinical claim traces back to published literature:

```json
{
  "id": "rvot-septal",
  "name": "RVOT Septal",
  "fullName": "Right Ventricular Outflow Tract — Septal",
  "category": "RVOT",
  "meshId": "rvot_septal_mesh",
  "coordinates": { "x": 0.12, "y": 0.85, "z": -0.03 },

  "ecgImage": "/assets/ecg/rvot-septal.png",
  "ecgImageSource": {
    "description": "12-lead ECG showing RVOT septal PVC",
    "origin": "Adapted from Dixit et al., Figure 3",
    "license": "Reproduced with permission / Fair use for education"
  },

  "ecgFeatures": {
    "axis": "Inferior (positive in II, III, aVF)",
    "morphology": "LBBB pattern (QS in V1)",
    "transition": "V3-V4",
    "otherFeatures": ["Tall R in inferior leads", "No Q waves in I or aVL"]
  },

  "description": "The RVOT septum is the most common site of idiopathic PVCs...",
  "ablationApproach": "Approached from the right femoral vein via the IVC...",
  "differentialLocations": ["rvot-freewall", "lvot-lcc"],
  "prevalence": "Most common (~70% of idiopathic outflow tract PVCs)",

  "references": [
    {
      "id": "dixit-2003",
      "authors": "Dixit S, Gerstenfeld EP, Callans DJ, Marchlinski FE",
      "title": "Electrocardiographic patterns of superior right ventricular outflow tract tachycardias",
      "journal": "Circ Arrhythm Electrophysiol",
      "year": 2003,
      "doi": "10.1161/01.CIR.0000068735.74146.90",
      "relevance": "ECG morphology criteria for RVOT septal vs free wall"
    },
    {
      "id": "josephson-ch11",
      "authors": "Josephson ME",
      "title": "Clinical Cardiac Electrophysiology, 6th Edition",
      "journal": "Lippincott Williams & Wilkins",
      "year": 2020,
      "chapter": "Ch. 11: Ventricular Tachycardia",
      "relevance": "Anatomic description and ablation approach"
    }
  ],

  "reviewStatus": {
    "contentAuthor": "Dr. [EP Physician]",
    "reviewedBy": null,
    "reviewDate": null,
    "status": "draft"
  }
}
```

The `reviewStatus` field tracks where each entry is in the content review pipeline. Nothing with `"status": "draft"` should appear in the production tool.

---

## Open-Source References & Prior Art

These existing projects can serve as inspiration and starting points:

| Project | What It Does | Link |
|---------|-------------|------|
| **ECGSIM** | Maps cardiac electrical activity to ECG waveforms | [ecgsim.org](https://www.ecgsim.org/) |
| **Interactive 3D Heart (Three.js)** | Basic interactive heart in the browser | [github.com/MattSchroyer/heart](https://github.com/MattSchroyer/heart) |
| **3D ECG Leads** | Visualizes 12-lead ECG in 3D space | [3decgleads.com](https://www.3decgleads.com/) |
| **XRAnatomy Heart** | Interactive labeled 3D heart | [xranatomy.com/heart](https://xranatomy.com/heart) |
| **BRAVEHEART** | Open-source ECG/VCG analysis | [github.com/BIVectors/BRAVEHEART](https://github.com/BIVectors/BRAVEHEART) |
| **ECG_Visualizer** | React + Canvas 12-lead ECG renderer | [github.com/Akitha-Chanupama/ECG_Visualizer](https://github.com/Akitha-Chanupama/ECG_Visualizer) |

---

## Development Plan

This timeline assumes AI-assisted development (Claude, vibe coding tools) for the technical work, with the EP physician's time being the primary constraint. The phases below are sequential but compressed — each builds directly on the previous one.

### Phase 1: 3D Heart + Click Interaction (Days 1–2)
**Goal:** Get a 3D heart on screen that you can spin around and click, with the 75/25 layout in place.

- [x] Scaffold React + TypeScript project (Vite)
- [x] Install React Three Fiber, drei, and Three.js
- [x] Source a glTF heart model (NIH 3D Print Exchange or Sketchfab — download and use as-is, no Blender)
- [x] Render the heart with orbit controls (rotate, zoom, pan) and lighting
- [x] Implement the 75/25 split layout (heart left, info panel right)
- [x] Get basic raycasting working — click the heart, display the (x, y, z) coordinate in the right panel

**Deliverable:** Spinning, clickable 3D heart in the browser with the target layout.

### Phase 2: Hotspots + Content Integration (Days 3–5)
**Goal:** Make specific regions clickable and wire up the clinical content.

- [x] Claude pre-populates the full JSON data store with literature-grounded content and citations for all PVC origins
- [x] Implement hotspot overlay system — place invisible clickable markers at PVC origin coordinates on the heart surface (no Blender needed — see [Guide-3D-Model-Preparation.md](./Guide-3D-Model-Preparation.md))
- [x] Build a dev-only coordinate picker tool so the EP physician can verify/adjust hotspot placement on the anatomical locations — **upgraded to full Mapping Mode (not dev-only)**
- [x] Add visual feedback on click (glowing marker, label, region name)
- [x] Build the ECG display panel (right panel, upper) — loads static 12-lead image for the selected region
- [x] Build the clinical info panel (right panel, lower) — shows description, ECG features, ablation approach, citations
- [x] Wire up state management: click hotspot → update ECG image + clinical info + references
- [x] Create a region sidebar/legend showing all available clickable locations
- [x] Start with 5–8 major regions using placeholder ECG images, expand from there — **14 regions with placeholder ECGs**

**Deliverable:** Working interactive tool — click a spot on the heart, see the corresponding ECG and clinical info.

### Phase 3: Content Completion + Review (Days 6–8)
**Goal:** Full clinical content for all regions, validated by the EP physician.

- [ ] EP physician sources static 12-lead ECG images from published literature for all PVC origins (with provenance documented in `ecgImageSource`)
- [ ] Replace placeholder ECG images with sourced clinical images
- [ ] EP physician validation pass — review all JSON entries against cited sources, confirm or correct, mark as reviewed
- [ ] Expand hotspots to cover all 20–30 PVC origin locations (14 currently defined, positions need mapping)
- [x] Basic polish — loading states, smooth transitions between regions, error handling
- [ ] Add a simple landing/intro page explaining how to use the tool

**Deliverable:** Fully functional MVP — all regions, all ECGs, all clinical content, all cited.

### Post-MVP Enhancements
These are deferred from the MVP and can be prioritized based on user feedback:

- **Reverse direction mode** — show an ECG first, have the learner identify the origin on the heart
- Quiz/self-assessment mode ("Which location produces this ECG?")
- Blender model segmentation for surface-area highlighting instead of hotspot markers (see [Guide-3D-Model-Preparation.md](./Guide-3D-Model-Preparation.md))
- Dynamic ECG waveform rendering (Canvas/SVG instead of static images)
- Side-by-side comparison of PVCs from different locations
- Cross-sectional views / cutaway of the heart
- Guided tour mode stepping through key locations
- Mobile-responsive layout
- User accounts and progress tracking
- Integration with external resources (UpToDate, ACC guidelines)

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Clinical inaccuracy** — incorrect ECG morphology or anatomic description could misinform learners treating real patients | **Critical** | AI drafts content grounded in published literature with citations attached; EP physician validates every entry before it goes live; `reviewStatus` field gates what appears in production |
| **AI hallucination in content** — AI may introduce plausible-sounding but incorrect medical claims when drafting clinical text | **Critical** | Every AI-drafted claim includes its citation so the EP physician can verify against the source; physician review is required before any content is shown to users |
| **ECG image sourcing & licensing** — need representative 12-lead ECGs for each origin from published literature | High | EP physician curates images; document provenance of every image in `ecgImageSource` field; verify licensing/fair use for educational purposes |
| **Heart model quality** — free models may lack anatomical detail | Medium | Hotspot overlay approach means any reasonable heart model works for MVP; model config system allows swapping models without losing mapping work |
| **3D performance on lower-end devices** | Medium | BVH acceleration implemented; consider Draco compression for production. Current model is 34MB/285K vertices — reasonable for desktop, may need optimization for mobile |
| **Scope creep** — temptation to add features before core is solid | Medium | Strict phase gating; MVP = 3D heart + ECG + text for all PVC origin locations |

---

## Getting Started — Immediate Next Steps

These three workstreams can run in parallel and converge when the EP physician reviews the integrated result.

### Workstream A: Technical Build (AI-assisted)
1. **Source a heart model** — Download a glTF heart model from Sketchfab or NIH 3D Print Exchange. Preview in an online glTF viewer (e.g., https://gltf-viewer.donmccurdy.com/) to confirm it looks good. No Blender needed.
2. **Scaffold the project** — `npm create vite@latest pvc-heart-tool -- --template react-ts`, install React Three Fiber + drei. Load the heart model and get it rendering with orbit controls.
3. **Build the full interactive tool** — Implement the 75/25 layout, hotspot system, ECG panel, clinical info panel, and state management. Use placeholder content initially.

### Workstream B: Clinical Content (AI-drafted, physician-reviewed)
1. **Claude generates the full JSON data store** — All PVC origin entries with descriptions, ECG features, ablation approaches, and citations from published literature.
2. **EP physician reviews and validates** — A focused pass through the drafted content, correcting anything that needs it and marking entries as reviewed.

### Workstream C: ECG Images (EP physician)
1. **Source static 12-lead ECG images** from published literature for each PVC origin. Document provenance (paper, figure number, licensing).
2. **Standardize format** — Consistent image dimensions and layout so they display cleanly in the right panel.

### Convergence
Workstreams A, B, and C come together when the validated clinical content and sourced ECG images are integrated into the working technical prototype. At that point, the EP physician does a final walkthrough of the complete tool to confirm everything displays correctly.

---

---

## Progress & Decisions Log

### 2026-03-20 — Model Selection, Architecture & Viewer

**3D Model Evolution:**
- Procedural geometry (spheres/cones/cylinders) was the initial approach — rejected as not anatomically realistic enough for EP education.
- Downloaded and evaluated multiple candidate models from Sketchfab. See `heart-models.md` for the full curated list including cross-sectional models.
- Current models in `public/models/`:
  - `heart.glb` (34MB, 5 meshes, ~285K vertices) — **currently active**
  - `heart-0.glb` (116MB, 41 meshes, ~1.6M vertices) — large detailed model (too heavy for web)
  - `heart-1.glb` (4.2MB) — medium model
  - `heart-2.glb` (751K) — small 3D EduTex model
- **Key finding:** Ideal model would be a **cross-sectional/cutaway** that exposes internal structures (papillary muscles, moderator band, His bundle area, septum). The University of Dundee model is excellent but not downloadable — may need to contact them directly.

**Model Config System (implemented):**
- Created `src/data/modelConfigs.ts` — modular system for storing per-model settings:
  - Which `.glb` file to load
  - Which meshes to hide (e.g. built-in labels/annotations)
  - Per-model hotspot position mappings (so swapping models doesn't lose position data)
  - Scale/position overrides
- Swap models by changing `activeModelId` in the config file.
- All 4 downloaded models are registered with their own config entries.

**Interactive Mapping Mode (implemented):**
- Built-in tool for mapping PVC origin hotspot positions to any heart model — no console/code needed.
- Workflow: Click "Edit Mappings" → click heart surface to place marker → select PVC origin from dropdown → repeat for all 14 origins.
- Green markers appear on the model showing mapped positions.
- Progress tracker shows mapped vs unmapped count.
- "Copy mappings as JSON" button exports positions for pasting into `modelConfigs.ts`.
- This means any new model can be hotspot-mapped in minutes without touching code.

**Viewer Features (implemented):**
- Navigation toolbar (left side): zoom in/out, reset view, auto-rotate toggle, brightness slider
- Camera can zoom to distance 0 (inside the model) for internal exploration
- Orbit center dynamically computed from model bounding box — always rotates around the heart's actual center
- Adjustable brightness (10%–300%) via vertical slider — all lights and environment map scale proportionally
- BVH (Bounding Volume Hierarchy) acceleration via `three-mesh-bvh` for fast raycasting on high-poly models
- Smooth camera damping on all interactions
- Auto-rotate off by default (toggle available)

**Layout (implemented):**
- Collapsible right panel (drag handle + chevron button, double-click to toggle)
- Right panel serves dual purpose:
  - Default: PVC origin list with "Edit Mappings" button
  - Selected origin: back button + ECG + clinical info
  - Mapping mode: interactive mapping interface
- Bottom pane removed — region list moved into right panel for maximum 3D viewport space
- Left panel (3D viewer) gets full height

**Performance:**
- BVH acceleration for raycasting (critical for 285K+ vertex models)
- Model auto-centers and auto-scales regardless of source coordinate space
- Hidden mesh support for stripping labels/annotations from models that include them

**Hotspot Status:**
- All 14 hotspot positions are currently unmapped for the new model.
- Mapping Mode is ready to use for remapping.
- Hotspots display in normal mode; hidden during mapping mode to avoid interference.

**Next Steps:**
- [ ] Use Mapping Mode to map all 14 PVC origin positions on current model
- [ ] Evaluate cross-sectional models (links in `heart-models.md` #6–10) — contact University of Dundee if needed
- [ ] Source real ECG images for each PVC origin (EP physician task)
- [ ] EP physician validation pass on all clinical content
- [ ] Consider Draco compression or model optimization for production deployment

---

*This plan is a living document. Update as the project evolves.*
