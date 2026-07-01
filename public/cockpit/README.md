# MATRIYA Cockpit (three views over the engines)

A self-contained decision UI — **not a report dashboard**. Three angles on the same
engine:

- **Cockpit (now)** — flight status G1–G6, PASS/STOP verdict, promotion on/off,
  observation classification (Observation / Context / Surprise / Artifact), the
  proposed hypothesis, the next experiment, the co-pilot's open questions, and the
  Human-Decision buttons.
- **Timeline (over time)** — how the model's knowledge position evolved.
- **Knowledge Graph (structural)** — why the model thinks what it thinks. Edges are
  colour-tiered (green = grounded/standard · yellow = strong · grey = inferred);
  click an edge for its evidence, ΔK, contradictions, and experiments.
- **Reactive (concept)** — a schematic animation of the intumescent process
  (illustrative, not a measurement).

## Standalone evaluation (by design)

This stays a **standalone page** — not a React tab — so it can be demoed, tested,
broken and improved without touching the app's auth/routing/state. Use the
**Dataset selector** on the Cockpit view to run the 2–3 datasets (APP is gated
through G1–G6; silicate/cementitious have no ingestion request yet, so they
honestly show STOP — "cannot fly until G1–G6 cleared"). The Human-Decision buttons
increment a local **decision counter** that encodes the promotion rule: **≥3 real
decisions on a dataset → consider wiring it in as a Tab**; below that it stays
standalone.

## How to view

- Served by the app: `npm start` in the repo root, then open
  `http://localhost:3000/cockpit/`.
- Or open `index.html` directly in a browser (the snapshot is embedded inline).

## How the data is produced

`index.html` and `snapshot.json` are **generated** — they are a projection of the
`matriya-back` engines, not hand-authored. To regenerate after the engines change:

```bash
# in the matriya-back repo
npm run cockpit:export
```

This runs the gated first flight (P0.1) + MBM/failure engines and writes the
snapshot here. It adds **no** engine capability — it only re-shapes existing
outputs into what a human needs to decide.

**Boundaries:** numeric values are reference-class (provenance grounded in real
standards); the Human-Decision buttons record locally and, in a real integration,
post to the human-review queue (G6) — the engine never changes the model
autonomously.
