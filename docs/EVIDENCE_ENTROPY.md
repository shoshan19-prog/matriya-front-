# Evidence, Compression & Entropy — the deepest reframe

*Prepared 2026-06-29. One insight reorganizes MATRIYA: every source — SharePoint, Drive, Gmail, photos, lab reports — produces the same thing, **Evidence**. The Knowledge Event is not the first atom; **Evidence is**. From there, two more ideas follow: the system should **compress** its own memory, and it should measure not how much it knows but how **ordered** that knowledge is — its **entropy**. Code in `mvp/knowledge-map/evidence/`, runs with `node demo.mjs`; surfaced as `matriya entropy`.*

```
Evidence → Knowledge Events → Research Memory → Knowledge Compression
        → Context Graph → Knowledge Entropy → Decision → Law
```

---

## Idea 1 — the Evidence Atom

The smallest unit is not "Experiment Run" — it is one piece of evidence:

```
09:13  Rachel uploaded a photo.          → evidence (image)
09:15  an email arrived.                 → evidence (email)
09:20  Brookfield → 18,500 cP.           → evidence (measurement)
09:25  "the colour cracked."             → evidence (text/observation)
```

Every higher layer is assembled from atoms. On the real corpus: **158 evidence atoms → 37 Knowledge Events** (an event is an *aggregate* of evidence). The payoff: every adapter (SharePoint/Drive/Gmail/lab/photo) only needs to emit Evidence — the engine builds events, assets, and decisions from there. `evidence/evidence.mjs`.

## Idea 2 — Knowledge Compression

With millions of atoms, no human reads them. Periodically MATRIYA mines structure and emits a new **"Pattern Learned"** event — the originals are kept, a compressed node is born above them:

```
158 atoms → 9 Pattern Learned events (originals retained):
  ✦ "vermiculite" was negative in 100% of its appearances (2 cases)
  ✦ "thickeners" was negative in 60% of its appearances (5 cases)
  ✦ a FIRST measurement on an unmeasured asset raises confidence ~0.45 (n=40)
  ✦ 6 expected measurements are systematically ABSENT (a recurring blind spot)
9 patterns stand in for 42% of the atoms.
```

MATRIYA doesn't only remember — it **summarizes its own memory**. `evidence/compression.mjs`.

## Idea 3 — Knowledge Entropy

Everyone counts *how much* information exists. MATRIYA measures *how ordered* it is — 0 (connected, measured, contradictions resolved, questions closed) to 1 (scattered, unverified, contradictory, open):

```
asset                  confidence  entropy
Density                0.93        0.03   ← ordered
Compression            0.94        0.19
Workability            0.81        0.32
Adhesion               0.35        0.63
Set / Cure             0.15        0.69   ← chaotic

two projects, same kind of data:
  silicate-coatings family  entropy 0.25   (connected, measured, converged)
  INT-TFX (Stage-0)         entropy 0.61   (unknowns, unverified, open)
```

So the system can say not *"we lack information"* but **"we lack order."** `evidence/entropy.mjs`, `matriya entropy`.

---

## Three out-of-the-box additions

### A — Silence (negative evidence is information)
The *absence* of expected evidence is itself data — the dark matter that keeps entropy high.
```
6 expected measurements are systematically ABSENT.
  🔇 Adhesion 5 · Fire 4 · Set/Cure 3 · Water 2   (expected-but-missing)
```
This is the project's recurring finding made first-class: the systematically empty strength/pull-off fields are not nothing — they are *measured silence*.

### B — Evidence half-life (knowledge decays)
A 2018 viscosity reading on a since-changed formula is weaker than a fresh one. Entropy **rises with age** unless refreshed:
```
⏳ Adhesion   freshness 0.17  (stale-entropy +0.42)
⏳ Set/Cure   freshness 0.33  (stale-entropy +0.33)
```
The system can flag *"this asset's knowledge is going stale"* — a temporal dimension no document count captures.

### C — Entropy gradient (the research thermometer)
Which action **reduces entropy most per shekel** — PROTEUS's objective, reframed:
```
FIRST_SET_TIME   Set/Cure   ΔH 0.27 · gradient 0.45/₪1k   ← orders knowledge fastest
FIRST_PULL_OFF   Adhesion   ΔH 0.13 · gradient 0.108/₪1k
```
Striking convergence: the entropy gradient picks the **same** next action as the business-weighted priority engine — from a completely different (thermodynamic) angle. Two independent objectives agree, which is strong evidence the recommendation is real.

---

## The closing thought, made measurable

> Maybe the goal of MATRIYA is **not to "find laws" but to reduce the entropy of knowledge.**

At a project's start: scattered evidence, open questions, contradictory hypotheses — **high entropy**. As research progresses: connections strengthen, questions close — **entropy falls**. Measuring that fall objectively gives a research KPI deeper than "how many experiments / documents" — it says **how much the lab actually came to understand the problem**. `groupEntropy()` computes it per project; `entropyGradient()` says where to push next.

## Status & next

- Built & runnable: `evidence/evidence.mjs` (atom + events-from-evidence), `compression.mjs` (Pattern Learned), `entropy.mjs` (entropy + silence + half-life + gradient), `demo.mjs`; `matriya entropy`.
- Real numbers from the live corpus; ages/timestamps are acquisition-order proxies until real evidence timestamps flow in.
- Next (opt-in): make Evidence the literal ingest output of every adapter (SharePoint/Drive emit atoms); run compression on a schedule; track entropy over time as the headline research KPI; let PROTEUS optimize entropy-reduction-per-effort directly.

> Evidence is the atom. Compression is memory of memory. Entropy is the measure of understanding. The lab's progress is the fall of its knowledge entropy.
