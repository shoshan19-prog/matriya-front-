# Knowledge Strategy — PROTEUS becomes an R&D manager

*Prepared 2026-06-28. The most important result of acquisition iteration 1 was not "Granulometry exists" or "Set-Time is missing" — it was **structural**: Knowledge Acquisition splits into two completely different classes, and that splits PROTEUS's job from "acquire knowledge" into "manage the organization's knowledge strategy." This adds a new priority function `f(ΔK, Demand, Cost, Confidence-Gap)` and a new layer — Phase 5.6 Knowledge Demand. Code in `mvp/knowledge-map/strategy/`, runs with `node demo.mjs`.*

---

## The new law: a Knowledge Need has two classes

```
Knowledge Need
      │
"Can this knowledge already exist?"
      │
 ┌────┴────┐
 YES        NO
 │          │
RETRIEVE   GENERATE
 │          │
Document    Experiment
search      design
```

These are two different worlds. Iteration 1 proved it: Granulometry was **Retrieved** (real sieve curves + laser PSD already in Drive); Set-Cure and Adhesion are **Generate** (the data does not exist — only a never-executed Applus quote for adhesion). PROTEUS must label every recommendation with its **Mode**.

---

## PROTEUS now returns four fields

| Field | Meaning |
|-------|---------|
| **Asset** | which knowledge is missing |
| **Mode** | Retrieve / Generate |
| **Event** | exactly what to do |
| **Expected ΔK** | how much knowledge it should add |

```
▶ Asset=Adhesion · Mode=GENERATE · Event=FIRST_PULL_OFF · ExpectedΔK=0.45 · Priority=3.77
```

---

## Acquisition Cost Vector — cost is not one number

Money alone is the wrong unit. Each event carries a **vector**: money, time, lab occupancy, people, equipment, external dependency.

```
event                   ₪       days  tech  equipment            external
FIRST_SET_TIME            600     3    1     Vicat                no
FIRST_PULL_OFF          1,200     5    1     Pull-off tester      no
SEM_AFTER_COMPRESSION   2,500    14    1     SEM                  YES
SALT_SPRAY             18,000    40    2     Salt-spray chamber   YES
```

ROI is therefore multi-dimensional. A normalized composite trades the dimensions off so the planner can reason about them together.

---

## Phase 5.6 — Knowledge Demand (how often we needed it and lacked it)

Completely different information from ΔK. An experiment may add little *new* knowledge, yet if the system is asked for it dozens of times, its **operational value is very high**.

```
asset           demand  source
Compression       13    proxy
Adhesion          12    proxy
Water             11    proxy
Set / Cure         4    proxy   ← under-counted: no data → no recorded need
```

> **Honesty:** true demand is a log of **Router/PROTEUS misses** — queries an incomplete asset could not answer. We don't have query telemetry yet, so demand here is a transparent **proxy** from corpus signals, which *under-counts truly-missing assets*. That's exactly why real telemetry must replace it — and the engine accepts injected real demand that overrides the proxy.

---

## The priority function — PROTEUS as R&D manager

```
Priority = f(ΔKnowledge, Demand, Acquisition Cost, Confidence Gap)   [value per unit cost]
```

The next experiment is no longer "what teaches the most" but **"what produces the most value for the whole system."**

```
Asset             Mode      Event            ΔK    demand  gap   cost   PRIORITY
Adhesion          GENERATE  FIRST_PULL_OFF   0.45   12     0.65  0.15   3.77
Set / Cure        GENERATE  FIRST_SET_TIME   0.45    4     0.85  0.13   3.46
Compression       GENERATE  SEM              0.12   13     0.37  0.33   1.40
```

**Demand changes the decision.** Inject real Router-miss telemetry (Adhesion 42, Set/Cure 35):
```
Set / Cure   FIRST_SET_TIME  demand 35  PRIORITY 4.57   ← now #1
Adhesion     FIRST_PULL_OFF  demand 42  PRIORITY 4.12
```
An experiment that adds little new knowledge but is needed 35× outranks a marginally cheaper one — operational value, not just learning value.

---

## PROTEUS plans a portfolio, not a test

Given a budget and a free lab window, it selects the R&D portfolio that maximizes value over the cost vector:

```
budget ₪2,000,  lab window 7d  → run {FIRST_SET_TIME, FIRST_PULL_OFF}   (spend ₪1,800)
budget ₪20,000, lab window 60d → add {SEM, FREEZE_THAW}                 (spend ₪13,300)
```

PROTEUS no longer says "do pull-off." It says: *given this budget and this free lab week, run this portfolio.* That is an R&D manager, not a search engine.

---

## The architecture (Phase 5.6 inserted)

```
... → Knowledge Assets (5) → Knowledge Transformations (5.5)
    → KNOWLEDGE DEMAND (5.6)   ← how often each asset was needed and lacked
    → Scientific Laws (6)
    → PROTEUS (7)              — prioritizes by f(ΔK, Demand, Cost, Confidence-Gap),
                                 splits Retrieve vs Generate, plans the R&D portfolio
```

## Status & next

- Built & runnable: `cost-vector.mjs` (Acquisition Cost Vector), `demand.mjs` (Phase 5.6 — proxy + real-telemetry hook), `priority.mjs` (the priority function · 4-field protocol · budget+lab-window portfolio), `demo.mjs`.
- ΔK and money are real/estimated; **demand is a proxy until query telemetry exists** — wiring Router-miss logging is the single highest-value next step (it turns demand real and makes the priority function exact).
- Next (opt-in): log every Router/PROTEUS miss as a demand event; attach real procurement cost vectors from Priority; run the recommend→approve→GENERATE loop (a recommendation to *run a lab test*, not fetch a doc), under the standing governance.

> This is the layer that turns MATRIYA from a system that **acquires** knowledge into one that **manages the organization's knowledge strategy**: it knows what is missing, whether to retrieve or generate it, what each option truly costs, how badly it is needed, and therefore which single action creates the most value for the whole organization.
