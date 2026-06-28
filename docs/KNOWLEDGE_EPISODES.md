# Knowledge Episodes — MATRIYA's true unit of knowledge

*Prepared 2026-06-26. The leap that separates MATRIYA from every other RAG system: stop indexing **files**, start indexing **decision cycles**. The unit is the **Knowledge Episode** — what an engineer actually remembers ("the experiment where we swapped the binder because APP collapsed at high temp"), not "Compression_2023_v4.xlsx". Code in `mvp/episodes/`, runs with `node demo.mjs`.*

```
Collector → Identity → Episode Builder → (Decision Memory · Dead-End Memory · Causal Threads) → PROTEUS
```

## The unit

```
Knowledge Episode
  Question → Hypothesis → Experiment → Results → Decision → Why → Next Action
```

Many files belong to ONE episode, unified by the **identity anchor** (experiment / version / batch) from the Knowledge Identity Engine. From `node mvp/episodes/demo.mjs`:

```
■ EP-248  [טיח תל אביב v043]  — unifies 3 files: xlsx, jpg
  Question    : איך להגדיל חוזק לחיצה?
  Hypothesis  : להגדיל Microsilica
  Experiment  : v043
  Results     : 34MPa(Compression_Test.xlsx), 4200cps(Brookfield.xlsx), 50µm(SEM.jpg)
  Decision    : REJECTED (confidence 0.9)
  Why         : ירידה בעבידות
  Next action : להעלות Superplasticizer
```

`Compression.xlsx + Brookfield.xlsx + SEM.jpg` are **the same experiment**, not three orphan files. That is the core move.

## Decision Memory (closes every episode)

```
Decision → Reason → Evidence → Confidence
```

The knowledge most missing after a few years — *why we chose, why we rejected, what was measured, what was missing.* Each episode records `{outcome, reason, evidence[], confidence}`; confidence is higher when a **reason** is on record (0.9) than when only an outcome is (0.7) — so an unexplained decision is visibly weaker.

## Innovation A — Dead-End Memory (negative knowledge)

The most valuable, most-forgotten knowledge is what was **already tried and failed**. `deadends.mjs` indexes every rejected episode by `tried → failed_because`, and `checkDeadEnd()` lets PROTEUS warn **before** repeating it:

```
proposing "בוא ננסה להגדיל Microsilica לשיפור חוזק":
  ⚠ ALREADY TRIED & FAILED: EP-248 (ירידה בעבידות)
```

This kills the #1 silent waste in R&D — re-running a known dead end.

## Innovation B — Causal Threads (decision lineage)

Episodes aren't isolated: one episode's **Next Action** becomes the next's **Hypothesis**. `threads.mjs` links them (by next-action↔hypothesis overlap, or version succession) into a trajectory:

```
EP-248 → EP-249   via version v043→v044
THREAD: EP-248 → EP-249   (the story of how the formula evolved)
```

PROTEUS can traverse "the decision lineage that led to the current production render," instead of staring at isolated files.

## How PROTEUS & Router change

- **PROTEUS searches Episodes, not Documents:** *"find all episodes that tried to raise strength via granulometry"* — across טיח תל אביב, INT-TFX, שפכטל, primer alike, because the unit is the *question/decision*, not the product.
- **Router becomes:** `Question → Relevant Episodes → Missing Knowledge → External Knowledge → Recommendation` (and Dead-End Memory gates the recommendation).

## Honest caveats

- **Extraction is heuristic here** (keyword/regex for question/hypothesis/decision/results). Real episodes need proper content extraction + an LLM pass; the **structure** is the deliverable, not the parser.
- **Decision/episode confidence must be calibrated** too — same discipline as the Identity Calibration harness. An "accepted, confidence 0.7" with no recorded reason should route to a human to capture the *why*.
- **Episode boundaries depend on identity quality** — if the Identity Engine mis-anchors, files land in the wrong episode. So episodes are only as trustworthy as the calibrated identity beneath them: **calibrate identity first, then build episodes on it.**

## Status & next

- Built & runnable: `episode.mjs` (builder + Decision Memory), `deadends.mjs` (A), `threads.mjs` (B), `demo.mjs`.
- Sits directly on the Knowledge Identity Engine (the anchor that unifies files).
- Next (opt-in): LLM-assisted field extraction; episode-confidence calibration; wire episodes as the retrieval unit for PROTEUS/Router; persist episodes into the Law/Evidence graph (each episode = a Validated-Judgment node).

> The unit of knowledge is the **decision episode**. MATRIYA stops being a system of documents or even a graph, and becomes the organized memory of how the lab actually decides.
