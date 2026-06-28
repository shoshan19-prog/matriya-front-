# Decision Value — MATRIYA becomes Decision Intelligence

*Prepared 2026-06-28. The closing layer. Until now PROTEUS maximized knowledge — but an organization does not exist to acquire knowledge; it exists to improve products, quality, development time, cost, and customers. So the goal is not maximal knowledge but **maximal decision quality**. This adds a Business-Impact term to the priority function and a new layer — **Decision Value** (`Knowledge → Decision → Business Value`). MATRIYA stops being Scientific Memory and becomes **Decision Intelligence**. Code in `mvp/knowledge-map/decision-value/`, runs with `node demo.mjs`.*

```
Sources → Episodes → Knowledge Events → Knowledge Assets → Transformations
    → Knowledge Demand → DECISION VALUE → PROTEUS
```

---

## Business Impact — same knowledge, different value

An event with high ΔK can carry little business value. If this year's pain is **customer returns from cracking**, a Pull-Off test (modest ΔK) is worth far more than a Salt-Spray test (high ΔK, wrong problem). Business Impact is a **vector** over what the company cares about — Production · Quality · Sales · Regulation · Customer · Strategic — scored against the company's **current objective** (a configurable business input):

```
objective = "customer returns from cracking"
  Adhesion        1.00   ← cracking → returns
  Compression     0.74
  Color           0.71
  Fire            0.69
  Water/Salt      0.59   ← lower THIS year
```

---

## The priority function gains a business term

```
Priority = f(ΔKnowledge, Demand, Business Impact, Cost, Confidence Gap)   [value per cost]
```

`Decision-coupling` is **real** (events that actually changed a production decision — already tracked); Business Impact is the configurable business focus. PROTEUS now returns Business Impact and **Decision Value** too:

```
Asset       Mode      Event           ΔK    bizImpact  decValue  PRIORITY
Adhesion    GENERATE  FIRST_PULL_OFF  0.45   1.00       0.79     4.23
Set / Cure  GENERATE  FIRST_SET_TIME  0.45   0.56       0.32     3.13
Compression GENERATE  SEM             0.12   0.74       0.58     1.65

▶ Asset=Adhesion · Mode=GENERATE · Event=FIRST_PULL_OFF · ΔK=0.45 · Business=1.0 · DecisionValue=0.79 · Priority=4.23
```

PROTEUS no longer asks *"what teaches the most?"* but **"which next event produces the most total value for the organization?"** — and every future source (SharePoint, Gmail, Priority, BASF, Evonik, patents, ERP, CRM, customer service) is judged the same way: *does the knowledge it adds actually change decisions?* — not merely *does it add knowledge?*

---

## Innovation 1 — Decision Ledger + knowledge-ROI backtest

Closes the loop in the **other** direction: did acquired (or *missing*) knowledge actually change decisions and outcomes? A ledger records each real decision, the asset it used, and the realized business outcome:

```
asset          decisions  realized  regret  verdict
Adhesion           2        0.20    -0.60   knowledge GAP cost the business — acquiring it has proven value
Fire Resistance    1        0.90       0    knowledge drove a successful decision (A1 cert → market)
Compression        1        0.85       0    knowledge drove a successful decision
Color / Shade      1        0.75       0    knowledge drove a successful decision
```

Adhesion shows a **negative regret**: a decision made *without* pull-off data caused returns — so the missing knowledge has a *proven business cost*, which is exactly why PROTEUS now prioritizes generating it. This is how MATRIYA measures whether knowledge mattered, not just whether it existed. *(The success rows are real decisions from the reconstructions; the regret row is illustrative until real outcome telemetry — returns/QC/sales — is wired.)*

## Innovation 2 — Objective-conditioned planning (R&D follows strategy)

The same knowledge map yields **different optimal R&D portfolios** under different business objectives:

```
objective "customer-returns-cracking" → {PULL_OFF, SET_TIME, COLOR_QUV}
objective "regulatory-certification"  → {PULL_OFF, SET_TIME, FIRE_CONE}   ← Fire pulled in
objective "win-new-sales"             → {PULL_OFF, SET_TIME, COLOR_QUV}   ← Color pulled in
```

Leadership can see the **R&D consequence of a strategic choice** before committing budget. (Pull-Off stays #1 across all three — honestly, a cheap *first* measurement of an unmeasured, customer-critical property is robust under almost any strategy; business steers the *rest* of the plan.)

---

## The final MATRIYA chain

```
Sources
  ↓
Episodes
  ↓
Knowledge Events        — the atom of learning
  ↓
Knowledge Assets        — what we know
  ↓
Knowledge Transformations — how knowledge changed
  ↓
Knowledge Demand        — how often we needed it and lacked it
  ↓
DECISION VALUE          — Knowledge → Decision → Business Value
  ↓
PROTEUS                 — maximizes decision quality, not knowledge volume
```

---

## Status & next

- Built & runnable: `business-impact.mjs` (impact vector + objective presets), `decision-value.mjs` (real decision-coupling + Decision Value + priority with Business Impact), `decision-ledger.mjs` (Innovation 1 — backtest), `demo.mjs` (incl. Innovation 2 — objective-conditioned planning).
- Real signals: decision-coupling (events that changed a production decision) and the success rows of the Decision Ledger. Configurable/illustrative: the business-objective weights and the regret row — both await real outcome telemetry (returns, QC pass-rate, sales, regulatory events).
- Next (opt-in): wire real outcome telemetry into the Decision Ledger to make knowledge-ROI exact; let the business set the live objective; run the recommend→approve→(retrieve|generate) loop ranked by Decision Value.

> The final goal is not to maximize the amount of knowledge, but the **quality of the decisions** the organization can make because of it. With Decision Value, MATRIYA can measure whether a given knowledge acquisition truly changed a decision, an experiment outcome, a product's quality, or the company's performance — the definition of Decision Intelligence.
