# Knowledge Flow Rate — the metabolism of the lab

*Prepared 2026-06-29. One more metric, derived from everything already built. The funnel measures where knowledge sits; Flow Rate measures how much knowledge **moves**, where it pools, and where it is stuck. It is the lab's metabolic rate. Code: `research-os/flow-rate.mjs`. Run: `matriya research` (section [6]).*

---

## What it measures

```
Evidence → Review → Accepted → Episode → Knowledge → Decision
```

From the layers already in place, with no new data invented:

```
WIP        Episode:2 · Knowledge:2 · Decision:5      (where units sit now)
hold rate  0.85                                       (share routed to Review vs ACCEPT)
dwell      Drive fire batch stuck 3 days at Review    (oldest unit, time waiting)
conversion hypotheses→knowledge 0/2                   (all still UNVALIDATED)
questions  7 opened                                   (from the research agenda)
⇒ flow is REVIEW-bound: 4 fire episodes have waited 3 days at the Human-Review wall;
  nothing past it has metabolized (0 → knowledge, 0 → law).
```

The reading is the point: the lab is **review-bound** right now — real evidence arrived, it is sound and recognized, and it is waiting on a human. That is a healthy bottleneck (the wall is supposed to hold), but Flow Rate makes it *visible* and *measurable* instead of invisible.

## Honesty about time

WIP, dwell, hold rate and conversion are computable from a single snapshot. The **true rates** — average days from evidence to acceptance, throughput per day, the ratio of questions opened vs closed — are time derivatives. They need an append-only **flow log** that accrues as the live pipeline records each stage transition. Until it has ≥2 timepoints those fields return `null` with a clear note, rather than a fabricated number. `FLOW_LOG` is seeded with the one transition actually known (the fire batch received 2026-06-26, now in Review).

So Flow Rate degrades gracefully: it tells the truth today (where things pool, what's stuck) and gets richer — cycle times, metabolic rate per day, open-vs-close velocity — the moment the system runs over time.

## Why it matters at Fresco

Knowledge freshness becomes a *scientific variable*, not an afterthought: standards change, suppliers change, formulations change, test methods change. A metabolism view answers the questions a lab actually lives by — *is evidence converting to knowledge, or piling up at review? are we opening questions faster than we close them? how long until a measurement becomes a decision?*

## The bigger arc

This is where the system has travelled:

```
then:   Documents → Search → Answer
now:    Reality → Evidence → Qualification → Representation → Human Review
        → Episode → Knowledge → Research State → Research Agenda → (Flow Rate over all of it)
```

MATRIYA is no longer a system that answers questions from documents. It is a system that **records, audits and manages how knowledge develops over time** — what it knows, what it rests on, what limits it, what is still missing, and how fast it is moving. That is a more fundamental capability than any single search algorithm or LLM.

## Status & next

- Built & runnable: `research-os/flow-rate.mjs` (`knowledgeFlowRate` · `FLOW_LOG`), surfaced as section [6] of `matriya research`. Snapshot metrics live now; per-day rates accrue once the live pipeline logs transitions.
- Governance intact: it measures and reads — it never acts, never approves, never moves a unit itself. The human metabolizes the knowledge; the OS reports the rate.
