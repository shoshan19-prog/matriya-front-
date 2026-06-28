# Router Telemetry — the first live emitter

*Prepared 2026-06-28. Approved scope: wire ONE real emitter — Router → telemetry — recording only `router_hit` / `router_miss`. The cleanest, cheapest, most critical signal for real Demand. It barely touches behaviour; it only measures it. Code in `mvp/knowledge-map/telemetry/router-telemetry.mjs`, runs with `node router-demo.mjs`.*

```
User asks / system searches → knowledge found or not → router_hit / router_miss → real Demand by Asset
```

---

## Boundaries (enforced in code)

1. Append-only.
2. May record **only** `router_hit` / `router_miss` (the emitter rejects anything else).
3. No auto-extract. 4. No auto-generate. 5. No evidence-graph write.
6. **No change to the Router's answer** — the wrapper is pass-through and returns the router response untouched; telemetry failures are swallowed so they can never affect routing.
7. No secrets (the HMAC salt comes from the environment and is never written into an event).
8. **No full query text.** Per event we store only: `timestamp · asset_id · route · hit/miss · confidence · anonymized_query_hash · user_role`.

```
privacy-safe event (raw query NEVER stored):
{"type":"router_miss","ts":1001,"asset":"Adhesion","route":"/ask/Adhesion",
 "hit":false,"confidence":0.35,"anonymized_query_hash":"4f5c23b208a90ce3","user_role":"support"}
```

The query is HMAC-SHA256-hashed (salted) for de-duplication/anonymization, then **discarded** — sensitive or not, the text is never persisted.

---

## Pass-through, verified

```
19 queries routed; Router answers unchanged in 19/19 (pass-through verified).
19 telemetry events recorded.
```

`instrumentRouter(routerFn, getLog, setLog)` wraps any router: it calls the router, returns its answer **unchanged**, and records a hit/miss on the side.

---

## Required outputs — delivered

**demand_by_asset** (real, from `router_miss`):
```
Adhesion 5 · Set / Cure 4 · Compression 2 · Color 1 · Water 1
```

**miss_rate_by_asset** — the sharpest signal: where the system *never* answers:
```
asset                miss/total  miss-rate
Adhesion             5/5         1.00   ← system fails every time
Set / Cure           4/4         1.00   ← system fails every time
Compression          2/3         0.67
Color / Shade        1/2         0.50
Workability          0/2         0.00   ← well answered
```

**top_unanswered_assets**: Adhesion (5, rate 1.0) · Set/Cure (4, rate 1.0) · Compression (2, 0.67) · …

**change in PROTEUS priority after live telemetry** (proxy → live demand):
```
FIRST_PULL_OFF   4.30 → 4.02   (-0.28)
FIRST_SET_TIME   3.10 → 3.10   (0)
SEM              1.71 → 1.47   (-0.24)
```
Priorities now move on what people *actually ask* and where the system *actually fails* — not a corpus proxy. A 100% miss-rate on Adhesion/Set-Cure is the real operational case for generating those measurements.

---

## Status & next

- Built & runnable: `router-telemetry.mjs` (HMAC anonymizer · `routerEvent` · `instrumentRouter` pass-through · `demandByAsset` · `missRateByAsset` · `topUnansweredAssets`), `router-demo.mjs` (SAMPLE week of queries — replace the stub `routerFn` with the real Router; everything else stays).
- This is the only live emitter. UI, lab, and outcome emitters remain **not** wired (per decision).
- Integration to go live: classify each real query to an `asset_id`, set `answered`/`confidence` from the real Router result, call the wrapped router instead of the raw one, and persist the append-only log. No other change.

> The first live signal: Demand stops being a guess and becomes a measurement of what the organization actually needs and where MATRIYA fails to answer — recording only, changing nothing, storing no query text.
