# DOE — Cement Threshold (the decision experiment, V4 prospective)

*Prepared 2026-06-26. The observational product data can only be **K** (it confounds cement% with binder system). This controlled experiment is the decision tool: vary **only** cement%, hold everything else fixed, and test whether 28-day strength undergoes a non-linear transition **at a predicted window**. Because the threshold location is predicted in advance, a PASS is **V4-grade (prospective)** — the first result that could move VDI from 0 to 1. Sealed pre-registration `mvp/validation/doe-cement-prereg-v4.json` (id `DOE-V4CEM-f72e82b6b4`, supersedes the V1 `DOE-V1CEM-…`); analysis runs through the blind instrument `run-v1-segmented.mjs`.*

## The prospective hypothesis (predicted window, not a single point)

> A non-linear strength transition will occur when cement content crosses the **11–13 % window (center 12 %)**, under constant binder_class, PSD, W/P target, curing, and mixing protocol.

A window (not 12.0 % exactly) is deliberate: actual weighing drifts, real W/P shifts, 28-day strength is noisy, and a physical threshold is a transition *zone*. The search range (9–15 %) is **wider** than the window, so the estimated breakpoint *can* land outside 11–13 % — and a PASS requires it lands inside. That is what makes it a genuine prediction rather than a fitted description.

## Design

| Factor | Setting |
|---|---|
| **Varied** | `cement_pct` at 5 levels: 8 / 10 / 12 / 14 / 16 % |
| **Fixed** | binder system, PSD, target W/P, curing, mixing — identical across all batches |
| **Replicates** | **4 independent batches per level** (20 batches); **2 cubes/batch averaged** to cut measurement noise |
| **Analysis unit** | batch-mean 28-day strength (n = 20) — never per-cube (pseudo-replication) |
| **Randomisation / blinding** | cast & test order randomised; cubes blind-coded; strength operator blind to cement level |

## The model — a level shift, not two free slopes

The fit is `strength = β₀ + β₁·cement + δ·1[cement ≥ T]` (common slope + a jump δ at T). This is the faithful model for a *threshold jump*, and — unlike two independent sloped segments — it **localizes the breakpoint sharply**. (Self-test proved this matters: with two free slopes a true break at 15 % was mis-estimated as 13 % and wrongly passed the window; the level-shift model estimates it at 15 % and correctly fails.)

## Decision rule — PASS only if all seven

1. breakpoint detected (estimated in 9–15 %, never hand-picked)
2. improvement ≥ 0.30 (jump vs linear, fractional RSS reduction)
3. permutation p < **0.025** (2000 shuffles; tightened from 0.05 after the null FP measured 8 %)
4. bootstrap stable — breakpoint 95 % CI width ≤ 4 % (2000 resamples)
5. persists after confounder control (actual W/P + cast_order)
6. **breakpoint_in_window** — estimate within 11–13 %
7. **ci_overlaps_window** — bootstrap CI intersects 11–13 %

Criteria 6–7 are the prospective (V4) gate. Fail any → FAIL, recorded; VDI unchanged.

## Self-test (synthetic — proves the instrument, not a result)

| Case | Truth | Result |
|---|---|---|
| **A** | break at 12 % (inside window) | **PASS** — est 13 %, CI [12,13], improvement 0.75, perm p=0.0005, all 7 ✓ |
| **C** | break at 15 % (**outside** window) | **FAIL** — est 15 %, CI width 6 → fails `bootstrap_stable` **and** `breakpoint_in_window`, despite a real break |
| **B** | no break (null) | **FAIL** — improvement 0.08, perm p=0.62 |

A returns PASS only when the break is real *and where predicted*; C shows a real-but-mispredicted break is rejected; B rejects noise.

## Power — read before casting (`node doe-power.mjs`, V4 design)

```
jump(MPa)   σ=1.0   σ=2.0   σ=3.0
3            45%     11%      4%
5            97%     28%     13%
8           100%     81%     39%
12          100%    100%     80%
NULL (jump=0, σ=2): false-positive 2.0%   (tightened p brought it under 5%)
```

**Honest implications:**
- The 20-batch design detects reliably only when the **jump ≥ 8 MPa AND batch σ ≤ 2** (or jump ≥ 12 at σ = 3).
- A modest transition (3–5 MPa) or high batch noise (σ ≈ 3, the rain-batch scatter) will be **missed** — add batches/level or average more cubes per batch to cut σ *before* committing.
- Null false-positive is now **2 %** (the tighter p + window gate fixed the earlier 8 %).

## Execution → analysis

1. Run the DOE; fill `mvp/validation/doe-input.template.json` (20 rows; randomised order, blind codes, **actual** W/P recorded).
2. Rachel keeps `strength_28d` (batch mean of 2 cubes) in a **separate** `doe-strength.json` (`{batch_id: value}`), held out from the investigator.
3. Commit the input table + the sealed prereg (so the seal predates the strengths in git history).
4. Rachel runs:
   ```
   node mvp/validation/run-v1-segmented.mjs \
        mvp/validation/doe-cement-prereg-v4.json  doe-input.json  doe-strength.json
   ```
5. Output: PASS/FAIL + estimated threshold + CI + model-comparison stats only; raw strengths never exposed; result locked in `v1-ledger.jsonl`.

> Bottom line: observational data framed the question (**K**); this DOE decides it (**V**), and because the threshold is predicted in advance it is **V4-eligible**. Power says: make the jump large and the batches clean (or scale up), and this is the project's first real shot at **VDI = 1**.
