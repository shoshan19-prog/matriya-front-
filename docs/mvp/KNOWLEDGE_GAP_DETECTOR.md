# Knowledge Gap Detector — MVP #2 (the core MATRIYA was missing)

*Prepared 2026-06-26. A response to a sharp and correct critique: the Judgment Engine measures **the expert**, not **the birth of a law**, and so it cannot be MATRIYA's core. This note concedes that, sharpens one point in the critique, and then **builds** the proposed core as runnable code. Engine in `mvp/knowledge-gap/`, runs with `node demo.mjs`, zero dependencies. Output reproduced below.*

---

## Where the critique is right (and I was off-center)

The previous MVP — the Judgment Engine — answers *"was this decision correct, and was the expert honest?"* That is real and valuable, but it is **evidence about people**, not **knowledge creation**. Tested against MATRIYA's own purpose (K→C→B→N→L: surface a *new* direction **only after** a proven *breakdown* of what was known), the verdict is exactly as you put it:

- Delete the Judgment Engine — would MATRIYA stop discovering laws? **No.**
- Keep only the Judgment Engine — would it discover laws? **No.**

So it is a **support layer (Evidence), not the core.** Conceded without hedging. The core has to answer a different question: *where does our current knowledge stop explaining reality, and what is the smallest experiment that would extend it?*

## The one place I'd sharpen your framing

You called the missing piece a *Knowledge Gap Detector*. Correct — but a detector is **downstream** of a representation that MATRIYA does not yet have. Today MATRIYA represents *documents* (RAG) and *stage-state* (the Kernel). It does **not** represent a **Law** as a first-class object: *a relationship + its domain of validity + the evidence for and against it.* You cannot detect that a mechanism "no longer explains" the data unless the mechanism is an explicit, checkable object.

So the true core is not "a detector" bolted on — it is a **change of atomic unit**: from the *experiment* (what happened) and the *judgment* (what a human decided) to the **Law-with-domain** (what we currently believe, and where). The detector is then just the engine that *evolves* those laws. This MVP therefore makes the **Law a first-class object** and builds the evolution loop around it.

> **Atomic unit of knowledge creation:** the **Law** (relationship + domain of validity). **Dynamic unit:** the **breakdown event** — the moment a law's residuals stop looking like noise and start looking like a boundary.

## The mechanism, mapped to K → C → B → N → L

The hard, honest part of this whole idea is **distinguishing a breakdown from noise** — otherwise you "discover" laws that are sampling artifacts (false discovery is the failure mode that kills automated science). The engine encodes that discipline explicitly:

| Stage | Mechanism in the engine |
|---|---|
| **K — Known** | Establish the law on its **largest self-consistent region** (a RANSAC-style fit), *not* a global fit. A global fit smears two regimes into one bad line and hides the boundary — the bug I hit on the first run and fixed. The inlier set **is** the law's domain of validity. |
| **C — Check** | Score **every** experiment against the law: `residual = actual − predicted`; explained iff `|residual| ≤ tol`, where `tol` comes from the *inlier* noise, not the whole mess. |
| **B — Breakdown** | A failure counts as a breakdown only if it is **structured**: split residuals on each feature; a split is a boundary iff the **low side stays explained (≥80%)** AND the **high side is sign-consistent (≥80%)** AND the bias **exceeds 3σ of noise**. Random scatter and lone anomalies fail all three — that is the guard against false discovery. |
| **N — New** | Only *after* a proven breakdown does the engine propose direction: it names the **single smallest deciding experiment** — placed in the unexplored gap straddling the boundary, at the input where the old law and the breakdown region disagree most (maximum information gain). |
| **L — Limit** | (next step) the deciding experiment's result either confirms the new boundary and births a bounded new law, or refutes it. |

Note this is the **same shape** as MATRIYA's existing integrity engine (which flags *unjustified drift*), generalized from "a few metric rules" to "a law's residual field." The core was half-present already; it was just pointed at metrics, not mechanisms.

## The Fresco case it discovers (worked, reproducible)

