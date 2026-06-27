# V1 — Cement Threshold Hypothesis (sealed pre-registration + blind instrument)

*Prepared 2026-06-26. Implements the pre-registration for: "a sharp 28-day-strength transition is not tied to product grade, but appears when cement content crosses a critical threshold." The instrument is segmented-regression-based, investigator-blind to raw strengths, and self-tested. Sealed pre-registration: `mvp/validation/v1-cement-prereg.json` (id `V1CEM-0f9baeceb2`).*

## What was built

| File | Role |
|---|---|
| `mvp/validation/segmented.mjs` | pure stats: OLS, one-break segmented fit, permutation test, bootstrap CI, confounder residualization |
| `mvp/validation/run-v1-segmented.mjs` | blind runner: verifies the seal, joins held-out strengths, runs the 5-criterion test, prints **only** aggregate stats |
| `mvp/validation/v1-cement-prereg.json` | the sealed pre-registration (predefined params; **no outcome info**) |

## Pre-registered parameters (fixed before any outcome access)

- **input feature** `cement_pct` → **outcome** `strength_28d` (HELD OUT), joined by `batch_id`
- **breakpoint search range**: 6–18 % cement; **min 3 points/segment**; breakpoint **estimated, never hand-picked**
- **model comparison**: improvement = fractional RSS reduction of segmented vs linear; require **≥ 0.30**
- **permutation**: 1000 shuffles, **p < 0.05**
- **bootstrap**: 1000 resamples, breakpoint **95% CI width ≤ 6** pts
- **confounders**: `water_powder_ratio` (continuous) + `PSD_key`, `binder_class` (categorical), via covariate residualization
- **PASS only if all 5**: breakpoint detected · improvement ≥ 0.30 · permutation significant · bootstrap stable · **persists after confounder control**

## Investigator blindness

The investigator authors the prereg + the input table (visible features only). The **`strength_28d` column is supplied separately by the data holder (Rachel)** and read only by the runner, which prints PASS/FAIL, the estimated threshold, its CI, and model-comparison stats — **never raw strengths**.

## Self-test (synthetic, NOT a scientific result)

Three synthetic datasets prove the instrument behaves correctly before any real run:

| Case | Truth | Result | Why |
|---|---|---|---|
| **A1** | real threshold at 12%, confounders **independent** | **PASS** | breakpoint 11.75% (CI 10.25–13), improvement 0.91, perm p=0.001, adj p=0.003 — all 5 ✓ |
| **A2** | real threshold, but `binder_class` **collinear** with it | **FAIL** | criteria 1–4 ✓, but confounder-adjusted p=0.16 — correctly refuses to credit *cement* when *binder system* explains it equally |
| **B** | **no** threshold (linear) | **FAIL** | permutation p=0.28 (not significant) + bootstrap CI width 11.5 (unstable) — spurious break rejected |

A1 shows the instrument *can* return PASS; A2 and B show it *won't* be fooled by a collinear confounder or by noise.

## The honest caveat this surfaces (read before running on real data)

In the real Fresco product library, **cement% and `binder_class` are very likely collinear** — cement-class products contain cement, lime-class products don't. Case **A2** is therefore the probable real outcome: the instrument will detect a threshold but **FAIL criterion 5**, because the data cannot separate "cement crossed a threshold" from "the binder system changed." That is not a defect — it is the instrument correctly reporting that the hypothesis is **not cleanly testable on observational product data**. To test it properly you need the **DOE** you already proposed: vary cement% across ≥3 levels while holding binder system, PSD, W/P, and curing fixed. Only then is the threshold attributable to cement alone.

## How Rachel runs it (the real V1)

1. Investigator commits the input table (features, no strength) + the sealed prereg.
2. Rachel adds her `strength_28d` map (held out from the investigator) and runs:
   ```
   node mvp/validation/run-v1-segmented.mjs \
        mvp/validation/v1-cement-prereg.json  input-table.json  strength.json
   ```
3. The run is appended to `v1-ledger.jsonl` (locked, single-use per table; failures counted). Output is PASS/FAIL + threshold + CI + stats only.

> VDI stays **0** until a real run PASSES all five criteria on data the investigator did not see. Given the collinearity caveat, the most likely honest path to VDI = 1 is the small DOE, not the observational product table.
