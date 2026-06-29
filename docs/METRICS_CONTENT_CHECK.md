# Is the claim plausible? — the Content-Check REVIEW gate (closing the adversarial gap)

*Prepared 2026-06-29. The Provenance Fence answered "who may take part in validation" (only Fresco projects). The Sensitivity Harness then exposed the remaining hole: a claim with a **valid source but a false value** still moves the metric. This builds the second half of the fence — a content check on the claim itself — **as a review gate, never an auto-reject**. Code: `mvp/knowledge-map/metrics/content-check.mjs`. Run: `matriya review` or `node metrics/content-check-demo.mjs`.*

---

## Two fences, two questions

```
Provenance Fence = is the SOURCE allowed in?      origin: fresco · role: project
Content Check     = is the CLAIM itself plausible?  value vs the asset baseline
```

Both are required. A correct provenance with a bogus value still pollutes the metric — so after the source passes, the **value** is checked against what the asset already knows.

## Three filters, three jobs

```
Measured Claim
   → Units                 (kPa→MPa, kg/m³→g/cm³, … ; refuse cross-dimension)
   → Baseline              (statistically consistent with the measured corpus?)
   → Physical Constraints  (does it violate a known LAW of the asset?)
   → classify:
        ACCEPT                within range, physically legal
        REVIEW_OUTLIER        possible but far outside the baseline
        CONTRADICTS_EXISTING  violates a physical / logical law
        INSUFFICIENT_BASELINE too little baseline (or a qualitative asset) to judge
```

Each filter is a separate function with one responsibility (`checkUnits`, `checkBaseline`, `checkPhysics`). **Physics is independent of the baseline by design**: a value can sit inside a *wrong* table's range yet still be physically impossible, so the physics filter can stop a claim the baseline would have waved through (precedence: a physics violation outranks a baseline outlier, because impossibility is a stronger signal than unusualness).

**The hard rule, enforced in code:** every classification carries `autoReject: false`. Nothing is ever discarded automatically — a non-ACCEPT result only ever **routes to human review**. The system recommends and flags; a person decides.

## Physics ≠ baseline — the filter that catches a wrong table

Material-class plausibility lives in the baseline fence; universal invariants live in `PHYSICS`:

| asset | physical law | allowed |
|-------|--------------|---------|
| Compression Strength | strength ≥ 0, below the UHPC ceiling | [0, 250] MPa |
| Density | mass/volume strictly positive, ≤ osmium | [0.001, 22.6] g/cm³ |
| Color / Shade | ΔE ≥ 0, bounded in CIELAB | [0, 150] |
| Water Resistance / Moisture | absorption is a mass fraction | [0, 100] % |

The decisive case is **Water absorption = 130%**: there is *no measured absorption baseline* in the corpus, so the baseline filter alone returns `INSUFFICIENT_BASELINE` → human-review-only. But physics knows absorption can't exceed 100%, so the claim is caught as `CONTRADICTS_EXISTING` regardless. Same for `Density = −3 g/cm³`. The test set confirms the physics filter catches claims the baseline could not judge — without it, those would have slipped to "can't tell, ask a human" instead of "this is impossible."

## The baselines are the real corpus

Each numeric asset carries the measured values that actually appear in the reconstructions (the baseline filter), kept separate from the physical laws above. The outlier fence is robust (IQR-based: `[Q1−3·IQR, Q3+3·IQR]`), so a couple of extreme-but-real points don't widen it into uselessness. Fire deliberately has **one** point — to show the `INSUFFICIENT_BASELINE` class behaving correctly rather than guessing.

## The first test — the false claim must be stopped (13/13)

The adversarial test set (`matriya review` with no args), now with the physics column:

