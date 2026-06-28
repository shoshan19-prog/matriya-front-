# Organizational Learning Backlog

*Prepared 2026-06-28. The Learning Pattern Engine is, today, a **HYPOTHESIS engine**, not a proven-pattern engine. Its real value is not that it found patterns — it is that it **refuses to promote a pattern before there is enough support**. That restraint is what separates "looks interesting" from "a proven organizational pattern." Until the corpus reaches evidential volume, the correct deliverable is this backlog: a register of organizational hypotheses awaiting evidence. Live ledger: `node mvp/knowledge-map/learning/backlog.mjs`.*

---

## Promotion gate — nothing is promoted until ALL three clear

```
episodes              [█████░░░░░░░░░░░░░░░]  7/30   ✗
product families      [███████░░░░░░░░░░░░░]  1/3    ✗
production decisions  [████░░░░░░░░░░░░░░░░]  1/5    ✗

VERDICT: PROMOTION LOCKED — corpus below evidential volume
```

The gate is a **global precondition**: even a hypothesis that reached its own support threshold may not be promoted while the corpus as a whole is this thin. Numbers reflect only Episodes actually reconstructed — nothing is invented.

| Gate | Now | Target | Why |
|------|-----|--------|-----|
| Real episodes | 7 | **≥30** | enough decision cycles for a contrast to mean something |
| Product families | 1 | **≥3** | a pattern must hold *across* products, not in one |
| Production decisions | 1 | **≥5** | "success" must be anchored in real go-to-production calls |

---

## The waiting hypotheses (organizational, not material)

Each is an honest `HYPOTHESIS` — `BLOCKED_ON_VOLUME` until the gate opens, then `READY_TO_PROMOTE` only once its own support ≥ 4.

| ID | Hypothesis | Support now | Source | Note |
|----|-----------|:----------:|--------|------|
| **OLH-1** | Almost every raw-material change follows a fixed route: *Field failure → Meeting → Supplier change → Lab trial → Compression → Decision → Production* | 1 / 4 | engine | the canonical path from the TLV thread |
| **OLH-2** | Skipping the SEM / microstructure step raises the re-trial probability | **0 / 4** | engine | **not a single episode with SEM exists in the current corpus — untestable yet** |
| **OLH-3** | Decisions that relied only on viscosity (no strength) often ended in another trial | 1 / 4 | expert | seen in the thermal variant; needs more cases |
| **OLH-4** | Combining field feedback + lab result before a formula change → higher success rate | 1 / 4 | expert | in TLV the measurement was empty — the lab side can't be confirmed |
| **OLH-5** | Number of trials until a formula freezes converges to a typical range | 1 / 4 | engine | TLV ~15 pilots → a single data point |
| **OLH-6** | A supplier change happens when QC (sieve / COA) shows inconsistent fractions | 1 / 4 | expert | צמיתות → כפר גלעדי |
| **OLH-7** | Skipping water-absorption characterization before choosing a lightweight aggregate → repeated failure | 1 / 4 | expert | the thermal-variant failure chain |

**OLH-2 is the sharpest reminder of the discipline:** the engine *cannot even test it* — the current corpus has zero SEM episodes. A lesser system would still "surface" it; this one marks it `support 0/4` and waits.

---

## Extraction plan — the next step is Episodes, not code

The gap closes by reconstructing more real decision cycles across more products — exactly the recommended set:

| # | Product | Family | Projected episodes | Prod decisions | Status |
|---|---------|--------|:------------------:|:--------------:|--------|
| 1 | טיח תל אביב | restoration plaster | 7 | 1 | **done** |
| 2 | INT-TFX | INT-TFX | 9 | 2 | todo |
| 3 | MPZ / cementitious | cementitious | 9 | 2 | todo |
| 4 | טיח תל אביב תרמי *(halted)* | restoration plaster | 7 | 0 | todo — **negative knowledge** |

```
projected total: 32 episodes · 3 families · 5 production decisions
✓ executing the full plan CLEARS the gate.
```

Notes:
- Product #4 is deliberately a **stopped/failed product** — its value is *negative knowledge* (what process led nowhere). The thermal variant already has a documented failure chain, so it yields episodes cheaply and is the best test for OLH-2/OLH-7.
- #3 (cementitious / MPZ) ties directly into the existing cement-threshold DOE work — its production decisions are the most measurable.
- Yields are **projections**, not data. Each becomes real only when the Episode Builder runs on that product's corpus.

---

## Promotion protocol (when the gate opens)

1. **Gate check** — `node backlog.mjs` shows all three bars ✓.
2. **Per-hypothesis support** — its own `current_support ≥ 4` real cycles.
3. **Cross-family** — the contrast holds in **≥2 families**, not one (guards against a single product's idiosyncrasy).
4. **Effect size + direction** — `stageOutcomeContrast` lift ≥ 1.4 (or ≤ 1/1.4) *and* ≥ 0.15 absolute, with support on both arms.
5. **Human sign-off** — correlation ≠ cause; a promoted pattern is a *characterization of how Fresco works*, reviewed before it influences PROTEUS recommendations.

Only a hypothesis clearing all five graduates from `OLH-#` to a **proven Organizational Pattern** that the Router/PROTEUS may cite.

---

## Status & next

- Built & runnable: `backlog.mjs` — the live evidence ledger + hypothesis register + extraction-plan projection (`node backlog.mjs`).
- This is the **honest current output of the Organizational Learning Engine**: not patterns, but a disciplined backlog of hypotheses with an explicit, measurable path to evidence.
- Next step is **not more code** — it is reconstructing products #2–#4 (INT-TFX, MPZ, the halted thermal variant) to cross the 30 / 3 / 5 gate. When `node backlog.mjs` reports `GATE OPEN`, promotion begins under the protocol above.

> The deliverable today is restraint made measurable: every organizational insight is held as a hypothesis, with the exact evidential volume it is still waiting for. That is the difference between a system that *guesses* how Fresco works and one that will eventually *know*.
