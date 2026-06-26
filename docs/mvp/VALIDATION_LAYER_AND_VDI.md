# The Validation Layer (V) and the Validated Discovery Index (VDI)

*Prepared 2026-06-26. The project's question changed — from "how do we build a system that discovers knowledge?" to "how do we **prove** a system discovered knowledge?" These are different disciplines. This note promotes **Validation** to a first-class layer above `K→C→B→N→L`, defines the ladder and the KPI rigorously enough that they cannot become vanity metrics, and states the honest current score. The ladder/VDI are implemented and runnable in `mvp/validation/validation-ladder.mjs`.*

## V — a new layer above FSCTM

```
K → C → B → N → L → V
```

`K→C→B→N→L` *produces* a law. **V does not produce a law — it tries to refute one.** A law that reaches `L` (a successor was born) is only a **candidate discovery**; it must survive a deliberate, pre-registered attempt to show it is an artifact. This layer was absent from the original FSCTM, and it is the methodological core that guards against the hardest problem in computational science: **false discovery**. Benchmark 0, the null controls, and pre-registration are not QA — they are V.

## The ladder (with criteria precise enough to be falsifiable)

| Rung | Goal | Pass criterion |
|---|---|---|
| **V0** | Synthetic sanity | false positives controlled at operating noise **and** planted boundary rediscovered **and** beats permutation null — on synthetic data only |
| **V1** | Rediscovery of a held-out boundary on **real** data | ≥2 independent real projects: correct feature + threshold within tolerance, permutation `p < 0.05`, boundary **pre-registered as held-out** before the run |
| **V2** | Independent projects, **frozen** protocol | ≥5 projects under **one** parameter set (no per-project tuning), with **family-wise** false-discovery control across the set |
| **V3** | Blind evaluation | the operator running the engine does **not** know the boundary location (sealed by a third party) — removes experimenter bias |
| **V4** | **Prospective** prediction | predict a boundary in an **uncharacterised** region *before the experiment exists*; a **new** experiment confirms it. This is discovery, not retrodiction |
| **V5** | External replication | replicate on data **not produced by Fresco** (pragmatic substitute: a strict unseen site/time hold-out) |

Only after **V4** may one say, carefully: *"there is evidence this system can produce scientific discoveries."* V1–V3 are necessary but retrospective; V4 is the first rung that is genuinely discovery.

## The KPI shift — from Modules to Validated Discoveries

The project has been implicitly measured by modules, endpoints, laws stored. **Wrong KPI.** The primary metric becomes:

> **VDI — Validated Discovery Index:** the number of distinct boundaries/laws at level **V4 or above.**

But a raw count is gameable and misleading, so VDI is defined with three guards baked into the implementation:

1. **Computed, never asserted.** VDI is derived from an append-only ledger of rungs, each rung carrying its evidence; monotonicity is enforced (no rung counts if a lower one is unpassed). You cannot type "VDI = 17."
2. **Always reported with its denominator.** VDI without `attempts` (including **failures**) is a file-drawer illusion. The ledger records misses on purpose; the program's credibility is the *ratio and pre-registration*, not the numerator. A reported VDI must come with `attempts`, `failures`, and the `pre-registration ratio`.
3. **Anti-gaming by construction.** Counting only **V4+** (prospective) makes trivial, retrodicted, or cherry-picked boundaries worthless toward the score; difficulty/novelty should weight it further so dramatic-but-obvious boundaries don't inflate it.

## Where the proposed ladder needed sharpening (challenging the framing)

- **"Validated" ≠ "true."** VDI counts claims that *survived falsification to level X*, not truths. Keep the language disciplined or the metric over-promises.
- **A number needs a denominator.** "VDI = 17" alone is a vanity metric and invites p-hacking across many projects. Hence the append-only ledger with failures and the mandatory denominator.
- **VDI is itself gameable.** Without the V4-only rule and novelty weighting, one inflates it with obvious boundaries. The hardest rung must be the one that counts.
- **V5 collides with the moat.** What makes the data defensible (proprietary, vertical) makes *external* replication hard. The honest substitute is a strict temporal/site hold-out the model never saw; true external replication stays aspirational, not a gate that can never be met.
- **Stopping rule.** Agreed — do not advance on 2 projects. The ladder *is* the stopping rule: each rung is a gate, and capability work (confounder control, multivariate, nonlinear) is unlocked by passing rungs, not by adding features.

## The honest current score

Running `node mvp/validation/validation-ladder.mjs` today:

```
VDI (discoveries at V4+):  0
attempts (denominator):    2   failures: 1   pre-registration ratio: 1.0
reached at least:          V0:1  V1:0  V2:0  V3:0  V4:0  V5:0
```

**VDI = 0.** Only the *instrument* is sanity-checked (V0, on synthetic data); every real-data rung is pending, and one pilot attempt is already logged as a **failure** (it did not beat its permutation null). This is the correct, honest baseline — and it is the whole point: by the metric that matters, a system with many modules and endpoints has **zero validated discoveries** until it climbs the ladder on real data.

## What this changes operationally

- The next milestone is not "Feature M9." It is **raising VDI from 0 to 1** — i.e. clearing V1 on ≥2 real Fresco projects, pre-registered, beating their nulls.
- Capability investment (confounders → multivariate → nonlinear) is gated behind rungs, not calendar.
- Progress is reported as `VDI (attempts, failures, pre-reg ratio)`, never as a bare number.

> Bottom line: MATRIYA's documents describe the goal as *not building another AI system, but a system that can be shown — empirically and on the record — to discover new knowledge and survive systematic attempts to refute it.* The V layer and VDI are that goal made measurable. Today VDI = 0, and saying so plainly is the first act of the discipline.