```
✓ [ACCEPT]               real plausible (MPZ20)        units:ok physics:ok       baseline:within
✓ [CONTRADICTS_EXISTING] FALSE absurd strength         units:ok physics:VIOLATION baseline:outlier
✓ [CONTRADICTS_EXISTING] FALSE negative strength       units:ok physics:VIOLATION baseline:within
✓ [REVIEW_OUTLIER]       FALSE off-baseline (80 MPa)   units:ok physics:ok       baseline:outlier
✓ [ACCEPT]               unit auto-normalized (kPa→MPa) units:ok physics:ok       baseline:within
✓ [REVIEW_OUTLIER]       wrong dimension (g/cm³ as MPa) units:FAIL
✓ [CONTRADICTS_EXISTING] FALSE negative density        units:ok physics:VIOLATION baseline:outlier
✓ [REVIEW_OUTLIER]       implausible density (5 g/cm³) units:ok physics:ok       baseline:outlier
✓ [CONTRADICTS_EXISTING] FALSE absorption 130%         units:ok physics:VIOLATION baseline:INSUFFICIENT  ← physics beyond baseline
✓ [INSUFFICIENT_BASELINE] absorption 8% (legal)        units:ok physics:ok       baseline:insufficient
✓ [CONTRADICTS_EXISTING] FALSE absurd ΔE (250)         units:ok physics:VIOLATION baseline:outlier
✓ [INSUFFICIENT_BASELINE] single-point baseline (Fire) units:ok physics:ok       baseline:insufficient
✓ [INSUFFICIENT_BASELINE] qualitative asset (Adhesion) units:ok physics:n/a      baseline:insufficient

false claims all stopped (≠ ACCEPT): true · no auto-reject anywhere: true · 13/13
physics caught beyond the baseline: 2  (absorption 130% and negative density)
```

Every false claim is caught as `REVIEW_OUTLIER` or `CONTRADICTS_EXISTING`, the no-auto-reject invariant holds across all thirteen cases, and the physics filter demonstrably catches two claims the baseline alone could not.

## The intake seam — content-check connected at the CLAIM point, not the document

`classifyClaim` is a validator of *claims* — so it is wired into the chain at exactly one place and nowhere else (`metrics/intake.mjs`):

```
Document → Evidence Extraction → Measured Claim → Content Check → REVIEW
                                                                    │
                                           (human approves) ────────┘
                                                    ↓
                                         Evidence → Event → ΔK
```

`matriya intake` runs a sample lab document (real strength rows + a 500-MPa typo + a 130% absorption row) through it:

```
document → 5 measured claims, routed to REVIEW queues:
  ACCEPT                2  Compression 23.83MPa · Density 1.41g/cm³
  REVIEW_OUTLIER        1  Compression 80MPa
  CONTRADICTS_EXISTING  2  Compression 500MPa · Water 130%
  INSUFFICIENT_BASELINE 0
downstream: STOPPED at REVIEW.   auto-created events: 0
```

The seam is the point: each stage has one responsibility, and the chain **stops at REVIEW**. Evidence, Events and ΔK are reached only after a human approves a claim — so a `REVIEW_OUTLIER` is never silently promoted into a Knowledge Event. They are deliberately different objects at different layers (claim → verdict → evidence → event → ΔK), and the seam keeps `REVIEW_OUTLIER` and `Knowledge Event` from ever being confused.

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

- Built & runnable: `metrics/content-check.mjs` (3 filters: `checkUnits` · `checkBaseline` · `checkPhysics`; `classifyClaim`; adversarial test set; gate summary), `metrics/intake.mjs` (the Document→Claim→Check→REVIEW seam), `content-check-demo.mjs`, wired as `matriya review` and `matriya intake`. Folded into the Sensitivity Harness verdict (`GUARDED`).
- Single responsibility kept clean: Provenance (source allowed?) · Content Check (claim consistent?) · Human Review (claim accepted?) · Event engine (evidence → event?) · ΔK engine (event → knowledge change?). A `REVIEW_OUTLIER` is not a Knowledge Event, and the intake seam enforces that (`auto-created events: 0`).
- Governance preserved: no auto-reject; every flag routes to human review; baselines are real corpus values; physics are universal laws; no proprietary recipes touched.
- This is the end-point the layer was aiming at: three filters (units → baseline → physics) that **classify uncertainty instead of hiding it**, feeding a human-review queue — consistent with the principle that decisions are made on evidence while the system only classifies and recommends. Connecting the real daily SharePoint pipeline into `intakeDocument` is now a one-wire change at the claim stage, when the live source is available.
