# Is the claim plausible? — the Content-Check REVIEW gate (closing the adversarial gap)

*Prepared 2026-06-29. The Provenance Fence answered "who may take part in validation" (only Fresco projects). The Sensitivity Harness then exposed the remaining hole: a claim with a **valid source but a false value** still moves the metric. This builds the second half of the fence — a content check on the claim itself — **as a review gate, never an auto-reject**. Code: `mvp/knowledge-map/metrics/content-check.mjs`. Run: `matriya review` or `node metrics/content-check-demo.mjs`.*

---

## Two fences, two questions

```
Provenance Fence = is the SOURCE allowed in?      origin: fresco · role: project
Content Check     = is the CLAIM itself plausible?  value vs the asset baseline
```

Both are required. A correct provenance with a bogus value still pollutes the metric — so after the source passes, the **value** is checked against what the asset already knows.

## The pipeline

```
measured_claim
  → normalize units        (kPa→MPa, kg/m³→g/cm³, … ; refuse cross-dimension)
  → compare to asset baseline (real measured values from the corpus)
  → classify:
       ACCEPT                within the established range
       REVIEW_OUTLIER        physically possible but far outside the baseline
       CONTRADICTS_EXISTING  violates a physical / logical bound
       INSUFFICIENT_BASELINE too little baseline (or a qualitative asset) to judge
```

**The hard rule, enforced in code:** every classification carries `autoReject: false`. Nothing is ever discarded automatically — a non-ACCEPT result only ever **routes to human review**. This is the same governance line MATRIYA holds everywhere: the system recommends and flags; a person decides.

## The baselines are the real corpus

Each numeric asset carries the measured values that actually appear in the reconstructions, plus the physical bounds for that material class:

| asset | unit | baseline (real values) | physical bound |
|-------|------|------------------------|----------------|
| Compression Strength | MPa | 1.0 … 36 (renders + treated/field cubes) | [0, 150] |
| Density | g/cm³ | 0.30 … 1.47 (SFRM → silicate coatings) | [0.02, 3.0] |
| Color / Shade | ΔE | 0.01 … 21.75 (ΔE / DE2000) | [0, 100] |
| Fire Resistance | °C | 5.1 (a single ISO-1182 ΔT) | [0, 1200] |

The outlier fence is robust (IQR-based: `[Q1−3·IQR, Q3+3·IQR]`), so a couple of extreme-but-real points don't widen it into uselessness. Fire deliberately has **one** point — to show the `INSUFFICIENT_BASELINE` class behaving correctly rather than guessing.

## The first test — the false claim must be stopped

The adversarial test set (`matriya review` with no args):

```
✓ [ACCEPT]               real plausible (Dec-2025 MPZ20)   23.83 MPa within [−45.5, 69.3]
✓ [CONTRADICTS_EXISTING] FALSE absurd strength            500 MPa violates [0, 150]
✓ [CONTRADICTS_EXISTING] FALSE negative strength          −5 MPa violates [0, 150]
✓ [REVIEW_OUTLIER]       FALSE in-bounds but off-baseline 80 MPa outside fence [−45.5, 69.3]
✓ [ACCEPT]               unit auto-normalized (kPa→MPa)   20000 kPa → 20 MPa, in range
✓ [REVIEW_OUTLIER]       wrong dimension (g/cm³ as MPa)   not commensurable → held
✓ [ACCEPT]               real plausible ΔE                1.2 ΔE in range
✓ [CONTRADICTS_EXISTING] FALSE absurd ΔE                  250 ΔE violates [0, 100]
✓ [INSUFFICIENT_BASELINE] single-point baseline (Fire)   1 point — cannot judge
✓ [INSUFFICIENT_BASELINE] qualitative asset (Adhesion)   no numeric baseline → human-only

false claims all stopped (≠ ACCEPT): true   ·   no auto-reject anywhere: true   ·   10/10
```

Every false claim is caught as `REVIEW_OUTLIER` or `CONTRADICTS_EXISTING` — exactly the requirement — and the no-auto-reject invariant holds across all ten cases.

## Honest limits (kept explicit)

- **An in-range false value cannot be caught here.** If someone logs 15 MPa where the truth is 5, it sits inside the baseline and passes. That is *why* the gate is REVIEW, not auto-accept — and why human approval of every intake stays in place.
- **Qualitative claims have no numeric baseline.** The Sensitivity Harness's original adversarial probe was a value-less "Adhesion measured" claim; for that path the content check returns `INSUFFICIENT_BASELINE` and it stays human-review-only. The gap is closed for the **numeric** claims that move the quantitative metrics; the qualitative path is bounded, not magically solved.

## What this closes

The Sensitivity Harness adversarial verdict now reads **GUARDED** instead of **GAP**: a false numeric claim is intercepted before it reaches the metric. So the two-dimensional promotion gate's remaining blocker is resolved for numeric evidence:

```
reproducibility: 3/3 Fresco projects ✓   discrimination ✓   independence ✓
sensitivity: signal ✓ · noise ✓ · adversarial → GUARDED (numeric) / human-review (qualitative)
```

That removes the single open reason a metric was "not yet a law". Promotion is now a judgement call for the human, made on a metric set that has passed all four validation tests for the evidence type it governs — not blocked by a missing guard. Still framed honestly: the content check **reviews**, it does not certify truth; the lab does.

## Status & next

- Built & runnable: `metrics/content-check.mjs` (normalize · baselines · classify · adversarial test set · gate summary), `content-check-demo.mjs`, wired as `matriya review`. Folded into the Sensitivity Harness verdict (`GUARDED`).
- Governance preserved: no auto-reject; every flag routes to human review; baselines are real corpus values; no proprietary recipes touched.
- Natural next step: route real intake (the daily SharePoint pipeline) through `classifyClaim` so every incoming measurement lands in an ACCEPT / REVIEW queue for the human, instead of being trusted on provenance alone.
