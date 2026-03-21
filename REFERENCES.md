# References

Collated bibliography for the PVC Heart Localization Tool. Every reference cited in the clinical data (`src/data/pvcOrigins.ts`), ECG profiles (`src/data/ecgProfiles.ts`), or anatomical mapping guides (`heart-models.md`) is listed here.

> **Maintenance note:** When adding or updating references anywhere in this project, update this file as well. See the [Reference Maintenance](#reference-maintenance) section at the bottom for the synchronization protocol.

---

## Peer-Reviewed Literature

References are grouped by topic. Each entry shows the citation key used in `pvcOrigins.ts`, the full citation, DOI (when available), and which PVC origins cite it.

### Outflow Tract Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 1 | `lerman-2015` | Lerman BB. Mechanism, diagnosis, and treatment of outflow tract tachycardia. *Nat Rev Cardiol*. 2015. | [10.1038/nrcardio.2015.121](https://doi.org/10.1038/nrcardio.2015.121) | rvot-septal, rvot-posterior |
| 2 | `dixit-2003` | Dixit S, Gerstenfeld EP, Callans DJ, Marchlinski FE. Electrocardiographic patterns of superior right ventricular outflow tract tachycardias: distinguishing septal and free-wall sites of origin. *J Cardiovasc Electrophysiol*. 2003. | [10.1046/j.1540-8167.2003.02404.x](https://doi.org/10.1046/j.1540-8167.2003.02404.x) | rvot-septal, rvot-freewall, rvot-anterior |
| 3 | `jadonath-1995` | Jadonath RL, Schwartzman DS, Preminger MW, et al. Utility of the 12-lead electrocardiogram in localizing the origin of right ventricular outflow tract tachycardia. *Am Heart J*. 1995. | [10.1016/0002-8703(95)90258-9](https://doi.org/10.1016/0002-8703(95)90258-9) | rvot-anterior |

### Aortic Cusp Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 4 | `yamada-2008` | Yamada T, McElderry HT, Doppalapudi H, et al. Idiopathic ventricular arrhythmias originating from the aortic sinus cusp: electrocardiographic and electrophysiologic characteristics and outcome of catheter ablation. *J Am Coll Cardiol*. 2008. | [10.1016/j.jacc.2008.08.040](https://doi.org/10.1016/j.jacc.2008.08.040) | lvot-lcc, lvot-rcc, lvot-lcc-rcc, rvot-posterior |
| 5 | `ouyang-2002` | Ouyang F, Fotuhi P, Ho SY, et al. Repetitive monomorphic ventricular tachycardia originating from the aortic sinus cusp. *J Am Coll Cardiol*. 2002. | [10.1016/S0735-1097(02)02236-0](https://doi.org/10.1016/S0735-1097(02)02236-0) | lvot-lcc, lvot-lcc-rcc |

### Mitral Annular Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 6 | `tada-2005` | Tada H, Ito S, Naito S, et al. Idiopathic ventricular arrhythmia arising from the mitral valve annulus: a distinct subgroup of idiopathic ventricular arrhythmias. *J Am Coll Cardiol*. 2005. | [10.1016/j.jacc.2005.01.066](https://doi.org/10.1016/j.jacc.2005.01.066) | mitral-lateral, tricuspid-septal |
| 7 | `kumagai-2005` | Kumagai K, Fukuda K, Wakayama Y, et al. Electrocardiographic characteristics of the variants of idiopathic left ventricular outflow tract ventricular tachyarrhythmias. *J Cardiovasc Electrophysiol*. 2005. | — | mitral-posterior |
| 8 | `kumagai-2008` | Kumagai K, Fukuda K, Wakayama Y, et al. Electrocardiographic characteristics of the variants of idiopathic left ventricular outflow tract ventricular tachyarrhythmias. *J Cardiovasc Electrophysiol*. 2008. | [10.1111/j.1540-8167.2008.01085.x](https://doi.org/10.1111/j.1540-8167.2008.01085.x) | mitral-lateral |
| 9 | `doppalapudi-2008` | Doppalapudi H, Yamada T, McElderry HT, et al. Ventricular tachycardia originating from the posterior papillary muscle in the left ventricle. *Circ Arrhythm Electrophysiol*. 2008. | [10.1161/CIRCEP.108.772749](https://doi.org/10.1161/CIRCEP.108.772749) | mitral-anterior |

### Tricuspid Annular Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 10 | `tada-2007` | Tada H, Tadokoro K, Ito S, et al. Idiopathic ventricular arrhythmias originating from the tricuspid annulus: prevalence, electrocardiographic characteristics, and results of radiofrequency catheter ablation. *Heart Rhythm*. 2007. | [10.1016/j.hrthm.2006.09.025](https://doi.org/10.1016/j.hrthm.2006.09.025) | tricuspid-anterior, tricuspid-posterior |

### Papillary Muscle Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 11 | `yamada-2010` | Yamada T, Doppalapudi H, McElderry HT, et al. Idiopathic ventricular arrhythmias originating from the papillary muscles in the left ventricle. *J Cardiovasc Electrophysiol*. 2010. | [10.1111/j.1540-8167.2009.01622.x](https://doi.org/10.1111/j.1540-8167.2009.01622.x) | papillary-anterolateral, papillary-posteromedial |
| 12 | `yamada-2010c` | Yamada T, McElderry HT, Doppalapudi H, et al. Idiopathic ventricular arrhythmias originating from the papillary muscles in the left ventricle. *J Cardiovasc Electrophysiol*. 2010. | [10.1111/j.1540-8167.2009.01624.x](https://doi.org/10.1111/j.1540-8167.2009.01624.x) | papillary-rv-septal |
| 13 | `enriquez-2017b` | Enriquez A, Supple GE, Marchlinski FE, Garcia FC. How to map and ablate papillary muscle ventricular arrhythmias. *Heart Rhythm*. 2017. | [10.1016/j.hrthm.2017.06.036](https://doi.org/10.1016/j.hrthm.2017.06.036) | papillary-rv-posterior |
| 14 | `latchamsetty-2015` | Latchamsetty R, Yokokawa M, Morady F, et al. Multicenter outcomes for catheter ablation of idiopathic premature ventricular complexes. *JACC Clin Electrophysiol*. 2015. | [10.1016/j.jacep.2015.04.005](https://doi.org/10.1016/j.jacep.2015.04.005) | papillary-rv-anterior |

### LV Summit / Epicardial Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 15 | `yamada-2010b` | Yamada T, McElderry HT, Doppalapudi H, et al. Idiopathic ventricular arrhythmias originating from the left ventricular summit: anatomic concepts relevant to ablation. *Circ Arrhythm Electrophysiol*. 2010. | [10.1161/CIRCEP.110.945576](https://doi.org/10.1161/CIRCEP.110.945576) | lv-summit-gcv, lv-summit-aiv |
| 16 | `enriquez-2017` | Enriquez A, Malavassi F, Sauer WH, et al. How to map and ablate left ventricular summit arrhythmias. *Heart Rhythm*. 2017. | [10.1016/j.hrthm.2016.09.018](https://doi.org/10.1016/j.hrthm.2016.09.018) | lv-summit-gcv, lv-summit-aiv |

### His Bundle / Para-Hisian Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 17 | `yamauchi-2014` | Yamauchi Y, Aonuma K, Takahashi A, et al. Electrocardiographic characteristics of repetitive monomorphic right ventricular tachycardia originating near the His-bundle. *J Cardiovasc Electrophysiol*. 2014. | — | his-bundle |

### Moderator Band Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 18 | `sadek-2015` | Sadek MM, Benhayon D, Sureddi R, et al. Idiopathic ventricular arrhythmias originating from the moderator band: electrocardiographic characteristics and treatment by catheter ablation. *J Cardiovasc Electrophysiol*. 2015. | [10.1111/jce.12680](https://doi.org/10.1111/jce.12680) | moderator-band, papillary-rv-anterior |

### Crux / Coronary Venous Arrhythmias

| # | Key | Citation | DOI | Used By |
|---|-----|----------|-----|---------|
| 19 | `yokokawa-2012` | Yokokawa M, Good E, Desjardins B, et al. Predictors of successful catheter ablation of ventricular arrhythmias arising from the coronary venous system. *Heart Rhythm*. 2012. | — | crux |

### Textbooks

| # | Key | Citation | Used By |
|---|-----|----------|---------|
| 20 | `josephson-ch11` | Josephson ME. *Clinical Cardiac Electrophysiology: Techniques and Interpretations*. Ch. 11–12: Recurrent Ventricular Tachycardia. Wolters Kluwer; 2020. | rvot-septal |

---

## ECG Profile Sources

The schematic 12-lead ECG profiles in `src/data/ecgProfiles.ts` are derived from the following subset of the references above:

| Source | ECG Profiles Derived |
|--------|---------------------|
| Dixit et al. 2003 | rvot-septal, rvot-freewall, rvot-anterior, rvot-posterior |
| Yamada et al. 2008 | lvot-lcc, lvot-rcc, lvot-lcc-rcc |
| Tada et al. 2005 | mitral-anterior, mitral-posterior, mitral-lateral |
| Tada et al. 2007 | tricuspid-septal, tricuspid-anterior, tricuspid-posterior |
| Yamada et al. 2010 | papillary-anterolateral, papillary-posteromedial, papillary-rv-anterior, papillary-rv-posterior, papillary-rv-septal |
| Enriquez et al. 2017 | lv-summit-gcv, lv-summit-aiv |
| Sadek et al. 2015 | moderator-band |

---

## Anatomical Mapping & Educational References

These resources from `heart-models.md` informed hotspot placement and anatomical accuracy. They are not directly cited in the clinical data but are essential references for the project.

### Overview Papers (with anatomical diagrams)

1. [Diagnosis and Treatment of Idiopathic PVCs: A Stepwise Approach Based on Site of Origin](https://pmc.ncbi.nlm.nih.gov/articles/PMC8534438/) — PMC8534438
2. [Differentiating Right- and Left-Sided Outflow Tract Ventricular Arrhythmias](https://www.ahajournals.org/doi/full/10.1161/CIRCEP.119.007392) — AHA Circulation: Arrhythmia and Electrophysiology
3. [Localization of Precise Origin of PVC and VT](https://www.circulation.or.kr/workshop/2017spring/file/program_file2/22_39.pdf) — Korean Heart Rhythm Society workshop slides
4. [Color Atlas of Electrophysiology — Aortic Cusp Chapter](https://doctorlib.org/medical/color-atlas-synopsis-electrophysiology/19.html)
5. [How To Identify & Treat Epicardial Origin Of Outflow Tract Tachycardias](https://pmc.ncbi.nlm.nih.gov/articles/PMC4956358/) — PMC4956358
6. [ECG Criteria for Differentiating Left from Right Outflow Tract VAs](https://pmc.ncbi.nlm.nih.gov/articles/PMC8076969/) — PMC8076969
7. [Localization of PVC Foci Based on Multichannel ECG Processing](https://pmc.ncbi.nlm.nih.gov/articles/PMC3790125/) — PMC3790125

### 12-Lead ECG Morphology References (for waveform rendering)

8. [ECG Characteristics of Idiopathic VAs Based on Anatomy](https://pmc.ncbi.nlm.nih.gov/articles/PMC7679832/) — PMC7679832. Comprehensive: covers outflow tracts, fascicles, papillary muscles, mitral/tricuspid annuli, and epicardial origins.
9. [ECG Criteria for Localization of VPCs from the Inferior RVOT](https://pmc.ncbi.nlm.nih.gov/articles/PMC9589426/) — PMC9589426
10. [Identifying OT PVCs Based on Configuration: ML Approach](https://pmc.ncbi.nlm.nih.gov/articles/PMC10487978/) — PMC10487978
11. [Idiopathic OT VA Ablation: Pearls and Pitfalls](https://pmc.ncbi.nlm.nih.gov/articles/PMC6528030/) — PMC6528030
12. [ECG Characteristics, Identification, and Management of Frequent PVCs](https://pmc.ncbi.nlm.nih.gov/articles/PMC10572222/) — PMC10572222
13. [The RV1-V3 Transition Ratio](https://www.heartrhythmopen.com/article/S2666-5018(21)00126-4/pdf) — Heart Rhythm Open (CC BY license)
14. [Modern Mapping and Ablation of Idiopathic OT VAs](https://www.imrpress.com/journal/RCM/23/3/10.31083/j.rcm2303103/pdf) — Reviews in Cardiovascular Medicine (open access)

### Interactive 3D Anatomy

15. [3D Cardiac Anatomy for Electrophysiologists](https://cardiacanatomyatlas.com/3d/) — Interactive 3D cardiac anatomy atlas specifically designed for EP.

---

## 3D Heart Model Sources

| Model File | Source |
|------------|--------|
| `university-of-dundee-interior-heart-high-detail.glb` | [University of Dundee, CAHID — Interior heart — high detail (Sketchfab)](https://sketchfab.com/3d-models/interior-heart-high-detail-7a592ce3b0514258ad4c4ef9e18b8f8e) |
| `human-heart-internal-structure-3d-model.glb` | [Haiqa Arif — Human Heart Internal Structure 3D Model (Sketchfab)](https://sketchfab.com/3d-models/human-heart-internal-structure-3d-model-21d346f72230432e8ed5fe448b03cca5) |
| `heart-1_compressed.glb` | Source pending documentation |
| `3d-edutex-human-heart.glb` | [3D EduTex — Human Heart (Sketchfab)](https://sketchfab.com/3d-models/human-heart-f5fa1e719f3d4f28a7c31728a86a9b42) |

---

## Reference Maintenance

This bibliography must stay synchronized with the source data files. Follow this protocol whenever references change:

### When to update this file

- **Adding a new PVC origin** — add all of its `references[]` entries here
- **Adding a reference to an existing origin** — add the entry here and update the "Used By" column
- **Modifying a citation** (correcting authors, title, DOI) — update both `pvcOrigins.ts` and this file
- **Adding ECG profile sources** — update the [ECG Profile Sources](#ecg-profile-sources) table
- **Adding anatomical/mapping references** — update the [Anatomical Mapping & Educational References](#anatomical-mapping--educational-references) section
- **Citing any peer-reviewed paper or textbook anywhere in the project** — add it here

### Canonical data flow

```
pvcOrigins.ts (references[] arrays)  ─┐
ecgProfiles.ts (header comments)      ├──▶  REFERENCES.md (this file)
heart-models.md (mapping references)  ─┘
```

The source of truth for per-origin citations is `pvcOrigins.ts`. This file is the **collated, human-readable index** of all references across the project.

### Quick checklist for agents

1. After editing any `references[]` in `pvcOrigins.ts`, run a mental diff against this file
2. New reference? Add a row to the appropriate topic table with key, full citation, DOI, and "Used By"
3. New topic area? Add a new subsection under [Peer-Reviewed Literature](#peer-reviewed-literature)
4. Verify DOI links resolve correctly when adding new entries
5. Keep entries sorted by year within each topic table
