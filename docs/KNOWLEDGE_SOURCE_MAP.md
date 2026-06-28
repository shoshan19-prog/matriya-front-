# Knowledge Source Map + Knowledge Trust Engine

*Prepared 2026-06-28. The shift this encodes: stop thinking about **documents**, start modeling the **organization's memory**. A `Source Registry` answers "where are the files." This answers a different, deeper question — **which source holds which kind of knowledge, how much can it be relied on for that kind, and where should PROTEUS look first before running a new experiment.** Code in `mvp/knowledge-map/`, runs with `node demo.mjs`. Calibrated on the real טיח תל אביב corpus.*

```
Knowledge Source Map  →  Knowledge Flow  →  Knowledge Trust Engine  →  PROTEUS "where to look"
   (what each source        (source →            (trust = f(source ×        (rank sources by
    type knows)              EPISODE)             knowledge), LEARNED)        reliability + presence)
```

---

## 1. Knowledge Source Map (replaces the static Source Registry)

The unit is the source **type**, not the file. Each row says *what kind of knowledge it holds*, its strength, and its weakness — so a new source (Teams, Slack, a service desk) is added as **one row + an adapter**, with no change to MATRIYA's or PROTEUS's engines.

| Source | What it knows | Strength | Weakness |
|--------|---------------|----------|----------|
| פורמולציות (formula sheets) | what we put in | high | never explains why |
| דוחות מעבדה (lab sheets) | what was measured | high | rarely explains the decision |
| תוכניות/דוחות שבועיים (weekly) | **why we decided** | very high (reasons) | numbers sometimes missing |
| דו"ח מו"פ (R&D report) | consolidated rationale | very high | written late, one snapshot |
| SharePoint | project documents | medium | duplicates |
| Email | discussions & decisions | very high | a lot of noise |
| Priority (ERP) | what is actually produced | operational truth | explains nothing about development |
| מחברות יד (hand notes) | insights never typed up | very high | hard to search (needs OCR) |
| תמונות (images) | real physical state | medium | needs OCR / vision |
| ספקים (suppliers / COA) | external material knowledge | high | not tuned to Fresco |

Defined in `mvp/knowledge-map/sources.mjs` with, per source, the **expert prior** stars for each knowledge type — the *starting guess* the Trust Engine is then allowed to overrule with evidence.

---

## 2. Knowledge Flow — sources flow into **Episodes**, not into a graph

The correction to the earlier design: it isn't `source → graph`. It's

```
Emails ┐
Weekly ┤
Lab    �├──► Episode Builder ──► (Decision · Dead-End · Causal Threads)
Priority┤
Notes  ┘
```

Each **episode field** is fed by the knowledge types that hold it, and the Trust Engine picks the best-trusted feeder (`mvp/knowledge-map/router.mjs`, `EPISODE_FLOW`):

| Episode field | Fed by | Best source (calibrated on TLV) |
|---------------|--------|---------------------------------|
| `why` | REASON | דו"ח מו"פ |
| `decision` | DECISION | דו"ח מו"פ |
| `dead_end` | DEAD_END | תוכניות/דוחות שבועיים |
| `experiment` | INPUT/BATCH | פורמולציות |
| `results` | MEASUREMENT/VISUAL | תמונות *(because the lab measurement was empty — see §4)* |

---

## 3. Knowledge Trust Engine — trust is **learned**, not declared

The missing layer. It does **not** decide who is *right*. It learns **how much a source TYPE can be relied on for a SPECIFIC knowledge TYPE** — trust is a function of `(source_type × knowledge_type)`.

Each cell is a `Beta(α,β)` belief about *"when this source is consulted for this knowledge, does it actually deliver?"*:

- **prior** ← the expert stars from the Source Map (weak pseudo-counts, so real data dominates quickly);
- **`observe(success)`** ← real evidence. **Present-but-empty counts as a failure** — that is how Fresco's blank lab measurements get learned, not excused;
- **trust** = posterior mean `α/(α+β)`; **calibrated** once a cell has ≥3 real observations.

Same discipline as the Identity Calibration harness: an uncalibrated cell is **flagged**, so PROTEUS routes to it only with a caveat. Trust stars (★★★★★ Batch / ★ Decision for Priority, etc.) are the *output* of calibration, not hand-set constants.

```
Priority      Batch ★★★★★  Decision ★  Mechanism ☆      (prior — uncalibrated here, never read)
Weekly Report Decision ★★★★★  Reason ★★★★★  Measurement ★★   (calibrated on TLV)
Lab Sheet     Measurement ★★★★★ (prior)  →  ★★ (calibrated, empty in corpus)
```

