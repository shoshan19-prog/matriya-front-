# Product Reconstruction — GRANITAL (silicate facade paint)

> Extraction #5, chosen by **domain gap**: GRANITAL was selected not by name but because it is the only product carrying real **Color/Shade** data — the one domain that was **EMPTY** in the knowledge map. It seeds that domain with genuinely **measured** colorimetry. Read-only; nothing in Drive modified. Color *results* (ΔE/L*) are reported as test data; proprietary base compositions kept local.
>
> *Prepared 2026-06-28. Same rules: never invent; VERIFIED vs ASSUMPTION; source per statement; contradictions preserved; absence reported.*

---

## 0. Identity

**Product/family:** **GRANITAL** — Fresco's silicate (mineral) facade paint, the internal counterpart to KEIM Granital. **Fourth family** (silicate paint) — distinct from plaster, cementitious, and intumescent coating. `[VERIFIED]`

**Why it was chosen:** the corpus scout found it holds the **only true colorimetry in the Drive** (CIELAB ΔE / L* instrument data). The Color/Shade domain was empty; GRANITAL fills it with measured data. `[gap-driven selection]`

**Sources (read directly):** `Spectro Calculation.xlsx` (id `1yvbgt1KcUzTXcnBJfo5l1KyU0ohGHUPE`); `Tinting formulation.xlsx` (id `1qf_VK5lDhq15NaPO0868BAhbSLSMlyBK`); oven-stability docs `…-GRANITAL.docx` (id `1JLgN3nT2uaOYwFsgl0DUkfn2Sy4jOICC`) and `…-03222.docx` (id `1cJCtX2MbFvDblHERRoIT0mvm-1Ql0vtf`); master notebook `צבעים סיליקטים.xlsx` (id `1iCpLLeMjwBikOPsXGsG4ZremNu6pTJiV`). KEIM vendor PDFs were read as reference only (not Fresco decision cycles).

---

## 1. Knowledge Episodes

### EP-GR-01 — Tinting-formula development (F-167…F-182)
- **Question:** which pigment loadings on the white base hit target shades within acceptable ΔE?
- **Experiment:** ≥15 formula iterations (F-167…F-182), each recomputing a strength factor F≈0.64.
- **Results (MEASURED color):** explicit CIELAB deltas for the 170 pair — `170-1: ΔL −1.20, Δa 1.39, Δb 0.23, ΔC 0.61, ΔH −1.27`; `170-2: ΔL −0.56, Δa 0.66, Δb −0.36, ΔH −0.73` → **170-2 the closer match.**
- **Decision:** iterate toward minimum ΔE; 170-2 preferred. **Outcome:** retrial.
- **Domains:** `Color/Shade = MEASURED (ΔL/Δa/Δb/ΔC/ΔH)` · **Stages:** `LAB_TRIAL, MEASURE_COLOR, DECISION` · materials: OC/OG/RO (positive).

### EP-GR-02 — Lightness benchmarking (L1 vs Lf)
- **Results (MEASURED):** `Granital L1 = 58.89, Lf = 62.59 (ΔL ≈ +1.11)` — a measured ~1.1 L* lightening, logged as a reference value.
- **Domains:** `Color/Shade = MEASURED (L*)` · **Stages:** `MEASURE_COLOR` · **Outcome:** open.

### EP-GR-03 — Production color-matching log (vs competitor fan decks)
- **Question:** can Granital reproduce specific deck shades within tolerance (ΔE < 1)?
- **Experiment:** ~115 matched shades (2024) vs **Weber, Fresco, Nirlat, KEIM, Tambour** decks, with per-pigment dosages.
- **Results (MEASURED ΔE):** Granital examples — `461 (Weber) dE 0.82`, `5-14-2 dE 0.10`, `2-9-2 dE 0.42`, `KEIM 9457 dE 0.94`, `9249 dE 1.52`, `4-10-4 dE 1.78` (worst). Span **dE 0.10–1.78**, most ≤ 1.
- **Decision:** low-ΔE formulas **accepted** as tinting recipes; high-ΔE retried. **Production decision: yes** (per-shade recipes approved for delivery).
- **Domains:** `Color/Shade = MEASURED (large ΔE dataset)` · **Stages:** `MEASURE_COLOR, DECISION, PRODUCTION` · materials: OC dominant.

