# Are the metrics independent? — discrimination, compressibility, the 2-D gate

*Prepared 2026-06-29. A methodological pause before running more projects. Convergence on one project (Tel Aviv) is weak evidence — the mechanisms might all lean on the same base data, so they would converge whether or not they measure the same real thing. This adds the tests that actually separate "redundant" from "independent": a **negative control / discrimination** test, a **Mechanism Independence Matrix**, a new metric — **Decision Compressibility** — and a **two-dimensional promotion gate**. Code in `mvp/knowledge-map/metrics/`, run `node validate-plan.mjs` or `matriya validate`.*

---

## The honest finding: two of the three "mechanisms" were the same metric

The Mechanism Independence Matrix (rank-agreement across business objectives):

```
                        agreement
Information ~ Gradient     1.00   → REDUNDANT (both are ΔEntropy/Cost — one witness, not two)
Business ~ Information     0.00   → INDEPENDENT (diverge across every objective)
Business ~ Gradient        0.00   → INDEPENDENT
```

So the earlier "three mechanisms converge" was **partly an illusion**: Information Potential and the entropy gradient are the *same formula*. The genuinely independent cross-check is **Business ⟂ Order**. Admitting this is the point of the test — convergence between redundant metrics proves nothing.

## Discrimination — do Business and Order diverge where they should?

```
global most-business-critical : FIRST_PULL_OFF (Adhesion)     ← customer-returns objective
global most-disordered (order): FIRST_SET_TIME (Set / Cure)   ← highest entropy
diverge across objectives: 3/3   ⇒ PASS
```

Globally the two independent mechanisms pick **different** actions — they discriminate; they are not the same metric. (On the *TLV-restricted* question they converged, because Adhesion is TLV's weak asset — convergence where there is a reason, divergence where there is a reason. Exactly the pattern that makes convergence meaningful.)

---

## New metric — Decision Compressibility

> `Compressibility = Minimum Evidence Set / Total Evidence` — how *few* pieces actually explain a decision.

Low ratio = a few key pieces reconstruct the logic = deep understanding. `null` = cannot be explained from evidence at all (a leak, not "needs many").

```
decision                     total  minimal  ratio
reject cracking pilot          4      1     0.25
drop vermiculite               8      2     0.25
invent the pre-mix             5      1     0.20
NHL 3.5→5.0 for strength       3      —     INCOMPRESSIBLE (no measurement exists)
supplier change                6      2     0.33
+1 kg TCO wetting fix           5      2     0.40
approve to bag                12      —     INCOMPRESSIBLE
avg (explainable) 0.29 · incompressible: the two STRENGTH decisions
```

Compressibility separates *understood* from *unexplainable* with surgical precision: TLV's **adhesion** logic is deeply understood (≈0.29 — a couple of observations explain each call), but the **load-bearing** claims (D4, D7) are **incompressible** because the strength was never measured. Deeper than entropy: it measures *explanatory power*, not just order.

### Innovation — the Understanding Curve

Compressibility along the timeline; its slope is the **rate of true understanding**:
```
2022-04:0.25 → 05:0.25 → 06:0.20 → 10:0.33 → 12:0.40   slope +0.038
⇒ understanding NOT deepening (later decisions need MORE evidence; the latest are incompressible)
```
A falling curve = the lab is converging on insight; this flat/rising one says TLV accumulated data without deepening understanding *on the strength axis* — a precise, uncomfortable, honest read.

---

## The two-dimensional promotion gate

A metric earns a place in the architecture only if it passes **both**:

| Test | Purpose | Status |
|------|---------|--------|
| ≥3 positive projects converge where expected | **reproducibility** | ✗ (1 of 3) |
| ≥1 negative control where they diverge | **discrimination** | ✓ |

```
reproducibility ✗ × discrimination ✓  →  promote? NOT YET — need 2 more positive projects.
```

Discrimination already passes (Business ⟂ Order diverge appropriately). Reproducibility needs INT-TFX and MPZ. No metric is promoted to permanent architecture on Tel Aviv alone.

---

## The validation plan (ordered)

1. Replicate the metrics on **INT-TFX**.
2. Replicate on **MPZ**.
3. The **negative control** — done (discrimination PASS; Business ⟂ Order diverge).
4. **Decision Compressibility** on all three.

If all four hold, there is a strong empirical basis that the metrics describe real properties of the *research process*, not one lucky case.

## Status & next

- Built & runnable: `discrimination.mjs` (independence matrix · negative control · 2-D gate), `compressibility.mjs` (compressibility · understanding curve), `validate-plan.mjs`; folded into `matriya validate`.
- Honest scorecard so far: Information ≈ Gradient redundant; **Business ⟂ Order independent and discriminating**; Traceability + Compressibility both useful diagnostics that localize TLV's one real gap (unmeasured strength); phase-transition unconfirmable on one project; promotion gate NOT YET (2 projects short).

> Convergence is not evidence unless the converging mechanisms are independent. Once tested, the real independent pair (Business ⟂ Order) both discriminates and agrees for the right reasons — and Compressibility adds a sharper axis: how much of the understanding can actually be explained. Still measured hypotheses, not laws.
