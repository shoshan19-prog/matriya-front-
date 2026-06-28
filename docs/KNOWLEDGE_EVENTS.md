# Knowledge Events — the atom of learning

*Prepared 2026-06-28. A Transformation says "confidence changed." It does not say **what caused it**. The missing unit is not another layer but a new **object**: the **Knowledge Event** — the atom of learning. Every transformation is *composed of* events; the event is primary. With this atom MATRIYA can finally measure which experiments actually produce knowledge, which decisions changed understanding, and the **ROI of each learning event**. The core stops being a Knowledge Graph and becomes a **Scientific Learning Graph**. Code in `mvp/knowledge-map/events/`, runs with `node demo.mjs`.*

```
Sources → Collectors → Episodes → KNOWLEDGE EVENTS → Knowledge Assets
   → Knowledge Transformations → Knowledge Domains → Scientific Laws → PROTEUS
```

> **ΔKnowledge is real** (from the transformation replay). **Cost/duration are an explicit estimate** (a cost model) until wired to real Priority/procurement data — flagged everywhere as such.

---

## The atom

```
Knowledge Event
────────────────────────────
Type:              FIRST_MEASUREMENT
Asset:             Compression Strength
Evidence:          MPZ Dec-2025 28-day campaign
Previous conf:     0.00
New conf:          0.63
ΔKnowledge:        +0.63
Reason:            first quantitative evidence
Cost (est.):       ₪4,500
Duration (est.):   21 days
Decision changed:  YES
ROI (ΔK / ₪1,000): 0.14
```

A Transformation is now **a set of these events**, not the other way round. From `node mvp/knowledge-map/events/demo.mjs`: **24 events** derived from the real 8-product acquisition, each with its ΔK, cost, decision-impact and ROI.

---

## Learning Primitives — laws of *learning* (not of materials)

Aggregate events by type and a new kind of law emerges — about how the organization *learns*:

```
type                      n   avg ΔK   avg cost   ROI/₪1k   decision-rate
FIRST_MEASUREMENT         4   +0.465   ₪4,500     0.103     0.50
OPEN_ASSET                9   +0.194   ₪2,000     0.097     0.11
MORE_MEASURED             4   +0.118   ₪3,000     0.039     0.50
NEW_PRODUCT_QUALITATIVE   7   +0.101   ₪  800     0.127     0.00
```

These are **Learning Primitives**: *"FIRST_MEASUREMENT, repeated 4×, average ΔK 0.46, changes a production decision half the time."* Not a law of cement or pigment — a law of how Fresco comes to know things. A first measurement is the most knowledge-productive event the organization can run, and half the time it also moves a production decision. A duplicate qualitative report produces almost nothing. **These laws are observed, not assumed** — and they are *more fundamental* than Scientific Laws: only once enough Knowledge Events accumulate can material/organizational laws be derived from repeated behaviour rather than written in hindsight.

---

## Efficiency 1 — cost-aware acquisition (knowledge per shekel)

PROTEUS ranks **events by ROI (ΔK per ₪), not raw ΔK** — predicting each candidate's ΔK from its matching primitive and dividing by its (estimated) cost:

```
event                   asset             predicted ΔK   cost      ROI/₪1k
FIRST_SET_TIME          Set / Cure        0.465          ₪   600   0.775
FIRST_SIEVE_CURVE       Granulometry      0.465          ₪   900   0.517
FIRST_PULL_OFF          Adhesion          0.465          ₪ 1,200   0.388
SEM_AFTER_COMPRESSION   Compression       0.118          ₪ 2,500   0.047
SALT_SPRAY              Water             0.118          ₪18,000   0.007
EN13381_FIRE_RATING     Fire              0.118          ₪18,000   0.007

▶ PROTEUS recommends an EVENT: FIRST_SET_TIME (ΔK≈0.47, ₪600, ROI 0.78) — PENDING HUMAN APPROVAL
```

PROTEUS no longer recommends a *document* or a *product* — it recommends an **event**: *acquire the first set-time measurement.* The contrast the proposal called out falls straight out: **SALT_SPRAY** costs ₪18,000 for ΔK≈0.12 (ROI 0.007); a cheap first measurement on an unmeasured asset dominates. Knowledge Gain is now `Σ Event Gain`.

## Efficiency 2 — budget-constrained event portfolio

PROTEUS plans an R&D **portfolio**, not one test — selecting the set of events that maximizes total expected ΔK under a budget:

```
budget ₪3,000:  {FIRST_SET_TIME, FIRST_SIEVE_CURVE, FIRST_PULL_OFF}            → spend ₪2,700, ΣΔK ≈ 1.40
budget ₪6,000:  {…+ SEM_AFTER_COMPRESSION}                                     → spend ₪5,200, ΣΔK ≈ 1.51
```

This is real R&D planning: given a quarter's budget, *which experiments together buy the most knowledge.* The same engine makes the cost/ΔK trade explicit and skips events whose knowledge-per-shekel is too low (built-in redundancy avoidance).

---

## The core is now a Scientific Learning Graph

Nodes are no longer only Assets and Episodes — they include **Learning Events**. Knowledge Gain = Σ Event Gain; Scientific Laws are the repeated Learning Primitives; PROTEUS acquires the most cost-effective event under human approval. This answers questions that were never answerable before:

- which kinds of experiment actually generate knowledge (FIRST_MEASUREMENT ΔK 0.46 vs DUPLICATE ≈ 0);
- which events change decisions (FIRST_MEASUREMENT / MORE_MEASURED: 50%);
- the ROI of each learning event (ΔK per ₪);
- which learning patterns recur across the organization (the primitives).

---

## The architecture (Knowledge Event inserted as the atom)

```
Sources → Collectors → Episodes
   → KNOWLEDGE EVENTS        ← the new atom: what exactly caused the change
   → Knowledge Assets        — what we know
   → Knowledge Transformations — how knowledge changed
   → Knowledge Domains
   → Scientific Laws         — derived from repeated Learning Primitives
   → PROTEUS                 — acquires the most cost-effective next EVENT
```

---

## Status & next

- Built & runnable: `event.mjs` (Knowledge Event atom + cost model + decision-impact), `learning-primitives.mjs` (primitives + candidate events + Efficiency 1 ROI ranking + Efficiency 2 portfolio), `demo.mjs`.
- ΔK is real; cost is an explicit estimate — the one thing to wire next is **real cost/duration per event from Priority/procurement**, after which ROI and portfolio become exact.
- Next (opt-in): persist events so every Intake logs its events; feed real costs; let PROTEUS run the recommend→approve→extract loop on EVENTS; promote stable Learning Primitives into the Phase-6 law layer.

> The atom of learning is the **Knowledge Event**. Knowledge Gain becomes Σ Event Gain, Laws become repeated Learning Primitives, and PROTEUS optimizes the acquisition of the single most cost-effective event — the real foundation of Knowledge Acquisition Optimization.
