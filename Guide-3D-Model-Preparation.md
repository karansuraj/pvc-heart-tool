# 3D Heart Model Preparation Guide

This guide covers how to get from "a 3D heart model file" to "clickable anatomical regions in the browser." There are three approaches, ordered from least effort to most effort. **Start with Approach A for the prototype, evaluate whether Approach B or C is needed for polish.**

---

## The Core Problem

When a user clicks on the 3D heart, the code needs to answer: "Which PVC origin site did they click?" The 3D rendering library (Three.js) can tell us *what object* was clicked and *where* on its surface — but it can only distinguish between separate mesh objects. A single-mesh heart model looks like one giant object to Three.js, so clicks anywhere on it return the same thing.

We need a way to map a click location to an anatomical region name.

---

## Approach A: Hotspot Overlays (No Blender Required)

**Effort:** Low — done entirely in code
**Best for:** Rapid prototype, proof of concept
**Tradeoff:** Highlighting is marker-based (glowing dots/rings) rather than surface-area-based

### How It Works

1. Load the heart model as-is (single mesh, no modifications)
2. Define a list of 3D coordinates corresponding to each PVC origin site
3. Place invisible (or semi-transparent) clickable marker objects at those coordinates — small spheres, discs, or ring shapes
4. When the user clicks, Three.js raycasting detects which marker was hit
5. The marker's ID maps to the PVC origin data

### What You'd Build

```
Heart Model (single mesh, visual only, not directly clickable for regions)
  └── Hotspot: RVOT Septal      (invisible sphere at x, y, z)
  └── Hotspot: RVOT Free Wall   (invisible sphere at x, y, z)
  └── Hotspot: LCC              (invisible sphere at x, y, z)
  └── Hotspot: RCC              (invisible sphere at x, y, z)
  └── ... etc
```

### Determining Hotspot Coordinates

This is the main task — you need to figure out the (x, y, z) position for each PVC origin on your specific heart model.

**Method 1: Built-in Mapping Mode (recommended — already implemented)**
The tool includes an interactive Mapping Mode accessible from the right panel:
1. Click "Edit Mappings" in the PVC Origin Locations panel
2. Click anywhere on the heart surface — a marker appears and the coordinates are captured
3. Select the PVC origin from the dropdown to assign that position
4. Green markers show all mapped positions; progress tracker shows mapped vs unmapped count
5. Click "Copy mappings as JSON" to export positions for pasting into `src/data/modelConfigs.ts`

This takes ~15 minutes per model and requires no code changes or external tools. Mappings are stored per-model in the config system, so swapping models preserves each model's position data.

