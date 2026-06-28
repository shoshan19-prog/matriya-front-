# Product Reconstruction — PROTECH A1 (silicate paint, Class A1 fire)

> Extraction #8, chosen by **Expected Knowledge Gain** for a measured Workability fail→fix arc + production decisions. Bonus discovered: a real **Class A1 fire certificate** — making PROTECH a *measured* 2nd Fire source. Read-only; raw recipes kept local.
>
> *Prepared 2026-06-28. Same rules: never invent; VERIFIED vs ASSUMPTION; source per statement; contradictions preserved; absence reported.*

---

## 0. Identity & scope reconciliation

**Product/family:** **PROTECH A1** (Fresco "Tech-A1") — alkali-silicate, organically modified ecological interior paint; **silicate-coatings family** (same as GRANITAL/BETONIZE — not a new family). `[VERIFIED — SDS id 18IXP1kl…]`

**Scope note:** the Class-A1 fire certificate that the fire-retardant-plaster scout flagged as "E0" belongs **here** (PROTECH A1 paint), and is counted as PROTECH's measured Fire evidence — **not** the plaster's. This avoids double-counting.

**Sources:** R&D reports `PRO-TECH A1-2.docx` (id `1pMRYcwm28NNzLSKzblq9uarh8jJifVH_`); oven-stability `…070323-001` (id `1toIMSLGCpQ7…`); antifoam weekly plans (ids `1bUKD6Whd…`, `1aQgDpNm…`); SII fire certs (ISO 1182 `1k9MFkUx…`, ISO 1716 `1Iu-ljX8…`, Classification A1 `1nxhWG3N…`).

---

## 1. Knowledge Episodes

### EP-PT-A — Binder/raw-material compatibility down-selection
- **Experiment:** compatibility matrix (KSIL34 vs Betolin), ~11-emulsion screen.
- **Results (MEASURED viscosity 24h/2wk/4wk/>1mo + SG):** e.g. SA-1 16727→29386 cps SG 1.42; PH ~11.7–12.0.
- **Decision:** KSIL34 (cost/availability); binder **SA-1 styrene-acrylic** (EM-58 rejected — rubbed off pre-cure); OPTIGEL WX + cellulose thickeners. **Outcome:** success.
- **Domains:** `Workability = MEASURED`, `Color = qualitative` · materials: SA-1 (+), EM-58 (−), OPTIGEL WX (+), KSIL34 (+).

### EP-PT-B — Pigment compatibility via stabilizer
- **Experiment:** Betolin **A11** to 2%; A11+Calgon; Calgon alone.
- **Results (qualitative 1–5):** A11→2% best compatibility; Calgon partial.
- **Decision:** A11 to 2%. **Outcome:** success. **Domains:** `Color = qualitative`, `Workability = qualitative` · materials: A11 (+), Calgon (neutral).

### EP-PT-C — Oven stability failure (50 °C)
- **Results (MEASURED):** viscosity rose (60-rpm 2852→8471 cps over 4wk); PH ~12.1–12.5; creamy/plaster texture at 4wk.
- **Decision:** not stable at 50 °C → **store cool/covered, ≤40 °C.** **Outcome:** failure (managed by storage rule).
- **Domains:** `Workability = MEASURED`, `Water/stability = MEASURED`, `Color = qualitative (black shifts lighter)` · **Stages:** `LAB_TRIAL, MEASURE_VISCOSITY, DECISION`.

### EP-PT-D — Open-time / application fix
- **Field:** painters report it dries too fast. **Decision:** add **1% propylene glycol** → ~+½ hr open time.
- **Domains:** `Workability = qualitative (field)` · materials: propylene glycol (+), Texanol (− VOC).

### EP-PT-E — Foam/separation → antifoam fix (the measured arc)
- **Experiment:** 3 formulas aged 1.5 months, remix-evaluated:
  - **161** thickeners→0.22%: no separation but **too thick, still foam**;
  - **162** antifoam→0.45%: **no separation, no foam ✓**;
  - **163** both: no separation but too thick + bubbles.
- **Decision:** **"formula 162 best — set final formula"** (raise antifoam). **Why:** antifoam removes entrapped air without over-thickening. **Production decision: yes.**
- **Domains:** `Workability = MEASURED (antifoam % + thickener % + foam/separation outcome)`, `Water/stability = MEASURED` · **Stages:** `LAB_TRIAL, MEASURE_VISCOSITY, DECISION, PRODUCTION` · materials: antifoam 0.45% (+), thickeners (− on workability).

### EP-PT-F — Class A1 fire certification + 400 kg pilot
- **Results (MEASURED):** ISO 1182 ΔT **5.1 °C**, flaming **0.0 s**, mass loss **16.4%**; ISO 1716 QPCS **0.0 MJ/kg** → **Class A1** (cert `1nxhWG3N…`). *(An earlier FRESCO TECH-A1 sample failed — test stopped 5th min; a first SII attempt failed on cardboard-mold residue.)*
- **Decision:** A1 achieved → productized; 400 kg pilot scale-up + TDS issued. **Production decision: yes.**
- **Domains:** `Fire Resistance = MEASURED (A1 cert)` · **Stages:** `MEASURE_FIRE, DECISION, PRODUCTION`.

---

## 2. Counts, verdicts, contradictions

| Metric | Value |
|--------|-------|
| Episodes | **6** (A–F) |
| Production decisions | **2** (EP-E antifoam final-formula; EP-F A1 cert + 400 kg scale-up) |
| Family | silicate coatings *(same as GRANITAL/BETONIZE)* |
| Workability/Flow | **MEASURED** (Brookfield cps, antifoam/thickener %) |
| Fire Resistance | **MEASURED** (Class A1: ΔT 5.1, mass loss 16.4%) — a 2nd *measured* Fire source |
| Water/stability | **MEASURED** (oven coagulation/separation) |
| Color | qualitative only |

> Production-decision count is kept strict: storage spec (C) and open-time fix (D) are operational adjustments, **not** counted as production decisions (consistent with how TLV's storage guidance was treated). Only the antifoam final-formula and the A1 certification/scale-up count.

**Workability verdict:** genuinely measured — Brookfield cps at 6/12/30/60 spindle speeds, intervals 0/1wk/4wk/>1mo, with PH and SG; the antifoam fix is quantified by antifoam % and thickener % with measured pass/fail.

**Contradictions preserved (VERIFIED):**
- **"162" numbering collision:** a standalone **F.SILICATO-162** oven sheet exists, yet the 161/162/163 antifoam decision is filed under "Project A1" — PROTECH A1 and F.SILICATO share one batch-number stream. `[ASSUMPTION flagged: the antifoam fix applies to the shared silicate base]`
- **SG drift across TDS:** 1.4 vs 1.3 gr/cm³.
- **Use scope:** one TDS says "exterior & interior", the SDS/newer TDS restrict to interior.

**Absences:** no measured viscosity for tinted variants under oven aging; no abrasion/whiteness numbers; no rheology/yield-stress curves; no explicit rewritten production master recipe with the 162 change applied.

> PROTECH A1 contributes **measured Workability and measured Fire** (the A1 cert) — turning Fire into a multi-product domain with a second measured source — plus a clean field→lab→production decision arc. High expected-gain, realized.
