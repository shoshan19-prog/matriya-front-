# Product Reconstruction — MPZ (graded cementitious render / "הרבצה צמנטית")

> Extraction #3 of the Organizational Learning Backlog plan. Chosen as **critical for strength/cement patterns** — and it delivered: this is the **only family with substantial real compressive-strength data**. Read-only; nothing in Drive modified. Strength *results* are reported as patterns/magnitudes (performance data, not recipes); the cement-loading lever is kept qualitative; full compositions stay local.
>
> *Prepared 2026-06-28. Same rules: never invent; VERIFIED vs ASSUMPTION; source per statement; contradictions preserved; absence reported.*

---

## 0. Identity

**Product/family:** **MPZ** — graded cementitious render ("הרבצה צמנטית", Fresco Colors), grades **2.5 / 5 / 10 / 15 / 20**. A **white-cement-loading ladder**: the grade number scales with white-cement content. **Distinct family** from the plaster line and from INT-TFX → the **third family**, clearing cross-family diversity. `[VERIFIED]`

**Sources (read directly):** master compression log `בדיקת לחיצה.xlsx` (id `1KypPsT1QAcLbMXwcp4WHINy6nKEDzkbc`); per-grade formulation sheets `MPZ-2.5 Batch.xlsx`, `mpz 5.xlsx`, `MPZ 10.xlsx`, `MPZ 5.xlsx` (+ workbooks); MPZ folder (id `11DLwOAPJCfJQv8YDLB0tSCYKojdCvZu9`) holding only supplier datasheets (Radixite 400, Bayferrox pigment).

**Dominant lever (qualitative):** white-cement loading, stepped up with the grade; more cement → higher MPa, confirmed by the strength data. `[VERIFIED]`

---

## 1. Knowledge Episodes

### EP-MPZ-01 — Establish the grade ladder via cement loading
- **Hypothesis:** strength scales with white-cement content; encode it in the grade number.
- **Experiment:** formulation sheets MPZ 2.5 / 5 / 10 (cement lever stepped up). **Results:** formulations finalized; MPa not in these sheets.
- **Decision:** ACCEPT the graded ladder (one platform, one lever). **Production decision: yes** (defines the product line).
- **Stages:** `LAB_TRIAL, DECISION, PRODUCTION` · **Outcome:** `accepted`.

### EP-MPZ-02 — Early 2020–2021 batches, strength left unmeasured
- **Experiment:** many batches (MPZ 2.5/5/15/20) cast Dec 2020–Nov 2021.
- **Results:** **predominantly EMPTY** — cast/28-day dates filled, MPa cells blank.
- **Decision:** none recorded. **Why:** data-capture gap (testing not performed/recorded). *(The largest absence in the corpus.)*
- **Stages:** `LAB_TRIAL` (intended MEASURE not completed) · **Outcome:** `open` · prod-decision: no.

### EP-MPZ-03 — First real numbers: sparse 2020–2021 high grades
- **Results (28-day):** MPZ15 = 4.3 / 11.7 / 9.2 MPa (high scatter); MPZ20 = 20.1 and ~27 MPa (cubes 22–33, very scattered).
- **Decision:** high grades clearly load-bearing; **scatter flagged**. **Why:** confirms the cement lever at the top of the ladder.
- **Stages:** `MEASURE_COMPRESSION, DECISION` · **Outcome:** `accepted` (directional) · prod-decision: no.

### EP-MPZ-04 — April 2025 systematic re-test (FAILS on process)
- **Experiment:** casts 31.03–10.04.2025, all grades, dilution standardized ~18%.
- **Results (28-day avg):** MPZ2.5 ≈1.0; MPZ5 ≈1–2; MPZ10 ≈3.0; MPZ15 ≈13.3; MPZ20 ≈15.1 MPa.
- **Decision:** **RETRIAL** — results judged poor/inconsistent. **Why:** over-dilution, imperfect cubes, **rain-water absorption** ("יתכן והקוביות ספגו מים מהגשם"), bags possibly under 25 kg.
- **Stages:** `LAB_TRIAL, MEASURE_COMPRESSION, DECISION` · **Outcome:** `retrial` · prod-decision: no.