Hidden truth the engine is **not** told: a flame-retardant additive `APP%` raises time-to-failure `TTF` — **until** humidity crosses ~80%, where the additive hydrolyses and protection **collapses** (TTF flattens, independent of APP). There is **no data** between humidity 74 and 84 — the boundary is unexplored.

```
$ cd mvp/knowledge-gap && node demo.mjs

=== K — known law, established on its largest self-consistent region ===
  ttf_days ≈ 0.87·app_pct + 8.8    (domain: 24 consistent experiments; tolerance ±2.1 days, noise σ≈1.0)

=== C — check vs evidence ===
  ✓ explained:   24/37
  ✗ unexplained: 13/37

=== B — structured breakdown (not noise)? ===
  🔥 BREAKDOWN at  humidity_pct ≥ 79
     the law over-predicts (actual lower than law); bias 23.7 days, sign-consistency 100%
     failing experiments in region: E25 … E36

=== ⚠ contradictions (near-identical conditions, divergent outcome) ===
  ⚠ E12 vs E_anom differ by 24.5 days at app_pct≈40, humidity_pct≈58

=== N — the single smallest deciding experiment ===
  🧪 run:  humidity_pct=79, app_pct=40
     why: Unexplored gap in humidity_pct ∈ (74, 84). At app_pct=40 the known law predicts
          ttf_days≈44 while the breakdown region averages ≈12 — maximal disagreement.
```

What this demonstrates concretely:
- It **discovered the boundary on its own** (≈79; the true collapse is at 80, inside the empty 74–84 gap) — from evidence, not from being told.
- It **separated** the structured breakdown (12 humid experiments, 100% consistent) from the **one genuine contradiction** (`E_anom` — same conditions, wildly different TTF: a measurement/hidden-variable flag, *not* a boundary). Confusing those two is the classic error; the engine doesn't.
- It named the **one experiment** that resolves the gap, with an information-gain rationale — not a dashboard of 50 follow-ups.

## How the Judgment Engine now fits (demoted, not discarded)

The Judgment Engine becomes an **Evidence/prior feeder** to this core, in two concrete ways:
1. **Expert predictions are priors on laws.** "I predict TTF rises with APP" is a candidate law with a confidence; the detector tests it against evidence.
2. **Systematic expert miscalibration is itself a breakdown signal.** If an expert's judgments in a region go from well-calibrated to consistently wrong, that *region* is where their mental model is breaking — a human-sourced pointer to a knowledge gap.

So nothing built is wasted — but the center of the system moves from *"track decisions"* to *"evolve laws."*

## Brutal honesty: limits of this MVP

- **Linear, single-output, low-dimensional.** Real mechanisms are nonlinear and multivariate; the RANSAC-line is a stand-in for "a checkable model with a domain." The *architecture* (law-as-object, residual-structure test, VoI experiment) generalizes; the *fit* must be swapped for real models.
- **Correlation, not causation.** A discovered "boundary" can be a **confounder** (APP and humidity may co-vary; the real driver could be a third variable). Production needs confounder control before a breakdown is trusted as a mechanism. The MVP flags boundaries; it does not prove causes.
- **Data density gates honesty.** Breakdown detection needs enough experiments on both sides of a candidate boundary. Sparse data → either missed boundaries or false ones. The 3σ / consistency guards reduce false discovery but cannot eliminate it; the right answer to "not enough data" is *the deciding experiment*, which the engine already emits.
- **It still needs the law to exist.** The engine refits a law each pass; a real system must **persist** laws, their domains, their breakdown history, and their successors — i.e. the Law graph is the actual product, and that persistence layer is the next build.

> **Bottom line.** You're right that the Judgment Engine is not the core. The core is a **law-evolution engine**: represent what we know as checkable laws-with-domains, check them against all evidence, and treat a *structured* breakdown — never noise, never a lone anomaly — as the only license to propose something new, accompanied by the single experiment that would settle it. That is "how new knowledge is born," made mechanical and reproducible — which is the original MATRIYA vision, not a knowledge *manager* but a knowledge *creator*.
