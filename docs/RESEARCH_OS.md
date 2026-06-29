# MATRIYA as a research operating system — Knowledge Resolution + 5 innovations

*Prepared 2026-06-29. The stack separated three things document systems blur together — the world, the description of the world, and its meaning. That turns MATRIYA from a knowledge store into a research operating system: every item travels one defined path (Reality → Evidence → Episode → Representation → Human Review → Knowledge → Decision → Validated Principle), so you can measure not just how much you know but **where it sits**. This adds the funnel — **Knowledge Resolution** — and five innovations on top. Code: `research-os/`. Run: `matriya research`.*

---

## Knowledge Resolution — the research funnel

Not "how much knowledge", but **at what stage is it resolved?**

```
Evidence            0
Episode             ████████              2
Knowledge           ████████              2
Decision            ████████████████████  5
Validated Principle                       0     ← the discipline holds: nothing auto-promoted
resolution index 0.58
latest batch "Drive fire tests": 4 entered → Representation → Human Review (PENDING) → 0 knowledge / 0 laws
```

The funnel measures the *position* of knowledge. The latest batch (the Drive fire tests) is tracked honestly: it entered, it sits at Representation/Review, and it has resolved to **nothing** yet — because a human hasn't approved it and the Fire schema isn't confirmed. A document store cannot say this; it only has a file count.

## The five innovations

**1 · Representation Coverage** — how much of *reality* the system can currently describe. `2/9 assets modeled (22%)`; the missing "museum wings" are named (`smokeToxicity`, `gloss/ΔE over hours`, `pull-off curve`). A number no RAG system has, because documents have no model to be measured against.

**2 · Knowledge Lineage & retraction propagation** — because the unit is an Episode, every claim traces to its episodes, and you can ask *"if this episode is wrong, what collapses?"*. `whatCollapsesIf(episode)` returns, per asset, `COLLAPSES (only measured support)` / `weakens` / `context only`. Surfaces the lab's **fragile** (single-episode load-bearing) knowledge to de-risk.

**3 · Knowledge Half-Life** — knowledge decays. Evidence on an old/reformulated product, or a result under a superseded standard, ages. Flags `aging` assets and **standard supersession** — e.g. the Drive fire knowledge rests on informal `DIN 4102-8` and expires as "validated" until the official `EN 13381-8:2013` exists. Time- and standard-aware, because episodes carry dates and standards.

**4 · Hypothesis Candidates** — the OS surfaces what to *investigate*, never what is true. From the episodes it spots co-variation and proposes a **testable, UNVALIDATED hypothesis** with the experiment that would confirm or kill it:
- `H-FIRE-DFT`: time-to-failure increases with DFT (mean 1000µm→82min, 2000µm→125min) — CANDIDATE, needs ≥3 DFT levels on ≥2 formulations.
- `H-MP10`: MP10 under-performs its grade even at 50d (5.11 < 10 MPa) — OPEN.
It never promotes these to laws.

**5 · Research Agenda** — the scheduler: it gathers everything unresolved (pending reviews, representation gaps, fragile knowledge, standard risks, open hypotheses) and prioritises one read-only list (`blocker · gap · risk · question`). It **recommends and keeps the list — it never acts, approves, or writes.**

## Why this is no longer RAG

The thing that distinguishes MATRIYA is not the LLM or the database — it is that every item follows one defined route:

```
1. Reality produces Evidence (a measured fact).
2. Evidence gains full experimental context → Episode.
3. The system checks it has a language to represent this kind of knowledge → Representation.
4. A human approves acceptance → Human Review.
5. Only then is meaning written into the model → Knowledge.
6. Later, with enough evidence, it may inform Decisions or support general Validated Principles.
```

That order is what lets the system grow for years without losing consistency: a new *kind* of knowledge must first earn a representation, and only then can it become part of what the system knows. The five innovations are all consequences of that structure — none of them is possible when the unit of memory is a PDF.

## Status & next

- Built & runnable: `research-os/funnel.mjs` (Knowledge Resolution), `representation-coverage.mjs`, `lineage.mjs`, `half-life.mjs`, `hypotheses.mjs`, `agenda.mjs` — wired as `matriya research`. All compute from the real corpus + the pending fire episodes; all honest about the PENDING state.
- Governance intact: recommends, measures, lists — never acts, never auto-promotes, never declares a law. Hypotheses are explicitly UNVALIDATED.
- Next, only on approval: the agenda's top blocker (approve the Fire schema + episodes) would move INT-TFX down the funnel toward Knowledge — through the same path, every time.