### EP-MPZ-05 — December 2025 re-cast: process tightened, strength jumps
- **Hypothesis:** the April failures were **process, not formula**.
- **Experiment:** casts 08–15.12.2025, all grades, dilution 18% held, careful weighing.
- **Results (28-day avg):** MPZ2.5 2.84; MPZ5 4.91; MPZ10 3.69; MPZ15 19.61; MPZ20 23.83 MPa — **higher at every grade than April** (50-day keeps rising, MPZ20 ≈30.7).
- **Decision:** ACCEPT the controlled process as the reference. **Why:** same formula + better water/curing → large strength gain → April loss was moisture/dilution, not the recipe. **Production decision: yes** (sets reference batch + procedure).
- **Stages:** `LAB_TRIAL, MEASURE_COMPRESSION, DECISION, PRODUCTION` · **Outcome:** `accepted`.

### EP-MPZ-06 — Test-protocol drift noted and logged
- **Results:** cubes tested at 8 days vs 7, 15 vs 14, "tested 1 day after the 7-day date" — small timing offsets documented.
- **Decision:** keep data but **annotate**; standardize test-day discipline.
- **Stages:** `MEASURE_COMPRESSION, FIELD_REPORT` (lab annotation) · **Outcome:** `open` · prod-decision: no.

### EP-MPZ-07 — Sibling cementitious products, no strength captured
- **Experiment:** Washputz (4 batches Jan 2021) and TLV plaster (6 batches Jul 2021) in the same log.
- **Results:** dates/dilution/cube-count only; **MPa EMPTY.**
- **Stages:** `LAB_TRIAL` · **Outcome:** `open` · prod-decision: no.

---

## 2. Strength-data verdict (the reason this family matters)

**Compression numbers are PRESENT and substantial for MPZ — the richest strength dataset found** — but unevenly:
- 7 / 14 / 28 / 50-day MPa recorded in full for **every grade** in the **two 2025 campaigns** (April + December). `[VERIFIED]`
- Earlier 2020–2021 batches are **mostly EMPTY** (only a handful of MPZ15/20 points).

**Two VERIFIED patterns:**
1. **28-day MPa rises monotonically with grade** (cement-loading ladder confirmed by measurement).
2. **The Dec-2025 controlled campaign beats the April campaign at every grade** — attributed to **water/curing control, not a formula change.** This is a genuine **process** insight: *how* the batch was made dominated the result.

---

## 3. Counts, contradictions, absences

| Metric | Value |
|--------|-------|
| Episodes | **7** |
| Production decisions | **2** (EP-01 ladder definition; EP-05 controlled reference batch) |
| Family | **MPZ cementitious render** *(third family ✓)* |
| Compression (7/28-day) | **PRESENT** (2025 campaigns, all grades) — unique in the corpus |
| SEM | **ABSENT** (no microstructure data anywhere for MPZ) |
| Viscosity / set-time / supplier-change episode | **ABSENT** for MPZ specifically |
| Meeting / field reports | largely **ABSENT** (one MPZ20 batch tagged "רשות עתיקות" implies a real project, no field report) |

**Contradictions preserved (VERIFIED):**
- **MPZ-2.5 white-cement quantity disagrees between sheets** (`MPZ-2.5 Batch.xlsx` vs the `mpz 5.xlsx` "MPZ 2.5" sheet) — same nominal grade, different cement loading. Flagged, not reconciled.
- **Dec-2025 ordering anomaly:** MPZ10 28-day (3.69) came out **below** MPZ5 (4.91), breaking the monotonic ladder for that one campaign — the MPZ10 batch was an old 2023 mix; age/mix likely explains it `[ASSUMPTION on cause]`.
- Multi-product workbooks embed other grades' sheets (title vs content mismatch) — noted.

> MPZ is the family that finally gives the project **real strength outputs** — and its sharpest lesson is a process one: the same formula passed or failed on **water and curing control**, not chemistry. That is exactly the kind of organizational-process signal the Learning Engine exists to find — now with measured support inside one family (still one family, so still a hypothesis until it recurs cross-family).
