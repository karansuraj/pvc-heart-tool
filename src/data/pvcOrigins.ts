/**
 * PVC Origin Clinical Data Store
 *
 * IMPORTANT: This data is AI-drafted from published EP literature and requires
 * EP physician validation before being considered clinically accurate.
 * Every entry includes citations to published sources.
 *
 * Review status: "draft" = awaiting physician review, "reviewed" = validated
 */

export interface Reference {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  chapter?: string;
  relevance: string;
}

export interface PVCOrigin {
  id: string;
  name: string;
  fullName: string;
  category: string;
  // 3D coordinates for hotspot placement on the heart model
  // These are normalized positions relative to the heart mesh
  hotspotPosition: [number, number, number];
  hotspotColor: string;
  ecgImage: string | null; // null = placeholder until EP physician sources image
  ecgImageSource?: {
    description: string;
    origin: string;
    license: string;
  };
  ecgFeatures: {
    axis: string;
    morphology: string;
    transition: string;
    otherFeatures: string[];
  };
  description: string;
  ablationApproach: string;
  differentialLocations: string[];
  prevalence: string;
  references: Reference[];
  reviewStatus: {
    status: "draft" | "reviewed";
    reviewedBy: string | null;
    reviewDate: string | null;
  };
}

export const pvcOrigins: PVCOrigin[] = [
  // ===== RVOT =====
  {
    id: "rvot-septal",
    name: "RVOT Septal",
    fullName: "Right Ventricular Outflow Tract — Septal",
    category: "RVOT",
    hotspotPosition: [0.2, 1.35, 0.55],
    hotspotColor: "#ff4444",
    ecgImage: null,
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "LBBB pattern (QS or rS in V1)",
      transition: "Precordial transition at V3–V4",
      otherFeatures: [
        "R wave in V1 typically < 50% of QRS amplitude",
        "No Q waves in lead I",
        "QRS duration often < 140 ms",
        "R/S amplitude index in V1+V2 / V5+V6 < 0.3 favors RVOT over LVOT",
      ],
    },
    description:
      "The RVOT septum is the most common origin of idiopathic ventricular arrhythmias, accounting for approximately 70% of outflow tract PVCs. These arrhythmias arise from the posterior-superior aspect of the right ventricular outflow tract near the pulmonic valve, along the interventricular septum. They are typically benign but may cause symptoms or tachycardia-induced cardiomyopathy if frequent (>10-15% PVC burden).",
    ablationApproach:
      "Approached via the right femoral vein through the IVC to the right ventricle and advanced to the RVOT. Mapping is performed using activation mapping and pace mapping to identify the earliest activation site. Radiofrequency ablation at this site has a high success rate (>90%). The proximity to the His bundle inferiorly requires careful mapping to avoid heart block.",
    differentialLocations: ["rvot-freewall", "lvot-lcc", "lvot-rcc"],
    prevalence: "Most common (~70% of idiopathic outflow tract PVCs)",
    references: [
      {
        id: "lerman-2015",
        authors: "Lerman BB",
        title: "Mechanism, diagnosis, and treatment of outflow tract tachycardia",
        journal: "Nat Rev Cardiol",
        year: 2015,
        doi: "10.1038/nrcardio.2015.121",
        relevance: "Comprehensive review of RVOT tachycardia mechanisms and ECG features",
      },
      {
        id: "dixit-2003",
        authors: "Dixit S, Gerstenfeld EP, Callans DJ, Marchlinski FE",
        title: "Electrocardiographic patterns of superior right ventricular outflow tract tachycardias: distinguishing septal and free-wall sites of origin",
        journal: "J Cardiovasc Electrophysiol",
        year: 2003,
        doi: "10.1046/j.1540-8167.2003.02404.x",
        relevance: "Key paper differentiating RVOT septal vs free wall ECG patterns",
      },
      {
        id: "josephson-ch11",
        authors: "Josephson ME",
        title: "Clinical Cardiac Electrophysiology: Techniques and Interpretations",
        journal: "Wolters Kluwer",
        year: 2020,
        chapter: "Ch. 11–12: Recurrent Ventricular Tachycardia",
        relevance: "Anatomic description and ablation approach",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },
  {
    id: "rvot-freewall",
    name: "RVOT Free Wall",
    fullName: "Right Ventricular Outflow Tract — Free Wall",
    category: "RVOT",
    hotspotPosition: [0.55, 1.2, 0.7],
    hotspotColor: "#ff6644",
    ecgImage: null,
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "LBBB pattern (QS or rS in V1)",
      transition: "Precordial transition at V4 or later (later than septal)",
      otherFeatures: [
        "Broader QRS duration compared to septal origin (often > 140 ms)",
        "Notching in the downstroke of QRS in inferior leads",
        "Later precordial transition compared to RVOT septal",
        "May have small R wave in aVL",
      ],
    },
    description:
      "RVOT free wall PVCs originate from the anterior or lateral wall of the right ventricular outflow tract, away from the septum. Compared to septal RVOT PVCs, these tend to have a broader QRS morphology and later precordial transition due to the longer activation time required to reach the interventricular septum. They account for approximately 20-30% of RVOT PVCs.",
    ablationApproach:
      "Approached via right femoral vein similar to RVOT septal targets. Catheter is deflected laterally and anteriorly in the RVOT. Success rates are somewhat lower than septal RVOT ablation (~80-85%) due to greater wall thickness variability and potential for epicardial origin. Intracardiac echocardiography can help confirm catheter position relative to the free wall.",
    differentialLocations: ["rvot-septal", "tricuspid-anterior"],
    prevalence: "~20-30% of RVOT PVCs",
    references: [
      {
        id: "dixit-2003",
        authors: "Dixit S, Gerstenfeld EP, Callans DJ, Marchlinski FE",
        title: "Electrocardiographic patterns of superior right ventricular outflow tract tachycardias: distinguishing septal and free-wall sites of origin",
        journal: "J Cardiovasc Electrophysiol",
        year: 2003,
        doi: "10.1046/j.1540-8167.2003.02404.x",
        relevance: "Key paper differentiating RVOT septal vs free wall ECG patterns",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },

  // ===== LVOT / AORTIC CUSPS =====
  {
    id: "lvot-lcc",
    name: "Left Coronary Cusp",
    fullName: "Left Ventricular Outflow Tract — Left Coronary Cusp",
    category: "Aortic Cusps",
    hotspotPosition: [-0.15, 1.55, 0.25],
    hotspotColor: "#4488ff",
    ecgImage: null,
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "RBBB or multiphasic pattern in V1 (R, Rs, or Rs with M-shape)",
      transition: "Early precordial transition (V1–V2)",
      otherFeatures: [
        "Taller R wave in V1/V2 than RVOT origins",
        "R/S ratio > 1 in V1 or V2",
        "V1 R-wave duration index > 50% and amplitude index > 30% favor cusp origin",
        "QRS may appear narrower than RVOT PVCs",
      ],
    },
    description:
      "PVCs from the left coronary cusp (LCC) of the aortic valve arise from myocardial extensions into the aortic root. The LCC is positioned leftward and posterior relative to the RCC. LCC PVCs are distinguished from RVOT PVCs by their earlier precordial transition and taller R waves in V1-V2, reflecting the more leftward and posterior origin. The left main coronary artery ostium is typically 10-15mm above the cusp nadir, which is an important safety consideration during ablation.",
    ablationApproach:
      "Approached retrograde via the femoral artery through the aorta to the aortic root. A coronary angiogram or CT is recommended before ablation to define the relationship of the coronary ostia to the ablation target. Ablation within the cusp is generally safe if the catheter tip is >10mm from the coronary ostium. ICE guidance is strongly recommended. Success rates exceed 85%.",
    differentialLocations: ["lvot-rcc", "aortic-ncc", "rvot-septal"],
    prevalence: "~15-20% of outflow tract PVCs overall",
    references: [
      {
        id: "yamada-2008",
        authors: "Yamada T, McElderry HT, Doppalapudi H, et al.",
        title: "Idiopathic ventricular arrhythmias originating from the aortic sinus cusp: electrocardiographic and electrophysiologic characteristics and outcome of catheter ablation",
        journal: "J Am Coll Cardiol",
        year: 2008,
        doi: "10.1016/j.jacc.2008.08.040",
        relevance: "Definitive paper on cusp VT/PVC ECG features and ablation outcomes",
      },
      {
        id: "ouyang-2002",
        authors: "Ouyang F, Fotuhi P, Ho SY, et al.",
        title: "Repetitive monomorphic ventricular tachycardia originating from the aortic sinus cusp",
        journal: "J Am Coll Cardiol",
        year: 2002,
        doi: "10.1016/S0735-1097(02)02236-0",
        relevance: "Early description of cusp VT characteristics",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },
  {
    id: "lvot-rcc",
    name: "Right Coronary Cusp",
    fullName: "Left Ventricular Outflow Tract — Right Coronary Cusp",
    category: "Aortic Cusps",
    hotspotPosition: [0.15, 1.55, 0.4],
    hotspotColor: "#44aaff",
    ecgImage: null,
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "LBBB or transitional pattern in V1 (W-shaped or rs pattern)",
      transition: "Early precordial transition (V1–V3)",
      otherFeatures: [
        "May resemble RVOT septal PVC but with earlier transition",
        "R wave in V1 is often present but smaller than LCC",
        "Can have a qR pattern in V1 (q from septal activation)",
        "RCC is the cusp closest to the RVOT — ECG overlap is common",
      ],
    },
    description:
      "The right coronary cusp (RCC) is the most anterior of the aortic cusps and sits closest to the RVOT septum. PVCs from the RCC can closely mimic RVOT septal PVCs on the surface ECG, making this a challenging differential diagnosis. The key distinguishing feature is an earlier precordial transition (V1-V3) and failure of RVOT ablation. The RCC gives rise to the right coronary artery, and proximity to the His bundle must be considered during ablation.",
    ablationApproach:
      "Approached retrograde via the femoral artery. The RCC is immediately adjacent to the RVOT septum, separated only by the aortic-RV muscular continuity. The His bundle lies inferior to the RCC, and pacing from the ablation catheter should confirm absence of His capture. Coronary angiography is essential to locate the RCA ostium. Ablation success is comparable to LCC (~85-90%).",
    differentialLocations: ["rvot-septal", "lvot-lcc", "his-bundle"],
    prevalence: "Less common than LCC as PVC origin",
    references: [
      {
        id: "yamada-2008",
        authors: "Yamada T, McElderry HT, Doppalapudi H, et al.",
        title: "Idiopathic ventricular arrhythmias originating from the aortic sinus cusp",
        journal: "J Am Coll Cardiol",
        year: 2008,
        doi: "10.1016/j.jacc.2008.08.040",
        relevance: "ECG differentiation of RCC vs LCC vs NCC origins",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },
  {
    id: "aortic-ncc",
    name: "Non-Coronary Cusp",
    fullName: "Aortic Valve — Non-Coronary Cusp",
    category: "Aortic Cusps",
    hotspotPosition: [-0.1, 1.55, -0.05],
    hotspotColor: "#4466ff",
    ecgImage: null,
    ecgFeatures: {
      axis: "Inferior axis, may have rightward axis (positive in II/III, negative in aVL)",
      morphology: "Variable — can be LBBB or RBBB pattern in V1",
      transition: "Early transition (V1–V3)",
      otherFeatures: [
        "Often has a W-shaped QRS in V1",
        "Tends to have more leftward axis than LCC or RCC origins",
        "QRS may be relatively narrow",
        "Least common cusp origin for PVCs",
      ],
    },
    description:
      "The non-coronary cusp (NCC) is the most posterior aortic cusp and is in direct continuity with the interatrial septum and the mitral-aortic intervalvular fibrosa. PVCs from the NCC are less common than LCC or RCC origins. The NCC's posterior position means PVCs may have a more rightward frontal plane axis compared to other cusp origins. The NCC lacks a coronary ostium but lies adjacent to the AV node and His bundle.",
    ablationApproach:
      "Approached retrograde via the femoral artery. The NCC is the most posterior cusp and is adjacent to the interatrial septum. Proximity to the AV node/His bundle is the primary safety concern. AV block can occur if ablation is performed too inferiorly. Careful electrophysiologic mapping with attention to His bundle electrograms is essential. ICE guidance recommended.",
    differentialLocations: ["lvot-lcc", "lvot-rcc", "his-bundle"],
    prevalence: "Least common cusp origin",
    references: [
      {
        id: "yamada-2008",
        authors: "Yamada T, McElderry HT, Doppalapudi H, et al.",
        title: "Idiopathic ventricular arrhythmias originating from the aortic sinus cusp",
        journal: "J Am Coll Cardiol",
        year: 2008,
        doi: "10.1016/j.jacc.2008.08.040",
        relevance: "NCC PVC characteristics and ablation",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },

  // ===== MITRAL ANNULUS =====
  {
    id: "mitral-anterior",
    name: "Mitral Annulus (Anterior)",
    fullName: "Mitral Valve Annulus — Anterior",
    category: "Mitral Annulus",
    hotspotPosition: [-0.5, 0.85, 0.35],
    hotspotColor: "#44cc44",
    ecgImage: null,
    ecgFeatures: {
      axis: "Superior axis (negative in II, III, aVF) or leftward",
      morphology: "RBBB pattern (R or Rs in V1)",
      transition: "Early precordial transition (V1–V2)",
      otherFeatures: [
        "Prominent R wave in V1",
        "Q waves in inferior leads",
        "Relatively narrow QRS",
        "Can mimic fascicular VT",
      ],
    },
    description:
      "PVCs originating from the anterior mitral annulus arise from the mitral-aortic continuity region. This area is in close anatomic proximity to the aortic cusps (particularly the LCC) and the left ventricular summit. The anterior mitral annulus is fibrous rather than muscular, so arrhythmogenic substrate may represent myocardial extensions or remnant tissue. These PVCs typically show an RBBB pattern with a superior axis.",
    ablationApproach:
      "Can be approached retrograde via the femoral artery or via transseptal access from the femoral vein. Mapping is performed along the anterior mitral annulus. The proximity to the circumflex coronary artery and aortic cusps must be considered. ICE guidance and coronary angiography may be needed. Success rates are moderate (~70-80%).",
    differentialLocations: ["lvot-lcc", "lv-summit-gcv", "papillary-anterolateral"],
    prevalence: "Relatively uncommon",
    references: [
      {
        id: "doppalapudi-2008",
        authors: "Doppalapudi H, Yamada T, McElderry HT, et al.",
        title: "Ventricular tachycardia originating from the posterior papillary muscle in the left ventricle",
        journal: "Circ Arrhythm Electrophysiol",
        year: 2008,
        doi: "10.1161/CIRCEP.108.772749",
        relevance: "Description of mitral annular and papillary PVC features",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },
  {
    id: "mitral-posterior",
    name: "Mitral Annulus (Posterior)",
    fullName: "Mitral Valve Annulus — Posterior/Inferior",
    category: "Mitral Annulus",
    hotspotPosition: [-0.45, 0.75, -0.3],
    hotspotColor: "#44dd44",
    ecgImage: null,
    ecgFeatures: {
      axis: "Superior axis (negative in II, III, aVF)",
      morphology: "RBBB pattern in V1",
      transition: "Early precordial transition (V1–V3)",
      otherFeatures: [
        "Deep S waves in inferior leads",
        "Tall R in aVL and lead I",
        "RBBB with left superior axis is hallmark of posterior MA",
        "QRS may be relatively narrow",
      ],
    },
    description:
      "PVCs from the posterior (inferior) mitral annulus arise from the muscular portion of the mitral annulus near the posterior wall of the left ventricle. This region is close to the coronary sinus and great cardiac vein. The posterior mitral annulus is one of the more common mitral annular PVC locations. The superior axis and RBBB pattern reflect the basal-inferior origin with activation directed superiorly and rightward.",
    ablationApproach:
      "Can be approached via transseptal access (femoral vein) or retrograde aortic (femoral artery). Mapping within the coronary sinus may show early activation, indicating an epicardial or peri-annular origin. Ablation can be performed endocardially from the LV or from within the coronary sinus. Proximity to the circumflex artery and coronary sinus requires careful imaging.",
    differentialLocations: ["mitral-anterior", "papillary-posteromedial", "crux"],
    prevalence: "Moderately common among mitral annular PVCs",
    references: [
      {
        id: "kumagai-2005",
        authors: "Kumagai K, Fukuda K, Wakayama Y, et al.",
        title: "Electrocardiographic characteristics of the variants of idiopathic left ventricular outflow tract ventricular tachyarrhythmias",
        journal: "J Cardiovasc Electrophysiol",
        year: 2005,
        relevance: "ECG features distinguishing mitral annular origins",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },

  // ===== TRICUSPID ANNULUS =====
  {
    id: "tricuspid-septal",
    name: "Tricuspid Annulus (Septal)",
    fullName: "Tricuspid Valve Annulus — Septal",
    category: "Tricuspid Annulus",
    hotspotPosition: [0.45, 0.75, 0.25],
    hotspotColor: "#ffaa44",
    ecgImage: null,
    ecgFeatures: {
      axis: "Variable — can be inferior, superior, or leftward depending on exact position",
      morphology: "LBBB pattern (QS in V1)",
      transition: "Late precordial transition (V4–V6)",
      otherFeatures: [
        "LBBB morphology with inferior or superior axis",
        "QRS typically > 140 ms",
        "May have notching in limb leads",
        "Proximity to His bundle can produce narrow QRS variants",
      ],
    },
    description:
      "PVCs from the septal tricuspid annulus originate near the interventricular septum at the base of the right ventricle. This region is in close proximity to the AV node and His bundle. The LBBB pattern reflects the right ventricular origin, and the axis varies depending on the exact location along the septal annulus (superior vs. inferior portions). These PVCs must be differentiated from para-Hisian and His bundle PVCs.",
    ablationApproach:
      "Approached via the femoral vein. The catheter is positioned along the septal tricuspid annulus. Extreme caution is required due to proximity to the His bundle and AV node. Careful mapping of the His bundle electrogram is mandatory before ablation. Cryoablation may be preferred over radiofrequency in para-Hisian locations to reduce the risk of AV block.",
    differentialLocations: ["his-bundle", "tricuspid-anterior"],
    prevalence: "Uncommon",
    references: [
      {
        id: "tada-2005",
        authors: "Tada H, Ito S, Naito S, et al.",
        title: "Idiopathic ventricular arrhythmia arising from the mitral valve annulus",
        journal: "J Am Coll Cardiol",
        year: 2005,
        relevance: "Comparative features of annular PVC origins",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },

  // ===== PAPILLARY MUSCLES =====
  {
    id: "papillary-anterolateral",
    name: "Anterolateral Papillary Muscle",
    fullName: "Left Ventricular Anterolateral Papillary Muscle",
    category: "Papillary Muscles",
    hotspotPosition: [-0.45, 0.15, 0.5],
    hotspotColor: "#cc44cc",
    ecgImage: null,
    ecgFeatures: {
      axis: "Right superior axis (negative in I and aVF)",
      morphology: "RBBB pattern in V1",
      transition: "Variable, often mid-precordial (V3–V4)",
      otherFeatures: [
        "RBBB with right superior axis is characteristic",
        "QRS often > 150 ms due to myocardial origin",
        "Beat-to-beat QRS variability is a hallmark of papillary PVCs",
        "May have multiple morphologies from the same papillary muscle",
      ],
    },
    description:
      "PVCs from the anterolateral papillary muscle of the left ventricle arise from Purkinje fibers or working myocardium within the papillary muscle. A hallmark feature is QRS morphology variability — subtle beat-to-beat changes in QRS shape due to the complex fiber architecture of the papillary muscle and variable exit sites. The anterolateral papillary muscle is supplied by the LAD or diagonal branches, and ischemia-related PVCs should be considered in the differential.",
    ablationApproach:
      "Approached retrograde via the femoral artery or via transseptal access. Papillary muscle ablation is technically challenging due to catheter instability on the papillary muscle surface and the complex 3D geometry. ICE guidance is strongly recommended to visualize catheter-tissue contact. Multiple applications may be needed due to depth of focus within the muscle. Success rates are lower than other LV sites (~60-75%).",
    differentialLocations: ["papillary-posteromedial", "mitral-anterior"],
    prevalence: "Accounts for ~5% of idiopathic LV PVCs",
    references: [
      {
        id: "yamada-2010",
        authors: "Yamada T, Doppalapudi H, McElderry HT, et al.",
        title: "Idiopathic ventricular arrhythmias originating from the papillary muscles in the left ventricle",
        journal: "J Cardiovasc Electrophysiol",
        year: 2010,
        doi: "10.1111/j.1540-8167.2009.01622.x",
        relevance: "Definitive paper on papillary muscle PVC characteristics",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },
  {
    id: "papillary-posteromedial",
    name: "Posteromedial Papillary Muscle",
    fullName: "Left Ventricular Posteromedial Papillary Muscle",
    category: "Papillary Muscles",
    hotspotPosition: [-0.2, 0.15, -0.35],
    hotspotColor: "#dd44dd",
    ecgImage: null,
    ecgFeatures: {
      axis: "Right inferior axis or right axis (positive in II/III, negative in I/aVL)",
      morphology: "RBBB pattern in V1",
      transition: "Variable, often mid-precordial (V3–V4)",
      otherFeatures: [
        "RBBB with rightward/inferior axis",
        "Beat-to-beat QRS variability (same as anterolateral)",
        "May have multiple morphologies",
        "QRS often > 150 ms",
      ],
    },
    description:
      "PVCs from the posteromedial papillary muscle arise from the posterior-inferior papillary muscle of the left ventricle. Like anterolateral papillary PVCs, QRS variability is characteristic. The posteromedial papillary muscle is more commonly involved than the anterolateral because it has a single blood supply (posterior descending artery), making it more susceptible to ischemic substrate. The axis tends to be more rightward/inferior compared to anterolateral papillary PVCs.",
    ablationApproach:
      "Similar approach to anterolateral papillary ablation — retrograde aortic or transseptal. The posteromedial papillary muscle may be more accessible due to its larger size and broader base. ICE guidance is essential. Catheter stability remains the primary challenge. Irrigated tip catheters are preferred for deeper lesion delivery.",
    differentialLocations: ["papillary-anterolateral", "mitral-posterior"],
    prevalence: "Slightly more common than anterolateral papillary PVCs",
    references: [
      {
        id: "yamada-2010",
        authors: "Yamada T, Doppalapudi H, McElderry HT, et al.",
        title: "Idiopathic ventricular arrhythmias originating from the papillary muscles in the left ventricle",
        journal: "J Cardiovasc Electrophysiol",
        year: 2010,
        doi: "10.1111/j.1540-8167.2009.01622.x",
        relevance: "Papillary muscle PVC ECG features and ablation outcomes",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },

  // ===== LV SUMMIT / EPICARDIAL =====
  {
    id: "lv-summit-gcv",
    name: "LV Summit (GCV/AIV)",
    fullName: "Left Ventricular Summit — Great Cardiac Vein / Anterior Interventricular Vein",
    category: "LV Summit",
    hotspotPosition: [-0.4, 1.05, 0.55],
    hotspotColor: "#ffdd44",
    ecgImage: null,
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "RBBB or LBBB pattern depending on exact location",
      transition: "Early precordial transition (V1–V2)",
      otherFeatures: [
        "Precordial maximum deflection index (MDI) > 0.55 suggests epicardial origin",
        "Pseudo-delta wave (slurred QRS onset) > 34 ms",
        "Intrinsicoid deflection time in V2 > 85 ms",
        "Q waves in lead I may be present",
        "Can resemble LCC or anterior mitral annular PVCs",
      ],
    },
    description:
      "The LV summit is the most superior portion of the left ventricular epicardium, bounded by the left anterior descending artery anteriorly and the circumflex artery posteriorly, with the great cardiac vein (GCV) running through it. PVCs from this region are considered among the most challenging to ablate due to the epicardial origin, proximity to major coronary vessels, and thick overlying epicardial fat. The GCV and anterior interventricular vein (AIV) serve as venous access routes for mapping and ablation.",
    ablationApproach:
      "Multi-approach strategy often required. Initial mapping from the endocardium (aortic cusps, sub-aortic region) may identify an accessible endocardial target. If endocardial ablation fails, mapping within the GCV/AIV via the coronary sinus is performed. Direct epicardial ablation via subxiphoid pericardial access is a last resort. Coronary angiography is mandatory before any energy delivery near the GCV/AIV. If the ablation target is <5mm from a coronary artery, ablation may not be safely performed. Success rates are lower (~50-70%).",
    differentialLocations: ["lvot-lcc", "mitral-anterior"],
    prevalence: "Uncommon but clinically significant",
    references: [
      {
        id: "yamada-2010b",
        authors: "Yamada T, McElderry HT, Doppalapudi H, et al.",
        title: "Idiopathic ventricular arrhythmias originating from the left ventricular summit",
        journal: "Circ Arrhythm Electrophysiol",
        year: 2010,
        doi: "10.1161/CIRCEP.110.945576",
        relevance: "Definitive paper characterizing LV summit PVCs and ablation approaches",
      },
      {
        id: "enriquez-2017",
        authors: "Enriquez A, Malavassi F, Sauer WH, et al.",
        title: "How to map and ablate left ventricular summit arrhythmias",
        journal: "Heart Rhythm",
        year: 2017,
        doi: "10.1016/j.hrthm.2016.09.018",
        relevance: "Practical guide to LV summit ablation techniques",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },

  // ===== HIS BUNDLE / PARA-HISIAN =====
  {
    id: "his-bundle",
    name: "His Bundle / Para-Hisian",
    fullName: "His Bundle / Para-Hisian Region",
    category: "His Bundle",
    hotspotPosition: [0.2, 0.95, 0.3],
    hotspotColor: "#ff44ff",
    ecgImage: null,
    ecgFeatures: {
      axis: "Left axis or normal axis",
      morphology: "Narrow QRS with RBBB pattern — can mimic supraventricular tachycardia",
      transition: "Early transition (V1–V3)",
      otherFeatures: [
        "QRS may be very narrow (< 120 ms) mimicking SVT",
        "RBBB pattern with left axis deviation",
        "May be preceded by a His potential on intracardiac recordings",
        "Resembles fascicular VT in some cases",
      ],
    },
    description:
      "Para-Hisian PVCs originate from the region adjacent to or within the His bundle or proximal bundle branches. Their narrow QRS morphology can make them difficult to distinguish from supraventricular arrhythmias on the surface ECG. The narrow QRS results from engagement of the specialized conduction system, producing rapid ventricular activation similar to normal conduction. These PVCs are particularly challenging because ablation risks complete AV block.",
    ablationApproach:
      "Approached via the femoral vein with careful mapping of the His bundle region. Cryoablation is strongly preferred over radiofrequency energy due to the reversible nature of cryo lesions — if AV block occurs during cryo application, the lesion can thaw and conduction typically recovers. Radiofrequency ablation carries a significant risk of permanent AV block (5-10%). Close monitoring of AH and HV intervals during energy delivery is essential.",
    differentialLocations: ["rvot-septal", "lvot-rcc", "tricuspid-septal"],
    prevalence: "Rare (<5% of idiopathic VAs)",
    references: [
      {
        id: "yamauchi-2014",
        authors: "Yamauchi Y, Aonuma K, Takahashi A, et al.",
        title: "Electrocardiographic characteristics of repetitive monomorphic right ventricular tachycardia originating near the His-bundle",
        journal: "J Cardiovasc Electrophysiol",
        year: 2014,
        relevance: "ECG features of para-Hisian ventricular arrhythmias",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },

  // ===== MODERATOR BAND =====
  {
    id: "moderator-band",
    name: "Moderator Band",
    fullName: "Right Ventricular Moderator Band",
    category: "Moderator Band",
    hotspotPosition: [0.5, 0.1, 0.2],
    hotspotColor: "#44dddd",
    ecgImage: null,
    ecgFeatures: {
      axis: "Left superior axis",
      morphology: "LBBB pattern in V1",
      transition: "Variable, often mid-precordial",
      otherFeatures: [
        "LBBB with left superior axis",
        "May have QRS variability similar to papillary PVCs",
        "Can trigger polymorphic VT or ventricular fibrillation",
        "QRS often > 140 ms",
      ],
    },
    description:
      "The moderator band is a muscular ridge in the right ventricle that carries part of the right bundle branch (the septal fascicle) from the interventricular septum to the anterior papillary muscle. PVCs from this structure can trigger polymorphic VT or VF, particularly in patients with Purkinje-related arrhythmias. The moderator band is a dynamic structure that moves with cardiac contraction, making catheter stability during ablation challenging.",
    ablationApproach:
      "Approached via the femoral vein. ICE guidance is essential to visualize the moderator band and confirm catheter contact. The moderator band's mobility makes maintaining stable catheter position difficult. Ablation success may require multiple applications. In patients with VF triggered by moderator band PVCs, successful ablation can be life-saving.",
    differentialLocations: ["tricuspid-septal", "papillary-anterolateral"],
    prevalence: "Rare — but important trigger for VF in some patients",
    references: [
      {
        id: "sadek-2015",
        authors: "Sadek MM, Benhayon D, Sureddi R, et al.",
        title: "Idiopathic ventricular arrhythmias originating from the moderator band",
        journal: "J Cardiovasc Electrophysiol",
        year: 2015,
        doi: "10.1111/jce.12680",
        relevance: "Characterization of moderator band PVCs and ablation",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },

  // ===== CRUX =====
  {
    id: "crux",
    name: "Crux of the Heart",
    fullName: "Crux Cordis",
    category: "Crux",
    hotspotPosition: [-0.05, 0.4, -0.55],
    hotspotColor: "#dd8844",
    ecgImage: null,
    ecgFeatures: {
      axis: "Superior axis (negative in II, III, aVF)",
      morphology: "RBBB or LBBB pattern depending on LV vs RV side of crux",
      transition: "Variable",
      otherFeatures: [
        "Superior axis is the hallmark feature",
        "QRS morphology depends on which side of the crux the PVC exits",
        "May have epicardial features (pseudo-delta wave, prolonged MDI)",
        "Can be difficult to distinguish from posterior mitral annular PVCs",
      ],
    },
    description:
      "The crux cordis is the posterior intersection of the AV groove and the posterior interventricular groove, where the posterior descending artery originates (in a right-dominant circulation). PVCs from this region are relatively rare and can have either RV or LV exit morphology depending on the exact origin. The epicardial location means that endocardial ablation may be insufficient, and epicardial access via the coronary sinus or direct pericardial approach may be needed.",
    ablationApproach:
      "May require mapping from multiple sites: endocardial (both LV and RV), within the coronary sinus (middle cardiac vein), and occasionally direct epicardial access. The posterior descending artery is in close proximity, requiring coronary angiography before ablation. Success rates vary based on the ability to access the arrhythmia focus.",
    differentialLocations: ["mitral-posterior", "papillary-posteromedial"],
    prevalence: "Rare",
    references: [
      {
        id: "yokokawa-2012",
        authors: "Yokokawa M, Good E, Desjardins B, et al.",
        title: "Predictors of successful catheter ablation of ventricular arrhythmias arising from the coronary venous system",
        journal: "Heart Rhythm",
        year: 2012,
        relevance: "Ablation of crux and coronary venous PVCs",
      },
    ],
    reviewStatus: { status: "draft", reviewedBy: null, reviewDate: null },
  },
];

// Helper: Get all unique categories for filtering
export const getCategories = (): string[] => {
  return [...new Set(pvcOrigins.map((o) => o.category))];
};

// Helper: Get origins by category
export const getOriginsByCategory = (category: string): PVCOrigin[] => {
  return pvcOrigins.filter((o) => o.category === category);
};

// Helper: Get a single origin by ID
export const getOriginById = (id: string): PVCOrigin | undefined => {
  return pvcOrigins.find((o) => o.id === id);
};
