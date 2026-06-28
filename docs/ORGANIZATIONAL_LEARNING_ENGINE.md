# Organizational Learning Engine — meta-learning over Episodes

*Prepared 2026-06-28. The structure that has emerged is no longer "software engines" — it is a **model of how an organisation learns**. The Trust Engine learns *who knows what*. This layer learns the thing almost no R&D system captures: **how Fresco itself produces good knowledge** — the process patterns behind its decisions. Code in `mvp/knowledge-map/learning/`, runs with `node demo.mjs`.*

```
                    KNOWLEDGE OS

   Knowledge Sources → Collectors → Normalization → Identity Resolution
        → Knowledge Episodes → (Decision Memory · Evidence Graph)
            → MATRIYA            (What do we know?)
            → observe()
            → Knowledge Trust Engine   (Who usually knows what?)
            → Router                   (Where should we search next?)
            → PROTEUS                  (What knowledge is worth acquiring?)
            ╰──────────────► Organizational Learning Engine
                              (HOW does Fresco produce good knowledge?)
```

The new layer sits **above** Trust/Router/PROTEUS and feeds back into them: it does not ask *what happened* or *who knows*, it asks **how this organisation turns problems into validated knowledge** — and which process patterns lead to good decisions versus repeated failure.

---

## What it learns (process, not material)

Not insights about cement or lime — insights about the **innovation process**:

- the **canonical path** a change usually takes
  (`Field failure → Meeting → Supplier change → Lab trial → Compression test → Decision → Production`);
- how many **trials on average** until a formula is frozen;
- which **step-skips raise the re-trial probability** (e.g. *skip SEM → more repeats*);
- which **measurements almost always preceded success**;
- which **patterns recurred before failure**;
- which **combinations** beat either signal alone (e.g. *field feedback + lab result together → higher success*).

These become **PROTEUS meta-insights**:

> *"In similar past cases, a summary meeting was missing before moving to production."*
> *"Decisions that relied only on viscosity often ended in another trial."*
> *"When both field feedback and lab results were combined before a formula change, the success rate was higher."*

---

## The engine (`learning/`)

**`process.mjs`** — turns an Episode (+ its docs) into a set of **process STAGES**
(`FIELD_REPORT, MEETING, SUPPLIER_CHANGE, LAB_TRIAL, MEASURE_COMPRESSION, MEASURE_VISCOSITY, MEASURE_SEM, DECISION, PRODUCTION`) and an **outcome** (`accepted / rejected / retrial`). Every stage is asserted only from a marker actually present — built on Episodes + evidence, never on assumptions.

**`patterns.mjs`** — the miner:
1. `minePaths` — recurring stage paths + most-common transitions → the canonical route;
2. `stageOutcomeContrast` — does a step change the success rate? success-with vs success-without, lift, re-trial rates;
3. `pairContrast` — do two stages **together** beat either alone?
4. `trialsToFreeze` — cycles until a formula is frozen (mean/range);
5. `metaInsights` — natural-language insights, **gated by evidence**.

---

## The discipline: PATTERN vs HYPOTHESIS

A pattern is evidence **only when its support is high enough**. Below `MIN_SUPPORT` (4 cycles) an observation is an explicit **`HYPOTHESIS`**, not a finding. The engine will not turn a handful of cycles into a "law of how Fresco works".

`node mvp/knowledge-map/learning/demo.mjs` runs it twice, on purpose:

**A) Illustrative volume (clearly NOT corpus-derived)** — shows the engine actually mines:
```
✔ PATTERN (n=5)  when "MEASURE_SEM" precedes the decision: success 100% vs 22% (lift 4.50)
✔ PATTERN        skip SEM → re-trial 67% vs 0%
✔ PATTERN (n=...) FIELD_REPORT + MEASURE_COMPRESSION together → 100% vs 13% (lift 8.0)
✔ PATTERN (n=5)  trials-to-freeze: mean 5 (range 4–6)
✔ PATTERN (n=4)  canonical path: Field → Meeting → Supplier → Lab → Compression → Decision → Production
```

**B) The REAL טיח תל אביב episodes (only a handful)** — the engine refuses to over-claim:
```
EP-248: FIELD_REPORT → SUPPLIER_CHANGE → LAB_TRIAL → MEASURE_COMPRESSION → DECISION → PRODUCTION → accepted
EP-249: FIELD_REPORT → LAB_TRIAL → DECISION → rejected
…
… HYPOTHESIS (n=1)  …every process pattern stays a HYPOTHESIS below MIN_SUPPORT…
ⓘ The engine refuses to turn a handful of cycles into a law. THAT is the discipline.
```

That refusal is the feature. The volume comes from extracting more real Episodes; the engine is correct and honest from cycle one.

---

## Why this matters

PROTEUS's goal is not only to propose the next experiment — it is to understand **how this organisation generates quality knowledge**. Once these patterns are learned (on evidence, not assumptions), MATRIYA stops being a knowledge-management system and becomes a system that **characterises and improves the organisation's own learning process** — true Meta-Learning: not just *what Fresco knows*, but *how it comes to know it, and which patterns lead to good decisions*.

## Honest caveats & next

- **Volume, not method, is the gap.** The miner is evidence-gated today; it needs real Episode volume (dozens of decision cycles) before its patterns graduate from HYPOTHESIS to PATTERN. The illustrative set in the demo is labelled as such and is **not** corpus-derived.
- **Stage extraction is heuristic** (markers/units), same caveat as Episode field extraction — an LLM pass would sharpen it.
- **Correlation ≠ cause.** A contrast (SEM → success) is a signal to investigate, not proof; report support + lift and let a human judge.
- **Next (opt-in):** feed `metaInsights` back into the Router/PROTEUS so recommendations carry process warnings ("a summary meeting is usually missing here"); time-aware patterns (has the process changed over the years?); per-product vs cross-product process patterns.

> The Trust Engine answered *who knows what*. The Organizational Learning Engine answers *how Fresco learns* — and that is the layer that turns MATRIYA from a memory of the lab into a model of the lab's mind.
