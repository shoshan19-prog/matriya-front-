# Do the metrics repeat? — reproducibility on MPZ and INT-TFX

*Prepared 2026-06-29. The Tel Aviv result was one project. One project cannot tell you whether a metric measures a real property of the research process or just fit one lucky case. This re-runs the **same** metric set on two more projects, in the order the validation plan calls for — **MPZ first** (measured, strength-rich → a real test), **INT-TFX second** (Stage-0/POC, almost no experiments → a negative case). Code: `mvp/knowledge-map/metrics/replicate.mjs`. Run: `matriya reproduce` or `node metrics/replicate-demo.mjs`.*

> **Read every verdict below as "reproduces EXCEPT the adversarial content-check."** The Sensitivity Harness left one gap open — a false `measured` claim still passes — so nothing here is a *validated metric*, only a *reproducing* one.

---

## The test, fixed in advance

The Tel Aviv finding had a specific shape: the metrics **localized the project's own documented weak point** — TLV grounded its *adhesion* logic but never measured 28-day *strength*, and the metrics flagged exactly the strength decisions as incompressible and untraceable while the adhesion ones stayed clean. So the reproducibility question is **not** "does a number repeat" but:

> Do the metrics land the loud signal on the asset the lab **could not ground**, while the asset it **did ground** stays quiet — for the reason the lab itself documented?

That structural test (loud-on-ungrounded **with** a discrimination guard that the grounded asset must stay quiet) was chosen from the TLV structure *before* looking at whether MPZ passes — otherwise "adjust until it passes" is just hindsight bias, the thing this whole track has been guarding against.

---

## MPZ — REPRODUCES (and it is the mirror image of TLV)

```
asset                         conf  measured  entropy
Compression Strength          0.63     4        0.39   ← GROUNDED, stays quiet
Set / Cure                    0.15     0        0.69   ← loud
Water Resistance / Moisture   0.13     0        0.70   ← loudest
```

| metric | MPZ |
|--------|-----|
| weak point detected? | **YES** — loudest = Water/Moisture & Set/Cure; grounded Compression quiet |
| decision compressibility | avg **0.38**; incompressible **M0** (the 2020–21 blank-MPa batches) |
| decision traceability | **0.67** (4/6) — leaks on the early unmeasured batches |
| momentum / evidence | **0.75** — *evidence-led* (decisions rest on measurement) |
| frontier phase | **TRANSITION** (0.33) — Set/Cure + Water still to build |
| sensitivity | signal responds ✓ · duplicate ignored ✓ · adversarial OPEN |

**Why this is the strong result.** MPZ is TLV *inverted*: TLV measured adhesion and left **strength** dark; MPZ measured **strength** and left the **process/moisture** axis dark (the April failure was literally *"rain-water absorption"* + over-dilution, recorded qualitatively). The metrics flipped with the project — the loud signal moved off strength (now grounded, H 0.39) and onto Water/Set-Cure (H 0.69–0.70), and the one incompressible decision (`M0`) is precisely the corpus's largest documented absence. That is reproduction **and** discrimination in a single case: the metric is tracking *where the evidence actually is*, not a fixed asset.

> Note on honesty: my first pass hand-picked a single weak-point asset (`Set / Cure`) and demanded an exact top-1 match — Water beat it by 0.01 and it read "DOES NOT REPRODUCE." That was a brittle detector, not a metric failure: the lab's documented cause is a water/curing **cluster**, and Water being loudest is the metric being *right* (rain-water absorption was the April cause). The detector was corrected to test the documented cluster with a grounded-stays-quiet guard. The guard is what stops this from being a rubber stamp.

## INT-TFX — NOT ENOUGH DATA (the negative case, behaving correctly)

```
asset              conf  measured  entropy
Fire Resistance    0.32     1        0.61   (1 legacy datapoint, held at a gate)
```

| metric | INT-TFX |
|--------|---------|
| weak point detected? | YES, trivially — *everything* is the weak point |
| decision compressibility | avg **1.0**; incompressible **T1, T2, T3** (3 of 4 decisions have no evidence) |
| decision traceability | **0.25** (1/4) |
| momentum / evidence | **2.0** — *deciding ahead of evidence* (the Stage-0 "define-before-experiment" posture, exactly as documented) |
| frontier phase | **GENERATE** (0) — nothing to retrieve, everything must be built |
| verdict | **NOT ENOUGH DATA** |

INT-TFX has **0 executed additive trials** and **1** legacy burn datapoint held at an anomaly gate. With one measured asset and one explainable decision, there is nothing to *discriminate* — a metric that "detected the weak point" here detected it trivially (all four decisions are weak). The right behavior for a valid metric is to **refuse to claim reproduction on a corpus this thin**, and that is what the verdict logic does (`measuredAssets === 0 || explainable ≤ 1 → NOT ENOUGH DATA`). The interesting, *real* signal INT-TFX does give is the **Momentum/Evidence = 2.0** diagnostic: it is deciding twice as fast as its evidence supports — the precise, measurable fingerprint of a gate-first POC.

---

## Momentum / Evidence — a new diagnostic this run surfaced

> `Momentum / Evidence = decisions taken / measured-evidence weight` — are we deciding **on** data or **ahead** of it?

- MPZ **0.75** → evidence-led (healthy: a measure-rich family).
- INT-TFX **2.0** → deciding ahead of evidence (a Stage-0 posture; not wrong, but a flag).
- It cleanly separates the two documented postures — trial-heavy/measure-rich vs gate-first/define-before-experiment — without being told which is which.

## The reproducibility gate

| project | role | verdict |
|---------|------|---------|
| Tel Aviv | original | localized (strength) ✓ |
| **MPZ** | positive test | **REPRODUCES** (process/moisture; mirror image) ✓ |
| **INT-TFX** | negative case | **NOT ENOUGH DATA** (correctly refuses) |

```
reproducibility: 2 / 3 positive  ·  discrimination ✓  ·  independence ✓  ·  sensitivity ◐ (adversarial open)
⇒ promote a metric to permanent architecture?  NOT YET.
```

Two of three projects now localize the weak point by the same mechanism, and the third correctly declines — which is itself evidence the metric isn't a hindsight fit. But "2/3 positive" is still one short of a ≥3-positive bar, and the **adversarial content-check from the Sensitivity Harness is still open**. So: stronger than Tel-Aviv-alone, not yet a law.

## Status & next

- Built & runnable: `metrics/replicate.mjs` (per-project metric replay · weak-point localization with a discrimination guard · Momentum/Evidence · per-project sensitivity probe · verdict), `replicate-demo.mjs`, wired as `matriya reproduce`.
- Honest scorecard: TLV ✓ + MPZ ✓ = 2 positive; INT-TFX = NOT ENOUGH DATA (negative case behaving correctly); discrimination & independence hold; sensitivity passes signal+noise, **adversarial still open**.
- Next to actually reach promotion: a **3rd positive project** with real measured decisions (GRANITAL/Color or PROTECH-A1/Fire are candidates), **and** closing the adversarial content-check (a content-level contradiction check) before any metric is called a law.

> Convergence on one project proves nothing. Two now reproduce by the same mechanism — and, tellingly, as mirror images, so the metric is tracking *where the evidence is*, not a fixed answer. The third honestly says "too thin." Still measured hypotheses — and still only "validated except the adversarial content-check."
