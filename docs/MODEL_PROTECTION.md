# Protecting the model, not just the document

*Prepared 2026-06-29. The real finding from the Google Drive scan was not the fire data — it was that the authority chain did what it was built to do. When new intumescent fire results arrived, Evidence Qualification did not swallow them: it met a measurement type it had never seen (`time-to-500°C` in minutes, not `temperature_delta` in °C) and stopped — not "no", not "yes", but **"I do not yet know how to represent this."** That is a step up in maturity, and this note locks it in. Code: `schema/asset-schema.mjs` + `schema/fire-episodes.mjs`. Run: `matriya schema`.*

---

## The level-up

Until now the chain protected the **quality of the evidence** (Units / Baseline / Physics — is the *claim* sound?). The Drive files were the first time it protected the **quality of the model** — is the system even able to *represent* this kind of knowledge yet?

```
old question:  "is this document trustworthy?"
new question:  "do I know how to represent this new kind of knowledge at all?"
```

A weaker system, meeting `time-to-500°C`, would have said *"that's basically the same as a temperature reading"* → ACCEPT → a silent error baked into the asset forever. MATRIYA said *"probably belongs to Fire Resistance, but my schema doesn't model this measurement"* → REVIEW. It protected the **model**, not the document.

A system that knows to stop when it meets a new model can be extended for years without accumulating silent errors. That is the property worth keeping.

## Three layers kept distinct

The fire result also separated three things that are easy to conflate:

```
Data:       043 · 123 min
Knowledge:  at DFT 2000 µm, sample 043 reached 123 min to 500 °C
Law (later):  there may be a relationship between DFT and fire resistance
```

`matriya schema` only ever produces the first two as *candidates*. The third — the law — is explicitly deferred.

## What was done — exactly two things

**1. Fire Resistance became a MODEL, not a field.** Extended from v1 (a single ISO-1182 `temperature_delta`) to a structured model (`schema v2`):

```
timeToFailure (min) · failureTemp (°C) · steelTempCurve (°C/min) · dft (µm)
charExpansion (cm) · standard · testGeometry · furnaceProfile · certified
+ legacy: temperature_delta (still recognized)
```

So every future fire test enters the *same* model. And the protection still holds at the next unknown: a record with a new `smokeToxicity` dimension still routes to **REVIEW — extend the model first**.

**2. The fire tests became Episodes, not PDFs.** Six knowledge units (`schema/fire-episodes.mjs`), each `Test → sample → DFT → result`, structured per the model and validated as **RECOGNIZED**:

```
TFX-FIRE-043-1000  fresco    RECOGNIZED  (DFT 1000µm → 85 min)
TFX-FIRE-043-2000  fresco    RECOGNIZED  (DFT 2000µm → 123 min)
TFX-FIRE-044-1000  fresco    RECOGNIZED  (DFT 1000µm → 79 min)
TFX-FIRE-044-2000  fresco    RECOGNIZED  (DFT 2000µm → 127 min)
BENCH-045-1000     external  RECOGNIZED  (DFT 1000µm → 76 min)
BENCH-045-2000     external  RECOGNIZED  (DFT 2000µm → 105 min)
```

043/044 are Fresco (INT-TFX); 045 is a competitor benchmark, tagged `external` and deliberately **not compared**.

## What was NOT done (on purpose)

- **No corpus write** — the episodes are `PENDING_REVIEW`; `REAL_EPISODES` is untouched (grep confirms 0).
- **No laws** — the DFT↔fire relationship is named as a *future* possibility, not computed.
- **No ranking, no "which product is better"** — even though 043/044 beat the benchmark, that judgement is a later stage.
- **No Knowledge Score change** — nothing is promoted.

All of these belong to the next stage, *after* a human approves the new Fire schema.

## Methodological honesty on INT-TFX

INT-TFX moved from **"almost no data"** to **"significant new evidence"** — but **not** to *validated*. It still needs: (1) the new measurement model approved, (2) the episodes linked to the Fire asset through review, (3) the chain's human-approval step. And the report itself is intermediate (`certified: false`) — Saint-Gobain requires an official large-scale EN 13381-8 certificate — so it is a **boundary**, not a closed result.

## Status & next

- Built & runnable: `schema/asset-schema.mjs` (asset MODELS · `recognize` · `validateRecord`), `schema/fire-episodes.mjs` (6 PENDING fire units), wired as `matriya schema`. Fire model is v2; the protection holds at the next unmodeled dimension.
- The principle to keep: **the chain now protects the model, not only the document.** When a new kind of knowledge appears, the correct answer is "I don't yet know how to represent this" → REVIEW — never a silent ACCEPT.
- Next, only on your approval: link the approved Fire schema + episodes into the asset (through the human-review gate), which would let INT-TFX become a candidate validation project — still no laws until that schema is confirmed.
