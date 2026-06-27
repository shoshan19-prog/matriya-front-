# DOE — Cement Threshold (the decision experiment)

*Prepared 2026-06-26. The observational product data can only be K (it confounds cement% with binder system). This controlled experiment is the decision tool: vary **only** cement%, hold everything else fixed, and test for a nonlinear strength transition. Sealed pre-registration `mvp/validation/doe-cement-prereg.json` (id `DOE-V1CEM-44ef2cf0ea`); analysis runs through the already-built blind instrument `run-v1-segmented.mjs`.*

## The sharpened hypothesis

Not "higher product grade → higher strength" (circular), but:

> **Within a fixed binder system, as cement% rises, 28-day strength undergoes a one-break (nonlinear) transition at a critical cement fraction.**

## Design

| Factor | Setting |
|---|---|
| **Varied** | `cement_pct` at **5 levels**: 8 / 10 / 12 / 14 / 16 % |
| **Fixed** | binder system, PSD, target W/P, curing protocol — identical across all batches |
| **Replicates** | **3 *independent batches* per level** (15 batches). NOT 3 cubes from one batch — that is pseudo-replication and measures cube scatter, not real variability |
| **Analysis unit** | the **batch mean** 28-day strength (n = 15) |
| **Randomisation** | cast order and test order randomised (1…15); cubes carry **blind codes** |
| **Blinding** | the operator crushing cubes does **not** know the cement level |

Three refinements above (independent batches, randomisation, blinding) are not optional polish — without them the experiment re-confounds cement with batch-day / operator / position drift.

## Why a DOE removes the confounder that sank the observational test

In the observational data, cement% and `binder_class` were collinear, so a detected break could not be attributed to cement. Here **binder/PSD/W-P are constant by construction** — they *cannot* confound, because they do not vary. The only residual confounders are **actual W/P** (record it; fixing target W/P while changing cement can shift real water demand) and **execution order** (record `cast_order`). Both are pre-registered as covariates.

## Decision rule — PASS only if all five

1. **breakpoint detected** in 9–15 % (estimated, never hand-picked; ≥6 batch-means per segment)
2. **improvement ≥ 0.30** (segmented vs linear, fractional RSS reduction)
3. **permutation p < 0.05** (1000 shuffles)
4. **bootstrap stable** — breakpoint 95% CI width ≤ 4 % cement (1000 resamples)
5. **persists after confounder control** — significant after residualising on actual W/P + cast_order

Failing any one → **FAIL**, recorded; VDI unchanged.

## Power — read this BEFORE casting (from `node doe-power.mjs`)

Detection rate of the full criteria, by true strength-jump and batch-to-batch σ:

```
jump(MPa)   σ=1.0   σ=2.0   σ=3.0
3            40%      9%      5%
5            97%     32%     11%
8           100%     74%     34%
12          100%    100%     74%
NULL (jump=0, σ=2): false-positive 8%
```

**Honest implications:**
- **15 cubes suffice only if the jump is large (≥ 8 MPa) AND batch noise is tight (σ ≤ 2).**
- If the real transition is modest (3–5 MPa), or batch σ is ~3 (the scatter the rain-affected observational batches showed), **the design is under-powered and will miss it.** Mitigate *before* committing: 4–5 batches/level, and/or average 2–3 cubes per batch to cut σ.
- Null false-positive is **8%** (above nominal 5%) from scanning two breakpoints + the bootstrap gate — consider tightening permutation `p_threshold` to 0.025, or rely on the 5-criterion conjunction (the confounder gate, not in this sim, lowers it further).

## Ladder placement — this is the path to a real VDI increment

The observational V1 is at best a screen. This DOE, done blind, is a **controlled, prospective** test: if you also pre-register the *predicted* threshold location (the chemist's "~12%") and new cubes confirm it, the result is **V4-grade (prospective prediction confirmed by a new experiment)** — the first thing that could legitimately move **VDI from 0 to 1**. To claim V4, add the predicted threshold to the prereg before running; to claim only V1 (existence of a break), leave it estimated.

## Execution → analysis

1. Run the DOE; fill `mvp/validation/doe-input.template.json` (features only — randomised order, blind codes, actual W/P).
2. Rachel keeps `strength_28d` in a **separate** `doe-strength.json` (`{batch_id: value}`), held out from the investigator.
3. Commit the input table + the sealed prereg (so the seal predates the strengths in git history).
4. Rachel runs the blind instrument:
   ```
   node mvp/validation/run-v1-segmented.mjs \
        mvp/validation/doe-cement-prereg.json  doe-input.json  doe-strength.json
   ```
5. Output is PASS/FAIL + estimated threshold + CI + model-comparison stats only; raw strengths never exposed; result locked in `v1-ledger.jsonl`.

> Bottom line: the observational data is **K** (it framed the question). This DOE is **V** (it decides the answer). Power says: make the jump large and the batches clean, or scale up — then it is the cleanest shot the project has at its first validated discovery.
