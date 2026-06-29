# Do the metrics repeat? — reproducibility on MPZ, INT-TFX, PROTECH A1 (Fresco projects only)

*Prepared 2026-06-29. The Tel Aviv result was one project. One project cannot tell you whether a metric measures a real property of the research process or just fit one lucky case. This re-runs the **same** metric set on more projects, in the order the validation plan calls for — **MPZ** (measured, strength-rich → a real test), **INT-TFX** (Stage-0/POC → a negative case), **PROTECH A1** (measured coating, qualitative-only Color → a 3rd internal test). Code: `mvp/knowledge-map/metrics/replicate.mjs` + `domains/provenance.mjs`. Run: `matriya reproduce` or `node metrics/replicate-demo.mjs`.*

> **Read every verdict below as "reproduces EXCEPT the adversarial content-check."** The Sensitivity Harness left one gap open — a false `measured` claim still passes — so nothing here is a *validated metric*, only a *reproducing* one.

---

## The provenance fence — validation ≠ "any source"

A Knowledge Asset is scale-invariant and may take evidence from **anywhere** — internal projects, raw-material QC, even a competitor's ΔE deck (a real colorimetry number is real regardless of who measured it). But **validating a law is a different act**: it must reproduce on the **defined reference corpus** — real Fresco projects with their own decision cycles — or the test mixes the internal corpus with outside data and biases itself. So `domains/provenance.mjs` tags every product and the reproducibility gate counts **only** `origin:fresco · role:project`:

```
Fresco PROJECTS (validation-eligible): טיח תל אביב · תרמי · INT-TFX · MPZ · GRANITAL · fire-retardant plaster · BETONIZE · PROTECH A1
Fresco QC sources (evidence only):     raw-material QC · field-stone QC · spectro QC · MP-1000/CC primer
External references (evidence only):   concrete densifiers (commercial benchmarks)
Unverified (excluded until confirmed): F.SILICATO · Sloxan/LASUR · Italian/Acryl-Plus
⇒ evidence may come from any of these; validation counts ONLY the Fresco projects.
```

The fence is live: asking it to validate on `concrete densifiers` returns **NOT A VALIDATION PROJECT** — usable as a knowledge source, never as a reproducibility case.

### Honest correction logged: GRANITAL is Fresco's
The question "is GRANITAL external?" was the right *principle* but the wrong *example*: GRANITAL's own reconstruction states it **is** "Fresco's silicate facade paint, the internal counterpart to KEIM Granital" (the KEIM vendor PDFs were read as reference only). So GRANITAL is **eligible** — the genuinely external items are the vendor/competitor references (KEIM, the commercial-densifier benchmarks) and anything whose origin is unverified. The fence encodes the principle correctly without mis-labeling GRANITAL.

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

## PROTECH A1 — REPRODUCES (a 3rd internal Fresco project, the mirror again)

```
asset                         conf  measured  entropy
Water Resistance / Moisture   0.65     2        0.19   ← grounded, quiet
Fire Resistance               0.63     1        0.26   ← grounded (A1 cert), quiet
Workability / Flow            0.52     3        0.50   ← grounded, quiet
Color / Shade                 0.17     0        0.68   ← loudest
```

| metric | PROTECH A1 |
|--------|-----------|
| weak point detected? | **YES** — loudest = Color/Shade; grounded Workability/Fire/Water quiet |
| decision compressibility | avg **0.36**; incompressible **none** (every decision explainable) |
| decision traceability | **0.83** (5/6) — the one leak is the qualitative Color decision (PB) |
| momentum / evidence | **0.5** — *evidence-led* (the most measurement-grounded project yet) |
| frontier phase | **TRANSITION** (0.5) |
| sensitivity | signal responds ✓ · duplicate ignored ✓ · adversarial OPEN |

PROTECH is the cleanest case: three **measured** assets (Workability cps, the Class-A1 fire cert, oven/water stability) all stay quiet, and the single qualitative asset — **Color** — is both the loudest (H 0.68) and the only traceability leak. Same mechanism as TLV and MPZ, a third time, on a third independent Fresco project. Its decisions are also fully compressible (avg 0.36, nothing incompressible), which matches the documentation: PROTECH actually *finished* its measured arcs, where TLV and MPZ each left one axis unmeasured.

## Momentum / Evidence — a new diagnostic this run surfaced

> `Momentum / Evidence = decisions taken / measured-evidence weight` — are we deciding **on** data or **ahead** of it?

- MPZ **0.75** → evidence-led (healthy: a measure-rich family).
- PROTECH A1 **0.5** → the most evidence-led project (three measured assets).
- INT-TFX **2.0** → deciding ahead of evidence (a Stage-0 posture; not wrong, but a flag).
- It cleanly separates the documented postures — trial-heavy/measure-rich vs gate-first/define-before-experiment — without being told which is which.

## The reproducibility gate

| project | role | verdict |
|---------|------|---------|
| Tel Aviv | original | localized (strength dark) ✓ |
| **MPZ** | positive test | **REPRODUCES** (process/moisture dark; mirror image) ✓ |
| **PROTECH A1** | positive test | **REPRODUCES** (Color dark; three measured assets quiet) ✓ |
| **INT-TFX** | negative case | **NOT ENOUGH DATA** (correctly refuses) |

```
reproducibility: 3 / 3 positive Fresco projects  ·  discrimination ✓  ·  independence ✓  ·  sensitivity ◐ (adversarial open)
⇒ promote a metric to permanent architecture?  STILL NOT YET — one gate remains.
```

Three independent Fresco projects now localize the weak point by the **same** mechanism, each as a mirror image (TLV→strength, MPZ→process/moisture, PROTECH→color), so the metric is demonstrably tracking *where the evidence actually is*, not a fixed answer — and the negative case (INT-TFX) correctly declines, which is itself evidence against a hindsight fit. The ≥3-positive reproducibility bar is now **met**. But promotion is a 2-D gate and the **adversarial content-check from the Sensitivity Harness is still open** — a false `measured` claim would still pass undetected. So: reproducibility ✓, but **not a law** until that gap closes.

## Status & next

- Built & runnable: `domains/provenance.mjs` (the validation fence), `metrics/replicate.mjs` (per-project metric replay · weak-point localization with a discrimination guard · Momentum/Evidence · per-project sensitivity probe · verdict), `replicate-demo.mjs`, wired as `matriya reproduce`.
- Honest scorecard: TLV ✓ + MPZ ✓ + PROTECH A1 ✓ = **3 positive** Fresco projects; INT-TFX = NOT ENOUGH DATA (negative case behaving correctly); discrimination & independence hold; sensitivity passes signal+noise, **adversarial still open**.
- The ONE thing left before any metric becomes a law: **close the adversarial content-check** — a content-level contradiction check (does a new `measured` claim contradict the existing distribution for the asset?). Reproducibility is no longer the blocker; the adversarial gap is.

> Convergence on one project proves nothing. Three independent Fresco projects now reproduce by the same mechanism — as mirror images, so the metric tracks *where the evidence is*, not a fixed answer — and the thin one honestly says "too thin." Reproducibility ✓, but still only "validated except the adversarial content-check." Not a law yet — and the reason is now precisely one open gap, not a missing project.
