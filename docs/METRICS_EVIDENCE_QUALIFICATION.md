# Evidence Qualification — three authorities decide a claim's fitness to become evidence

*Prepared 2026-06-29. The Provenance Fence answered "who may take part in validation" (only Fresco projects). The Sensitivity Harness then exposed the remaining hole: a claim with a **valid source but a false value** still moves the metric. This builds the second half of the fence — a check on the claim itself — **as a review gate, never an auto-reject**. It is not merely a "content check": it **qualifies** a claim, deciding its fitness to become evidence at all — the boundary between "what enters" and "what may affect the knowledge model". Code: `mvp/knowledge-map/metrics/evidence-qualification.mjs` + `intake.mjs`. Run: `matriya review`, `matriya intake`, or `node metrics/evidence-qualification-demo.mjs`.*

---

## Three filters, three authorities (not three checks)

The decisive idea: each filter speaks with a **different source of authority**, so the three are three *levels of knowledge*, and when they disagree the system can explain exactly why a claim was held.

| filter | the question | source of authority | level |
|--------|--------------|---------------------|-------|
| **Units** | is the claim *intelligible*? | the unit & type system | representation |
| **Baseline** | is it *anomalous* vs measured-so-far? | the Fresco corpus | local knowledge |
| **Physics** | is it *possible at all*? | general physical/chemical law | the world |

So `Water absorption = 130%` does not just emit `CONTRADICTS_EXISTING` — it can say: *"the claim is intelligible (units ✓); we have no history for this asset (baseline INSUFFICIENT); but it contradicts a physical law (physics VIOLATION)."* That three-authority reasoning is stronger than a bare verdict — and it is why the three results are **stored separately** (below).

## Two fences, two questions

```
Provenance Fence     = is the SOURCE allowed in?   origin: fresco · role: project
Evidence Qualification = is the CLAIM fit to enter?  units · baseline · physics
```

Both are required. A correct provenance with a bogus value still pollutes the metric — so after the source passes, the **claim** is qualified by the three authorities.

## The pipeline and the separated record

```
Measured Claim → Units → Baseline → Physics → (decision) → REVIEW
```

Each filter is a separate function (`checkUnits`, `checkBaseline`, `checkPhysics`), and **the three results are stored separately** in the record instead of collapsed into one verdict:

```json
{ "units": "PASS", "baseline": "INSUFFICIENT", "physics": "VIOLATION", "decision": "REVIEW" }
```

This is deliberate. Keeping the three apart means you can later analyse **why** claims go to review — how many from unit problems, how many from corpus anomalies, how many from physical contradictions — and improve each filter independently without touching the others. The batch summary does exactly that:

```
REVIEWs by authority:  units 1 · physics 5 · corpus-outlier 2 · corpus-insufficient 3
```

Each review is attributed to one **dominant** cause (precedence: physics > corpus-outlier > corpus-insufficient), so the counts partition cleanly. The decision is only ever `ACCEPT` or `REVIEW`; **`autoReject` is `false` on every record** — nothing is discarded automatically, a non-ACCEPT only ever routes to a human. The system recommends and flags; a person decides.

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

The adversarial test set (`matriya review` with no args) — the separated record per claim:

```
✓ {U:PASS          B:WITHIN       P:PASS}      → ACCEPT  real plausible (MPZ20)
✓ {U:PASS          B:OUTLIER      P:VIOLATION} → REVIEW  FALSE absurd strength
✓ {U:PASS          B:WITHIN       P:VIOLATION} → REVIEW  FALSE negative strength
✓ {U:PASS          B:OUTLIER      P:PASS}      → REVIEW  FALSE off-baseline (80 MPa)
✓ {U:PASS          B:WITHIN       P:PASS}      → ACCEPT  unit auto-normalized (kPa→MPa)
✓ {U:UNINTELLIGIBLE B:NA          P:NA}        → REVIEW  wrong dimension (g/cm³ as MPa)
✓ {U:PASS          B:OUTLIER      P:VIOLATION} → REVIEW  FALSE negative density
✓ {U:PASS          B:OUTLIER      P:PASS}      → REVIEW  implausible density (5 g/cm³)
✓ {U:PASS          B:INSUFFICIENT P:VIOLATION} → REVIEW  FALSE absorption 130%   ← physics beyond corpus
✓ {U:PASS          B:INSUFFICIENT P:PASS}      → REVIEW  absorption 8% (legal, no corpus)
✓ {U:PASS          B:OUTLIER      P:VIOLATION} → REVIEW  FALSE absurd ΔE (250)
✓ {U:PASS          B:INSUFFICIENT P:PASS}      → REVIEW  single-point baseline (Fire)
✓ {U:PASS          B:INSUFFICIENT P:NA}        → REVIEW  qualitative asset (Adhesion)

false claims all stopped (→ REVIEW): true · no auto-reject anywhere: true · 13/13
REVIEWs by authority: units 1 · physics 5 · corpus-outlier 2 · corpus-insufficient 3
physics caught beyond the corpus: 2  (absorption 130% and negative density)
```

Every false claim is routed to `REVIEW`, the no-auto-reject invariant holds across all thirteen cases, the per-authority counts partition the reviews, and the physics filter demonstrably catches two claims the corpus alone could not judge.

## Physics ≠ baseline — the filter that catches a wrong table

