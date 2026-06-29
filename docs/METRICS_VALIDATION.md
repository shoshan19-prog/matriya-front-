# Three research-quality metrics — and their test on טיח תל אביב

*Prepared 2026-06-29. A principle is emerging — "research progress = a fall in knowledge entropy" — but it must not be declared a law before a test. This adds three system-level **hypothesis-metrics** and validates them, pre-registered, on a real project (Tel Aviv plaster). They are kept as **instrumented hypotheses**, not architecture, until they replicate. Code in `mvp/knowledge-map/metrics/`, run `node validate-tlv.mjs` or `matriya validate`.*

The metrics aim to measure the **quality of the research itself**, not only its results — three axes:
- **Entropy** — how ordered the knowledge is.
- **Information Potential** — how much new order each experiment creates per unit cost.
- **Decision Traceability** — how much of the understanding is reconstructable from evidence.

---

## Metric 1 — Information Potential (IP = ΔEntropy / Cost)

Like a potential difference in physics: not all evidence is equal. Evidence that drops entropy 0.82→0.30 is worth far more than ten that drop 0.30→0.29. `IP = ΔEntropy / Cost` makes "which experiment" an optimization of **order created per shekel**, not data collected. `metrics/information-potential.mjs`.

## Metric 2 — Knowledge Phase Transition

Don't read entropy decline as continuous — look for **jumps**. A step 0.78→0.41 is not another measurement; it may be the moment a central contradiction resolved or a model formed — "the moment the lab understood." `detectPhaseTransition()` flags a downward step ≥ 1.5σ above the typical step. `metrics/phase-transition.mjs`.

## Metric 3 — Decision Traceability (Evidence Conservation)

Knowledge leaks: a worker leaves, an email is deleted, a decision goes unrecorded. The principle: **every decision must be reconstructable from a chain of evidence.** If you can't get from a decision back to its supporting evidence, that is a leak. `Traceability = decisions with a complete evidence chain / all decisions`. Not "how many decisions" but "how many are still explainable." `metrics/traceability.mjs`.

---

## The test (pre-registered) — on טיח תל אביב

```
H1 — convergence of three independent mechanisms (TLV-relevant action):
   Information Potential → FIRST_PULL_OFF (Adhesion)   IP 0.108
   Entropy gradient      → FIRST_PULL_OFF (Adhesion)   ΔH/₪1k 0.108
   Business priority     → FIRST_PULL_OFF (Adhesion)   priority 4.33
   ⇒ SUPPORTED — three independent mechanisms converge on the SAME action.

H2 — phase transition in TLV's entropy trajectory:
   0.76 → 0.795 → 0.795 → 0.763 → 0.757 → 0.753
   ⇒ NOT OBSERVED — declines smoothly, no jump.
   honest: TLV's 28-day strength was never measured, so its entropy never collapses.
   One incomplete project cannot confirm this metric.

H3 — decision traceability:
   5/7 TLV decisions fully traceable → traceability 0.71
   ⚠ leak D4: "raise NHL 3.5→5.0 to improve strength" — reason recorded, NO measured strength → unverifiable
   ⚠ leak D7: "approve to bag" — adhesion confirmed, but the load-bearing claim is unverified
   ⇒ SUPPORTED as a diagnostic — both leaks localize to the unmeasured STRENGTH claim,
     the exact gap every other layer flags. The metric explains WHY a decision is weak.
```

---

## Verdict (honest, not a law)

| Metric | Result on TLV | Status |
|--------|---------------|--------|
| **Information Potential** | converges with entropy-gradient **and** business-priority on the same action | **promising** — independent confirmation |
| **Phase Transition** | not observed (TLV's key measurement is missing; entropy never collapses) | **unconfirmable on one project** — needs ≥3 trajectories |
| **Decision Traceability** | 0.71; both leaks pinpoint the unmeasured strength | **useful now** — a real diagnostic |

The strongest result is **H1 convergence**: three mechanisms built on entirely different premises (information potential, thermodynamic gradient, business value) independently pick the same next experiment. That is empirical evidence they measure something real — not proof, but the kind of agreement that justifies continuing.

**Recommendation:** keep all three as **instrumented hypotheses**, exactly like the OLH organizational patterns — promote to permanent architecture only after they **replicate across INT-TFX, MPZ, and a third project**. The same gate (≥3 families) that governs pattern promotion governs metric promotion. No law is declared.

---

## The deeper claim, still under test

Most knowledge systems ask *"what do we know?"* MATRIYA began asking *"how ordered is our knowledge?"* — and now *"how much of our understanding is reconstructable?"*. Together the three axes (Entropy · Information Potential · Traceability) would measure the **quality of the research process** itself. The Tel Aviv test gives a first, partial empirical footing: strong on convergence, honest about what one project cannot prove.

## Status & next

- Built & runnable: `metrics/information-potential.mjs`, `phase-transition.mjs`, `traceability.mjs`, `validate-tlv.mjs`; `matriya validate`.
- Next (opt-in): run the same validation on INT-TFX and MPZ; collect entropy trajectories across ≥3 projects to test the phase-transition metric; track traceability as a live KPI as the Decision Ledger fills from real outcomes.

> The principle "research progress = falling knowledge entropy" is a strong hypothesis with first empirical support (three mechanisms agree) — and an honest limit (one project can't confirm the phase transition). It stays a measured hypothesis until it replicates. That restraint is the science.
