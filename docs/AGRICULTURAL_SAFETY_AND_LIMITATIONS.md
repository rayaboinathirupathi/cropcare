# CropCare AI — Agricultural Safety and Limitations Policy

## 1. Principles of Agricultural Grounding

CropCare AI is designed under strict agronomic safety guardrails:
1. **No Hallucinated Dosages**: The application never generates chemical doses or dilution volumes using unconstrained LLM text generation. All chemical formulations, approved crops, target pests, and label rates are pulled from verified records referencing the **Central Insecticides Board & Registration Committee (CIBRC)** and the **Indian Council of Agricultural Research (ICAR)**.
2. **Deterministic Dosage Arithmetic**: Calculations are executed by a unit-aware math engine with strict conversions between Acres, Hectares, Indian Guntas (0.025 Acre), and square meters.
3. **Integrated Pest Management (IPM) Priority**: Cultural, mechanical, and biological controls (e.g. Trichoderma viride, Pseudomonas fluorescens, pheromone traps, border barrier crops) are always prioritized above chemical interventions.
4. **Mandatory Safety Disclosures**: Pre-Harvest Interval (PHI) waiting periods and Personal Protective Equipment (PPE) requirements are displayed alongside any chemical recommendation.

---

## 2. Model Confidence and Uncertainty Calibration

AI-generated computer vision predictions are inherently probabilistic and subject to optical ambiguities:
- **High Confidence**: Displayed only when pathognomonic symptoms (such as spindle-shaped rice blast lesions or characteristic chilli curl with whitefly presence) are distinctly recognizable.
- **Moderate Confidence**: Displayed when symptoms overlap between multiple etiologies (e.g., foliar yellowing that could indicate either viral chlorosis, spider mite suction, or nitrogen deficiency). Alternative diagnoses are surfaced transparently.
- **Low Confidence**: Triggers an explicit warning directing the farmer to consult the nearest **Krishi Vigyan Kendra (KVK)** or state agricultural extension office before taking action.

---

## 3. Toxicity Label Classification (Insecticides Act, 1968)

Farmers must observe the color-coded toxicity triangle on product packaging:

| Category | Toxicity Level | Triangle Color | Precautions |
|---|---|---|---|
| **Category I** | Extremely Toxic | Bright Red (Upper) | Highly restricted. Full PPE respirator gear mandatory. Never use near residential areas. |
| **Category II** | Highly Toxic | Bright Yellow (Upper) | Poisonous. Eye goggles, chemical gloves, and boots required. |
| **Category III** | Moderately Toxic | Bright Blue (Upper) | Danger. Face mask and gloves required. |
| **Category IV** | Slightly Toxic | Bright Green (Upper) | Caution. Standard hand washing and protective clothing required. |

---

## 4. Emergency Contacts & Extension Helplines

- **Kisan Call Center (Ministry of Agriculture, Government of India)**:
  - Toll-Free: **1800-180-1551**
  - Operational: 6:00 AM to 10:00 PM (All 7 days) in 22 local Indian languages.
- **Acharya N.G. Ranga Agricultural University (ANGRAU) Helpline**:
  - Toll-Free: **1800-425-0430**
- **Professor Jayashankar Telangana State Agricultural University (PJTSAU) Helpline**:
  - Toll-Free: **1800-425-3536**