### EP-GR-04 — Oven thermal-stability trial (recipe 36221, untinted)
- **Experiment:** 50 °C oven; viscosity at spindle speeds 6/12/30/60 at t0 / 1wk / 4wk; PH.
- **Results (MEASURED viscosity, natural):** ~2× viscosity rise by 4 weeks (e.g. spindle-6 26120 → 87312); PH ~12.
- **Decision:** store indoors/covered; **repeat on a TINTED batch** (untinted made shade hard to read; paint came out "slightly whiter"). **Outcome:** retrial.
- **Domains:** `Workability/Flow = MEASURED (viscosity/PH)`, `Color = qualitative ("whiter")` · **Stages:** `LAB_TRIAL, MEASURE_VISCOSITY, DECISION`.
- **CONTRADICTION:** PH non-monotonic across timepoints (12.04 → 11.94 → 12.01).

### EP-GR-05 — Oven stability re-trial (recipe 03222)
- **Results (MEASURED):** t1 viscosity captured for all four shades; **1wk/4wk columns blank (incomplete).**
- **Outcome:** open. **Domains:** `Workability = MEASURED` · **Stages:** `LAB_TRIAL, MEASURE_VISCOSITY`.

### EP-GR-06 — Defoamer (TEGO) additive trials
- Two dated trials "GRANITAL 11/12.04.2022 TEGO" (defoamer). **Domains:** `Workability = qualitative` · **Stages:** `LAB_TRIAL, SUPPLIER_CHANGE` · materials: TEGO.

*(EP-7, a test-scheduling entry, carries no measured result and is logged as context only.)*

---

## 2. Color-data verdict (the reason this extraction was chosen)

The colorimetry is **genuinely MEASURED instrument data, not qualitative:**
1. **Spectro Calculation.xlsx** — true CIELAB `ΔL/Δa/Δb/ΔC/ΔH` vectors, absolute `L*` (58.89 / 62.59), ~15 reverse-engineered tinting formulas + pigment density constants (OC 1.866, RO 2.136, BO 1.804, CB 1.921, OG 2.356).
2. **Tinting formulation.xlsx** — ~115 measured **ΔE** color-match records vs five real fan decks, with per-pigment dosages; pass/retrial implied by ΔE magnitude.

**This is high-value seed data for the empty Color/Shade domain** — absolute lightness, full ΔLab vectors, a large ΔE corpus, and the pigment palette (OC, RO, BO, OG, CB, RG, MA, OO). *Caveat:* component ΔLab vectors exist for only one formula pair (170); the larger file gives scalar ΔE without the ΔL/Δa/Δb breakdown.

---

## 3. Counts, contradictions, absences

| Metric | Value |
|--------|-------|
| Episodes | **7** (5 measured, 2 contextual/additive) |
| Production decisions | **1** (EP-03 per-shade tinting recipes approved) |
| Family | **silicate paint** *(fourth family)* |
| Color/Shade | **MEASURED** — ΔE/L*, the only real colorimetry in the corpus |
| Workability/Flow | **MEASURED** — viscosity/PH oven series |
| Compression / Water / Adhesion / weathering | **ABSENT** for GRANITAL |

**Contradictions (VERIFIED):** PH non-monotonic (EP-04); two distinct "Granital" recipe numbers (**36221** vs **03222**) under one product name — cannot confirm which is the released SKU.

**Absences:** no mechanical strength, no water-uptake, no field reports, no explicit SKU sign-off document; recipe 03222's 4-week viscosity series incomplete.

> GRANITAL fills the knowledge map's emptiest domain with **measured** color science — and, as a bonus, adds a second *measured* Workability source. Chosen by gap, it strengthens exactly the holes the registry flagged.
