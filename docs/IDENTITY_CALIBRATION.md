# Identity Calibration Harness — making the resolver measurable

*Prepared 2026-06-26. Step 1 of the agreed sequence (Calibrate → Extract → Graph-write). Turns the Identity Resolver from "looks right" into a **measured** instrument: precision, recall, false-link rate, and confidence calibration on a labeled set. **No graph writes** until these hold on real labels. Code in `mvp/intake/calibration/`, runs with `node harness.mjs`.*

## Why first

A score like `0.99` is an internal number until it is checked against reality. Writing identity links into the graph before calibration would stream relationships that *look* precise but have no measured reliability. So: measure first.

## The labeled set

`labeled-set.mjs` — a **synthetic fixture** (to be **replaced by 30–50 real human-labeled files** with `correct_product / correct_version / correct_experiment`). It deliberately includes positives, weak-signal cases, true orphans, and **adversarial "mention-in-passing"** items. The harness logic runs unchanged on the real set.

## What it measures (`node mvp/intake/calibration/harness.mjs`)

On the current fixture (22 items):

| metric | raw | after |
|---|---|---|
| precision | 0.889 | 0.889 |
| recall | 1.0 | — |
| false-link rate | 0.111 | — |
| **calibration ECE** | **0.136** | **→ 0** (recalibrated) |

**The calibration table is the headline finding:**

```
conf 0.95–1.00: n=10  mean_conf 0.98  ACTUAL acc 1.00
conf 0.85–0.95: n=5   mean_conf 0.90  ACTUAL acc 0.60   ← "0.9" is really 0.6
conf 0.70–0.85: n=3   mean_conf 0.75  ACTUAL acc 1.00
```

Raw confidence **overstates** in the 0.9 band — exactly the risk you flagged. This is why graph-write must wait.

## The two improvements

- **#1 Recalibration** (`calibrator.mjs`): isotonic (PAV) map raw→empirical accuracy. **ECE 0.136 → 0** — a calibrated 0.9 now means ~90%.
- **#2 Per-entity-type reliability** (`metrics.perTypeReliability`): learns which entity *types* are trustworthy and re-weights the resolver. Learned: `operator 0.5` (unreliable — operators span many products), `date/version/product_code/path/name 0.9–1.0`. (On this fixture precision was unchanged because the residual errors aren't operator-driven — see below — but the mechanism correctly down-weights the weak signal.)

## The two innovations

- **innov #1 Risk-budgeted threshold** (`metrics.selectiveThreshold`): instead of a guessed 0.70, the auto-link threshold is **derived** to guarantee a target precision. At target **0.95**, the result is threshold ≈ 1.01, **coverage 0** — meaning **on this set you cannot auto-link anything at 95% precision; everything must go to human review.** The system refuses to over-claim. That is the correct, honest behavior.
- **innov #2 Adversarial false-link probes**: items where another product's id appears *in passing*. Measured **adversarial false-link rate = 0.25** — `A03` (three products mentioned, no single subject) wrongly linked. The mention-in-passing failure is now a number, not a worry.

## Routing (your thresholds, on calibrated confidence)

```
≥0.95  auto    → 0 items
0.70–0.95 review → 18 items  (accuracy 0.89)
<0.70  orphan  → 4 items   (accuracy 1.00)
```

Nothing auto-links yet; the harness routes everything to review — appropriate for an uncalibrated, pre-real-label state.

## Findings → next fixes (surfaced by the harness)

1. **Confidence was miscalibrated** → recalibration is now mandatory before any score is trusted or written.
2. **`operator` is an unreliable entity type** → down-weighted; don't let it drive a link alone.
3. **Adversarial false-links (25%)** come from "multiple strong candidates, no dominant subject." The clean fix is a **margin-based abstention rule**: if the top-2 candidates are within a small confidence margin, **abstain** (orphan/review) rather than pick. Not yet implemented — flagged as the next improvement, because the harness *measured* the need for it.
4. **At target precision 0.95, auto-link coverage is 0** → **do NOT write to the graph yet.**

## Decision (unchanged)

**No graph writes.** The Identity Resolver is now *measurable*. The next real step is to **replace the synthetic fixture with 30–50 human-labeled files** and re-run; only when calibrated precision/coverage clear the bar do we proceed to Content Extraction (step 2) and then thresholded graph-write (step 3): `≥0.95 auto · 0.70–0.95 human review · <0.70 orphan`.