**Method 2: Visual estimation in a 3D viewer**
Open the model in an online glTF viewer (e.g., https://gltf-viewer.donmccurdy.com/) or Blender, identify the approximate location of each origin, and note the coordinates. Less precise but workable.

### Visual Feedback Options

Since the heart itself isn't segmented, you can't highlight a surface region. Instead:

- **Glowing marker:** Show a pulsing, colored sphere or ring at the clicked location
- **Outline ring:** A flat circle projected onto the heart surface at the hotspot
- **Pin/label:** A pin-style marker that rises from the surface with a label
- **Transparent overlay:** A semi-transparent colored dome over the approximate area

For MVP, glowing markers are simple and effective. They also have the advantage of showing users exactly where the clickable areas are.

### Pros and Cons

| Pros | Cons |
|------|------|
| No 3D modeling skills required | Less visually precise — markers don't follow surface contours |
| Fast to implement (hours, not days) | Can't highlight the actual anatomical surface area |
| Easy to adjust — just change coordinates | Requires manual coordinate placement per model |
| Works with any heart model | Hotspots are approximate regions, not exact boundaries |

---

## Approach B: Find a Pre-Segmented Model (Minimal or No Blender)

**Effort:** Low if you find the right model, medium if you need light edits
**Best for:** A polished result without deep Blender expertise

### How It Works

Some 3D heart models are already split into named parts (atria, ventricles, valves, great vessels, etc.). When loaded in Three.js, each part is a separate mesh object with a name. Raycasting can identify which named mesh was clicked.

### Where to Look

**Sketchfab (most likely to have what we need):**
- Search for "heart anatomy" and filter by downloadable + free
- Look for models where the description or preview shows labeled/colored regions
- Check the model's structure by downloading and opening in Blender or a glTF viewer
- Key indicator: if the model preview shows different colors for different structures, it's probably multi-mesh

**Specific models to evaluate:**
- Sketchfab Cardiac Anatomy Collection (University of Dundee) — already segmented into anatomical structures
- Any model described as "exploded view" or "labeled anatomy" — these are inherently multi-part

**NIH 3D Print Exchange:**
- Models here tend to be single-mesh (optimized for 3D printing)
- Less likely to be pre-segmented but worth checking

### What to Check When Evaluating a Model

Open the model in Blender (free, https://www.blender.org/) or an online viewer and look at:

1. **Is it multi-mesh?** In Blender's outliner panel (top right), you'll see a hierarchy. Multiple named objects = multi-mesh. A single object = single mesh.
2. **What are the parts named?** Look for names like "left_ventricle," "aorta," "mitral_valve," etc. vs. generic names like "Mesh.001."
3. **Is the granularity sufficient?** We need to distinguish areas like RVOT septal vs. RVOT free wall. Most pre-segmented models will separate the RV from the LV, but may not subdivide the outflow tracts. If the major chambers and valves are separate, that gives us a good starting point.

### Light Blender Edits (if close but not perfect)

If you find a model that's partially segmented (e.g., RV is one piece but you need RVOT as a separate piece), you may need to do a small amount of mesh separation in Blender. This is much easier than full segmentation from scratch:

1. Open the model in Blender
2. Select the mesh that needs splitting (e.g., the right ventricle)
3. Enter Edit Mode (Tab key)
4. Select the faces that correspond to the sub-region (e.g., the outflow tract portion)
5. Separate selection into a new object (P → Selection)
6. Rename the new object (e.g., "rvot_septal")
7. Export as glTF

This is a 5–10 minute task per region for someone who's done it before, or 30–60 minutes per region for a first-timer following a tutorial. See the Blender Walkthrough section below.

### Pros and Cons

| Pros | Cons |
|------|------|
| Surface-accurate highlighting | Depends on finding a suitable model |
| Minimal or no Blender work if well-segmented | Free models may not have EP-level granularity |
| Named meshes make the code straightforward | May still need light edits to subdivide regions |

---

## Approach C: Full Blender Segmentation (Most Control)

**Effort:** High — requires Blender skills or hiring a 3D artist
**Best for:** Final polished product, if Approaches A or B aren't sufficient
**Recommendation:** Do NOT start here. Only pursue this if you've tried A and B and the result isn't good enough.

### What's Involved

Starting from a single-mesh heart model:

1. **Import the model** into Blender
2. **Plan the regions** — mark up a reference image of the heart with the exact boundaries of each PVC origin zone
3. **Select and separate** each region into its own named mesh object
4. **Clean up geometry** — fix any artifacts from the separation (holes, overlapping vertices)
5. **Assign materials** — give each region a default color/material for visual distinction
6. **Export** as glTF with all named meshes intact

### Estimated Time

| Task | First-timer | Experienced |
|------|-------------|-------------|
| Learning Blender basics | 2–4 hours | — |
| Planning region boundaries | 1–2 hours | 30 min |
| Separating ~25 regions | 4–8 hours | 2–3 hours |
| Cleanup and materials | 2–3 hours | 1 hour |
| Export and testing | 1 hour | 30 min |
| **Total** | **10–18 hours** | **4–5 hours** |

### Alternative: Hire a 3D Artist

If Approach C becomes necessary, consider hiring a freelance 3D artist (Fiverr, Upwork) who already knows Blender. Provide them with:
- The source heart model file
- A labeled reference diagram showing exactly which regions to separate and what to name them
- The export format (glTF/GLB)

Estimated cost: $100–$300 depending on complexity. Turnaround: 2–5 days.

---

## Blender Walkthrough: Separating a Region

For Approaches B (light edits) or C (full segmentation), here's how mesh separation works in Blender. This is the fundamental operation you'd repeat for each region.

### Prerequisites
- Install Blender (free): https://www.blender.org/download/
- Import your heart model: File → Import → glTF / OBJ / STL (depending on format)

### Steps

**1. Select the object**
- Click on the heart model in the 3D viewport
- It should highlight with an orange outline

**2. Enter Edit Mode**
- Press `Tab` (or select Edit Mode from the dropdown in the top-left)
- You'll see the wireframe mesh of the model

**3. Select the faces for the region you want to separate**
- Switch to Face Select mode (press `3` on the keyboard, or click the face icon in the header)
- Use these selection methods:
  - **Click** individual faces (hold Shift to add to selection)
  - **Box select**: Press `B`, then drag a rectangle
  - **Circle select**: Press `C`, then paint over faces (scroll wheel to resize brush)
  - **Lasso select**: Hold Ctrl + right-click and draw a freeform selection
- Rotate the view (middle mouse button) to select faces from all angles
- Selected faces turn orange/highlighted

**4. Separate the selection**
- With your faces selected, press `P` (or Mesh → Separate)
- Choose "Selection"
- The selected faces become a new object

**5. Name the new object**
- Press `Tab` to go back to Object Mode
- Click on the newly separated piece
- In the Outliner (top-right panel), double-click its name to rename it
- Use a clear, code-friendly name: `rvot_septal`, `lvot_lcc`, `mitral_annulus_anterior`, etc.

**6. Repeat for each region**
- Select the main heart mesh again
- Tab into Edit Mode
- Select the next region's faces
- Separate and rename

**7. Export**
- Select all objects (press `A`)
- File → Export → glTF 2.0 (.glb/.gltf)
- In export settings, ensure "Selected Objects" is checked if you only want to export heart parts
- The exported file will contain all named meshes

### Naming Convention for Mesh Objects

Use these names so the code can map meshes to PVC origin data:

```
rvot_septal
rvot_freewall
rvot_anterior
rvot_posterior
lvot_lcc
lvot_rcc
lvot_lcc_rcc_commissure
aortic_lcc
aortic_rcc
aortic_ncc
mitral_anterior
mitral_posterior
mitral_lateral
tricuspid_septal
tricuspid_anterior
tricuspid_posterior
papillary_anterolateral
papillary_posteromedial
lv_summit_gcv
lv_summit_aiv
his_bundle
moderator_band
crux
```

These names directly correspond to the `meshId` field in the JSON data store.

### Tips

- **Save frequently** — Blender can be unforgiving if you lose work
- **Use reference images** — In Blender, you can add a background image (Add → Image → Reference) showing a labeled anatomical diagram to guide your selections
- **Don't worry about perfect boundaries** — For educational purposes, approximate region boundaries are fine. The exact border between "RVOT septal" and "RVOT anterior" isn't a hard anatomical line anyway
- **Check for holes** — After separating, go to Edit Mode on each piece, select all (A), then Mesh → Clean Up → Fill Holes if needed

---

## Recommended Path

```
Start here
    │
    ▼
┌─────────────────────────────────────────────┐
│  STEP 1: Download 2–3 candidate models      │
│  (Sketchfab, NIH, etc.)                     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Open in Blender or online viewer   │
│  Check: Is it already multi-mesh?           │
└──────┬──────────────────┬───────────────────┘
       │                  │
   YES ▼              NO  ▼
┌──────────────┐  ┌──────────────────────────┐
│ Approach B   │  │ Approach A (hotspots)     │
│ Evaluate     │  │ Build prototype with      │
│ granularity  │  │ coordinate-based markers  │
│ Light edits  │  │                           │
│ if needed    │  │ Revisit B or C later if   │
└──────────────┘  │ more polish is needed     │
                  └──────────────────────────┘
```

**For MVP: Start with Approach A (hotspot overlays).** It gets a working, clickable prototype in front of the EP physician fastest, with zero Blender dependency. The physician can then interact with it, give feedback on region placement and behavior, and you'll have a much clearer picture of whether the visual fidelity of hotspot markers is "good enough" or whether surface-level highlighting (Approach B/C) is worth pursuing.

---

## Current Implementation Status

**Approach A is fully implemented** with the following enhancements beyond the original plan:

- **Interactive Mapping Mode** — built into the viewer, no console or code needed. Click on heart → assign PVC origin → export JSON. See `src/components/MappingPanel.tsx`.
- **Model Config System** — `src/data/modelConfigs.ts` stores per-model settings (hidden meshes, hotspot positions, scale). Swap models by changing one line. All position mappings are preserved per-model.
- **BVH Acceleration** — `three-mesh-bvh` patches Three.js raycasting for fast click detection on high-poly models (285K+ vertices).
- **Multiple model support** — 4 models registered, easily extensible. Drop a `.glb` into `public/models/`, add a config entry, use Mapping Mode to place hotspots.
- **See `heart-models.md`** for curated links to candidate models including cross-sectional/interior models ideal for EP education.