---

## 4. The one finding that proves the thesis

Run `node mvp/knowledge-map/demo.mjs`. The Trust Engine is seeded with the **real observations** from the טיח תל אביב reconstruction. The result:

```
▶ Spotlight — lab_sheet × MEASUREMENT:
   expert prior said ★5 (textbook source for measurements).
   calibrated on real corpus → ★2  (6 obs, all present-but-EMPTY).
   MATRIYA LEARNED Fresco's reality: the strength numbers were never recorded.
```

A generic system would forever believe "for a strength number, go to the lab sheet." MATRIYA **learned Fresco's actual knowledge ecology**: in this corpus those fields are blank, so that route is worthless — and it says so. That is the whole point of a Trust Engine: not textbook reliability, but *this organization's measured reliability*.

---

## 5. PROTEUS stops saying "I'm missing info" and starts saying "look here first"

For a missing piece of knowledge, PROTEUS ranks source types by **calibrated trust**, gated by **corpus presence** (`delivered` ▸ `unknown` ▸ `empty` ▸ `absent`), and annotates the catch:

```
MISSING: "why did a version fail?"  (REASON)
  1. דו"ח מו"פ                ★★★★★  [delivered]
  2. תוכניות/דוחות שבועיים    ★★★★★  [delivered]
  3. SharePoint               ★★☆☆☆  [unknown]  ?uncalibrated
  ⓘ not available in corpus: Email, מחברות יד — adding these sources would unlock this knowledge type

MISSING: "what was the 28-day compressive strength?"  (MEASUREMENT)
  ⓘ "דוחות מעבדה" is the natural home for this but the field is EMPTY — the data was never recorded, not just misfiled
  ⓘ not available in corpus: weekly, R&D report, hand notes, formula, images

MISSING: "which batch is in production now?"  (BATCH)
  ⓘ not available in corpus: Priority (ERP) — adding it would unlock this knowledge type
```

PROTEUS no longer searches at random. It knows **where the probability of an answer is highest** — and, just as importantly, when the answer **cannot exist in the current corpus** and which source must be connected to obtain it.

### Complementary sources — which sources *complete each other*

To reconstruct a full product story you need several knowledge types at once. The router reports which sources cover them together and what stays out of reach:

```
INPUT        → פורמולציות               ✓ reachable
DECISION     → דו"ח מו"פ                ✓ reachable
REASON       → דו"ח מו"פ                ✓ reachable
DEAD_END     → תוכניות/דוחות שבועיים    ✓ reachable
MEASUREMENT  → (lab sheet — EMPTY)       ✗ not reachable
BATCH        → (Priority — ABSENT)       ✗ not reachable
GAPS: MEASUREMENT, BATCH ← connect lab data + Priority to close the story
```

---

## 6. Honest caveats

- **Trust priors are still expert guesses until calibrated.** Priority, Email, and hand-notes were never read in this corpus, so their cells stay at the prior and are flagged `?uncalibrated`. Their stars are **not** evidence yet — they are hypotheses about where knowledge lives.
- **Presence is per `(source × knowledge_type)`, not per source.** A formula sheet is `delivered` for INPUT but `absent` for MEASUREMENT. The demo passes presence contextual to each query for exactly this reason.
- **Observations here are hand-seeded from the reconstruction**, not auto-extracted. Wiring `observe()` to fire automatically whenever the Episode Builder finds (or fails to find) a field in a source is the next step — then the trust matrix calibrates itself continuously.
- **This sits directly on the Knowledge Identity Engine and Episodes** — it tells those engines *where to pull each field from, and how much to believe it.*

## 7. Status & next

- Built & runnable: `sources.mjs` (Source Map), `trust.mjs` (Trust Engine, Beta-calibrated), `router.mjs` (Knowledge Flow + "where to look" + complementary-coverage), `demo.mjs` (calibrated on real TLV data).
- Next (opt-in): auto-`observe()` from the Episode Builder; per-source-instance trust (not just per-type); decay so stale sources lose trust; wire `whereToLook()` into PROTEUS's retrieval loop; add adapters (Teams/Slack/service-desk) as Source-Map rows.

> MATRIYA stops being "a system that centralizes knowledge" and becomes a system that **understands Fresco's knowledge ecology**: which source produces which knowledge, how reliable each is for it, and where to look for the answer *before* starting a new experiment.
