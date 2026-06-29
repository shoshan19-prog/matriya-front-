# Telemetry — turning the last proxies into real signals (recorder only)

*Prepared 2026-06-28. The architecture is complete; the remaining weakness was not structure but **truth signals**. Two were still estimated — Demand (a corpus proxy) and Decision Value (a model). Telemetry makes them real by **recording**, never acting. Approved scope: telemetry only, no automation. Code in `mvp/knowledge-map/telemetry/`, runs with `node demo.mjs`.*

---

## Hard boundaries (by design)

1. Read / append-only.
2. No change to existing decisions.
3. No auto-extract.
4. No auto-generate.
5. No writing to the evidence graph.
6. Only the **7 allowed event types** are recordable.

`telemetry.mjs` has **no** `extract()`, `generate()`, or graph-write function — it physically can only record. `appendEvent` rejects anything outside the whitelist:

```
allowed: router_miss, router_hit, recommendation_shown, human_approved,
         human_rejected, experiment_generated, outcome_recorded
⛔ guard: event "auto_extract" not allowed (recorder is append-only, 7 types)
```

---

## Signal 1 — Demand becomes real (from `router_miss`)

Demand was a corpus proxy that **under-counted truly-missing assets** (no data → no recorded need). Now it is measured directly: every time the Router/PROTEUS is asked for an asset and can't answer, a `router_miss` is logged.

```
asset                     real demand (misses)   hits
Adhesion                        9                  0
Set / Cure                      5                  0
Compression Strength            2                  1
Color / Shade                   2                  1
```

Set/Cure was demand **4 by proxy** → **5 real misses** (the proxy under-counted, exactly as flagged); Adhesion's 9 misses confirm the operational pain the proxy only hinted at.

### Before / after — Priority recomputed on real demand

```
event                   priority(proxy) → priority(telemetry)   Δ
FIRST_SET_TIME          3.10  →  3.25    +0.15
FIRE_CONE_CALORIMETER   1.56  →  1.67    +0.11
SEM_AFTER_COMPRESSION   1.71  →  1.49    -0.22
COLOR_QUV_WEATHERING    1.77  →  1.64    -0.13
```

Real demand re-orders the plan — assets people actually keep asking for rise; assets nobody queries fall. The priority function is unchanged; only its inputs got honest.

---

## Signal 2 — Decision Value becomes proven (from `outcome_recorded`)

The Decision Ledger was a model with one illustrative regret row. Now it is built from recorded outcomes:

```
asset                 decisions  realized  verdict
Adhesion                  2        1.50    knowledge drove successful decisions
Fire Resistance           1        0.90    knowledge drove successful decisions
Compression Strength      1        0.85    knowledge drove successful decisions
```

### Decisions that changed because of new knowledge

```
"exterior render spec" [Adhesion]
   ship as-is  →  require primer coat below 2.5 MPa pull-off
   via FIRST_PULL_OFF · outcome success (business +0.70)
```

This is the whole point of Decision Value, now **observed**: a pull-off measurement (the event PROTEUS recommended) flipped a real spec decision and improved the outcome. MATRIYA can now show not just *what it knows* but *which knowledge changed a decision and what that was worth.*

---

## Governance audit (the funnel is logged too)

```
shown 2 · approved 1 · rejected 1 · generated 1
```

Every Intake passes through a human gate — `recommendation_shown → human_approved / human_rejected → experiment_generated`. The audit trail proves the no-automation rule held: PROTEUS recommended (and one ₪18k salt-spray was **rejected** as low-business), a human approved the pull-off, and only then was an experiment generated.

---

## Required outputs — delivered

| Output | Where |
|--------|-------|
| Real Demand per Asset | `demandFromTelemetry(log)` — Adhesion 9, Set/Cure 5, … |
| Real Decision Ledger | `ledgerFromTelemetry(log)` → backtest |
| Before/after Priority report | proxy vs telemetry priority + Δ |
| Decisions changed by new knowledge | `decisionsChangedByKnowledge(log)` |

---

## Stage 2 emitter — Priority/ERP → real cost & duration

The second live emitter (`telemetry/priority-telemetry.mjs`, run `node priority-demo.mjs`). Same governance: append-only, records **only** `experiment_generated`, no change to ERP, no secrets (the ERP document id is HMAC-hashed). It records the real ₪ and days of each finished experiment, turning the **Acquisition Cost Vector from estimate → measured**:

```
event             estimate ₪/days  →  real ₪/days   source
FIRST_SET_TIME    ₪  600 / 3d      →  ₪  520 / 2d   telemetry ✓
FIRST_PULL_OFF    ₪ 1200 / 5d      →  ₪ 1450 / 6d   telemetry ✓
SALT_SPRAY        ₪18000 / 40d     →  ₪21000 / 44d  telemetry ✓
```

ROI recomputes on the real cost — knowledge-per-shekel becomes exact:
```
FIRST_SET_TIME   ROI 0.797 → 0.919   (cheaper than estimated → better value)
FIRST_PULL_OFF   ROI 0.398 → 0.330   (dearer than estimated)
```

`mergedCostVectors()` overrides the estimate where real data exists and leaves the
rest flagged `estimate`. Nothing else changes — recording a cost triggers no
action. The `matriya ingest priority` adapter now reports **WIRED (Stage 2)**.

## Status & next

- Built & runnable: `telemetry.mjs` (append-only recorder + 4 derivations), `telemetry-seed.mjs` (SAMPLE feed — real Router/PROTEUS/lab events replace it verbatim), `demo.mjs`.
- The SAMPLE feed is illustrative; the **machine** (append-only log, the 7-type whitelist, the aggregators, the before/after report) is the deliverable. Wiring real emitters: Router logs miss/hit; the recommendation UI logs shown/approved/rejected; the lab logs experiment_generated; QC/returns/sales log outcome_recorded.
- This was the last estimated signal. With telemetry live, every term in `Priority = f(ΔK, Demand, Business Impact, Cost, Confidence Gap)` is grounded in real data — and PROTEUS still never acts on its own.

> Telemetry closes the gap between the model and reality **without crossing the automation line**: Demand is measured, Decision Value is proven, and PROTEUS learns which knowledge is actually missing and which knowledge actually changed decisions — recording only, deciding nothing.