Material-class plausibility lives in the baseline fence; universal invariants live in `PHYSICS` (density `>0`, absorption `[0,100]%`, strength `≥0`, ΔE `≥0`). The decisive case is **Water absorption = 130%**: there is *no measured absorption baseline*, so the corpus filter alone returns `INSUFFICIENT` → "ask a human". But physics knows absorption can't exceed 100%, so the record is `{units:PASS, baseline:INSUFFICIENT, physics:VIOLATION}` → REVIEW with a strong, explainable flag. Without the independent physics authority, that claim would have slipped to "can't tell" instead of "this is impossible."

## The intake seam — qualification connected at the CLAIM point, not the document

`qualifyEvidence` is a validator of *claims* — so it is wired into the chain at exactly one place and nowhere else (`metrics/intake.mjs`):

```
Document → Evidence Extraction → Measured Claim → Evidence Qualification → REVIEW
                                                                             │
                                                  (human approves) ──────────┘
                                                           ↓
                                                Evidence → Event → ΔK
```

`matriya intake` runs a sample lab document (real strength rows + a 500-MPa typo + a 130% absorption row) through it:

```
document → 5 measured claims, routed to REVIEW queues:
  ACCEPT                2  Compression 23.83MPa · Density 1.41g/cm³
  REVIEW_OUTLIER        1  Compression 80MPa
  CONTRADICTS_EXISTING  2  Compression 500MPa · Water 130%
review cause by authority: units 0 · physics 2 · corpus-outlier 1 · corpus-insufficient 0
downstream: STOPPED at REVIEW.   auto-created events: 0
```

The seam is the point: each stage has one responsibility, and the chain **stops at REVIEW**. Evidence, Events and ΔK are reached only after a human approves a claim — so a REVIEW record is never silently promoted into a Knowledge Event. They are deliberately different objects at different layers (claim → qualification record → evidence → event → ΔK), and the seam keeps a `REVIEW_OUTLIER` and a `Knowledge Event` from ever being confused.

## Honest limits (kept explicit)

- **An in-range, physically-legal false value cannot be caught here.** If someone logs 15 MPa where the truth is 5, all three authorities pass and it is ACCEPTed as a *candidate* — which is *why* even ACCEPT still needs human sign-off to become evidence.
- **Qualitative claims have no numeric baseline or physics.** The Sensitivity Harness's original adversarial probe was a value-less "Adhesion measured" claim; for that path qualification returns `{baseline:INSUFFICIENT}` → human-review-only. The gap is closed for the **numeric** claims that move the quantitative metrics; the qualitative path is bounded, not magically solved.

## What this closes

The Sensitivity Harness adversarial verdict now reads **GUARDED** instead of **GAP**: a false numeric claim is intercepted before it reaches the metric. So the two-dimensional promotion gate's remaining blocker is resolved for numeric evidence:

```
reproducibility: 3/3 Fresco projects ✓   discrimination ✓   independence ✓
sensitivity: signal ✓ · noise ✓ · adversarial → GUARDED (numeric) / human-review (qualitative)
```

That removes the single open reason a metric was "not yet a law". Promotion is now a judgement call for the human, made on a metric set that has passed all four validation tests for the evidence type it governs — not blocked by a missing guard. Still framed honestly: Evidence Qualification **reviews and classifies uncertainty**, it does not certify truth; the lab does.

## Status & next

- Built & runnable: `metrics/evidence-qualification.mjs` (three authorities — `checkUnits` · `checkBaseline` · `checkPhysics`; `qualifyEvidence` returning the separated record + dominant cause; `qualificationStats`; adversarial test set), `metrics/intake.mjs` (the Document→Claim→Qualification→REVIEW seam), `evidence-qualification-demo.mjs`, wired as `matriya review` and `matriya intake`. Folded into the Sensitivity Harness verdict (`GUARDED`).
- The layer's identity, made explicit: this is **Evidence Qualification** — it determines a claim's quality and fitness *before* it can become evidence, the methodological boundary between "what enters" and "what may affect the knowledge model". Single responsibilities stay distinct: Provenance (source allowed?) · Qualification (claim fit?) · Human Review (claim accepted?) · Event engine (evidence → event?) · ΔK engine (event → knowledge change?).
- The three results are stored separately, so the next refinement is purely additive — improve any one authority (more physical laws, a richer corpus baseline, a stricter type system) without touching the others, and read off from `qualificationStats` which authority is doing the most work.

## Status & next

- Built & runnable: `metrics/content-check.mjs` (3 filters: `checkUnits` · `checkBaseline` · `checkPhysics`; `classifyClaim`; adversarial test set; gate summary), `metrics/intake.mjs` (the Document→Claim→Check→REVIEW seam), `content-check-demo.mjs`, wired as `matriya review` and `matriya intake`. Folded into the Sensitivity Harness verdict (`GUARDED`).
- Single responsibility kept clean: Provenance (source allowed?) · Content Check (claim consistent?) · Human Review (claim accepted?) · Event engine (evidence → event?) · ΔK engine (event → knowledge change?). A `REVIEW_OUTLIER` is not a Knowledge Event, and the intake seam enforces that (`auto-created events: 0`).
- Governance preserved: no auto-reject; every flag routes to human review; baselines are real corpus values; physics are universal laws; no proprietary recipes touched.
- This is the end-point the layer was aiming at: three filters (units → baseline → physics) that **classify uncertainty instead of hiding it**, feeding a human-review queue — consistent with the principle that decisions are made on evidence while the system only classifies and recommends. Connecting the real daily SharePoint pipeline into `intakeDocument` is now a one-wire change at the claim stage, when the live source is available.
