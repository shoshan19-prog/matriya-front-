# Product Reconstruction — BETONIZE 2030 (sol-silicate mineral coating)

> Extraction #7, chosen by **Expected Knowledge Gain** as the 2nd Color source (to break Color's single-product penalty) + workability fixes + production decisions. Read-only; raw recipes/viscosity tables kept local. Same silicate-coatings family as GRANITAL → no new-family bonus.
>
> *Prepared 2026-06-28. Same rules: never invent; VERIFIED vs ASSUMPTION; source per statement; contradictions preserved; absence reported.*

---

## 0. Identity

**Product/family:** **BETONIZE 2030** — Fresco sol-silicate / mineral concrete coating; **2030-A** (pigmented) and **2030-B** (clear diluent). Sibling to GRANITAL / F.SILICATO / Protec-A1 → **silicate-coatings family** (already counted; not a new family). `[VERIFIED]`
**Lab lead:** Rachel; field complaints via Eric.
**Sources:** oven-stability logs (ids `1Tqr5W8…`, `1XFBbpO…`, `1sQFWCqZ…`, additive variants `1tTsYi…` etc.), 2025 weekly plans (`1UINmV8X…`, `1lsjFo98…`, `1aQgDpNm…`), TDS/SDS (reference only).

---

## 1. Knowledge Episodes

### EP-BZ-01 — 50 °C stability of 2030-A + shade shift under heat
- **Results (MEASURED viscosity):** natural before-oven 14433/8140/3754/1926 CPS → wk1 ~3×, wk4 unmeasurable (creamy/plaster texture); PH ~12. **Color (qualitative):** oven samples **lighter, BLACK/BO worst**, RO/OC milder; no compatibility failure.
- **Decision:** not stable at 50 °C → **store indoors/covered**. **Outcome:** accepted (storage).
- **Domains:** `Workability = MEASURED`, `Color = qualitative` · **Stages:** `LAB_TRIAL, MEASURE_VISCOSITY, MEASURE_COLOR(qual), DECISION` · materials: BO (− shade shift).

### EP-BZ-02 — Additive screening vs heat-thickening (ropac / open-titan / A11)
- **Experiment:** pilot 001 split into +ropac / +open-titan+A11 / +ropac+A11 / +A11 / plain.
- **Results:** **ABSENT** — only baseline viscosity recorded; wk1/wk4 columns empty. **Outcome:** open.
- **Domains:** `Workability = MEASURED (baseline)` · materials: ropac, open-titan, A11 (undetermined).

### EP-BZ-03 — 2030-B coagulation at 50 °C → retrial (batch 002 → 003)
- **Results (MEASURED):** natural 821/660/596/510 PH 11.64 → **wk1 coagulation, white lumps; wk2 disintegrated**; latex skin.
- **Decision:** batch 002 defective → **repeat with fresh paint (003)**. **003 results never filled in.** **Outcome:** retrial (follow-up open).
- **Domains:** `Workability = MEASURED (coagulation)` · **Stages:** `LAB_TRIAL, MEASURE_VISCOSITY, DECISION` · materials: clear silicate base (− coagulates).

### EP-BZ-04 — Raise titanium to 10% for coverage; titanium-grade search
- **Hypothesis:** more TiO₂ (at chalk's expense) → coverage; a "bluer" higher-chloride grade improves tone.
- **Experiment:** 10% titanium; grades **698 vs TIONA 826**; whiteness vs benchmark LAZUR.
- **Results (qualitative + viscosity):** lowering thickeners did **not** offset titanium-driven viscosity rise; wet whiteness not significantly higher. **Outcome:** open → feeds EP-05.
- **Domains:** `Color = qualitative (whiteness/coverage)`, `Workability = MEASURED` · materials: TiO₂ 698 (+cover/+visc), TIONA 826 (+cover/++visc), chalk (− reduced).

### EP-BZ-05 — Viscosity correction, formulas 187 & 188 → fix final formula
- **Experiment:** 187 = thickeners↓ + TiO₂ 698↑10%; 188 = thickeners↓ + TIONA 826↑10%; track ~11 days. 191 = dispersant D27 replacing Orotan 731.
- **Results (MEASURED):** 187 stabilized ~×2, 188 ~×3, both still high vs LAZUR.
- **Decision:** paint stabilizes after ~1 week; **lower thickeners further; fix final formula.** **Production decision: yes.**
- **Domains:** `Workability = MEASURED` · **Stages:** `LAB_TRIAL, MEASURE_VISCOSITY, DECISION` · materials: thickeners (− reduce), TiO₂, dispersant D27 vs Orotan 731.

### EP-BZ-06 — Floating-pigment field complaint → re-tint batch 004
- **Field report (Eric):** pigments float in tinted 2030-A; could shift delivered shade.
- **Results (qualitative):** "slight difference after mixing, **not significant**" — **field vs lab disagreement, left partly open.**
- **Domains:** `Color = qualitative`, `Workability = qualitative (dispersant/wetting)` · **Stages:** `FIELD_REPORT, LAB_TRIAL, MEASURE_COLOR(qual), DECISION` · materials: black pigment (− floats).

### EP-BZ-07 — Silicate-family production tuning directive (cross-product)
- **Decision (production):** raise anti-foam in Protec-A1; **lower thickeners in Betonize**; raise thickeners in F.SILICATO; **raise titanium in Betonize & F.SILICATO for coverage.** **Production decision: yes.**
- **Domains:** `Color = qualitative (coverage)`, `Workability = qualitative` · **Stages:** `MEETING, DECISION, PRODUCTION`.

---

## 2. Counts, color verdict, contradictions

| Metric | Value |
|--------|-------|
| Episodes | **7** |
| Production decisions | **2** (EP-05 final-formula correction; EP-07 family tuning) |
| Family | silicate coatings *(same as GRANITAL — no new family)* |
| Color/Shade | **qualitative only** — NO measured ΔE (a genuine 2nd Color source, but eyeball-level) |
| Workability/Flow | **MEASURED** (viscosity CPS, multiple episodes) |

**Color verdict:** quantitative instrument data exists **only for viscosity** (CPS, PH, SG) — color is visual ("lighter, BO worst"; "whiteness not higher"; "shade change not significant"). So BETONIZE strengthens Color's **product count** but not its measured depth.

**Contradictions preserved (VERIFIED):**
- **Coverage vs flow:** raising titanium for coverage (EP-04/07) drives viscosity up and forces thickeners down (EP-04/05) — an unresolved pull between Color-coverage and Workability (final formula still "to be fixed").
- **Compatibility vs shade:** "no pigment-compatibility problem" yet a real heat-induced shade shift (EP-01).
- **Batch 002 vs 003:** 002 coagulated (defective) → retrial 003, but 003's results are empty → "is 2030-B inherently unstable or was it just batch 002?" unanswered.
- **Floating pigment:** field (Eric) says real problem; lab says shade change "not significant" — field vs lab, left open.

**Absences:** no ΔE/instrumental color; no filled results for additive trials (EP-02) or batch 003; no weathering/adhesion/opacity/gloss data; no supplier swap (only intent to search a bluer titanium); no final approved production-formula document.

> BETONIZE adds a 2nd Color product (qualitative), a rich seam of **measured Workability**, a real **field-report** episode, and two production decisions — exactly the expected-gain it was picked for, even though it does not deepen Color's *measured* density.
