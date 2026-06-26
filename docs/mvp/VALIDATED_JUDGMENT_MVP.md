# Validated Judgment — MVP #1 (one real Fresco case)

*Prepared 2026-06-26. This is the first practical MVP, not more theory. It captures **one** Validated Judgment from a real Fresco case (lime plaster vs cement on a damp stone wall), enforces a falsifiable prediction at capture, tracks the closure loop at 1 / 6 / 12 months, and scores prediction-vs-reality. The code is in `mvp/validated-judgment/` and runs with `node demo.mjs` (zero dependencies). Output of that run is reproduced at the bottom.*

> **Atomic unit:** not an experiment, but a **Validated Judgment** — an expert decision under uncertainty, with its rejected alternatives and a *falsifiable prediction*, that reality grades over time.

---

## 1. The schema (minimum useful fields)

A `Judgment` has three parts: **the decision** (captured now), **the predictions** (falsifiable, captured now, *before* the outcome), and **the verdicts** (captured later, by reality).

| Field | Meaning | Required |
|---|---|---|
| `id`, `domain`, `decided_by`, `decided_at` | identity & provenance | ✅ |
| `context.substrate`, `context.conditions` | what wall, what conditions | ✅ |
| `problem` | what we were solving | ✅ |
| `decision` | what we chose | ✅ |
| `rationale` | **why** — the mechanism (breathability, modulus match, salt path…) | ✅ |
| `alternatives_considered[]` | `{option, why_rejected}` — **the why-not is the asset** | ✅ (≥1) |
| `confidence` | expert's honest prior, 0–1 — *this is what reality grades* | ✅ |
| `evidence_at_decision[]` | photos, moisture map, salt test refs | recommended |
| **`predictions[]`** | **falsifiable** — `{metric, kind, horizon_days, …}` | ✅ (≥1) |
| `observations[]` | `{prediction_idx, value, observed_at, evidence}` — filled later | by closure |

A prediction is either **numeric** (`{metric, comparator: <,<=,>,>=,==, target, partial_band, horizon_days}`) or **qualitative ordered severity** (`{metric, expected_max: none<minimal<moderate<severe, horizon_days}`).

**The one rule that makes the corpus un-gameable:** a judgment with **no falsifiable prediction is refused at capture.** Eloquent reasoning with nothing reality can grade is worthless for learning — so the system won't store it.

## 2. The expert form (what gets filled at decision time)

Kept deliberately short — it must be a *byproduct of deciding*, not paperwork:

1. **Problem** — one line.
2. **What did you choose?** — the decision.
3. **Why?** — the mechanism, in your words.
4. **What did you *reject*, and why?** — at least one alternative.
5. **What do you predict will happen, and by when?** — at least one falsifiable prediction (a number with a threshold + horizon, or a severity ceiling + horizon).
6. **How confident are you?** — 0–1.
7. **Evidence now** — attach the photos/readings you already have.

Steps 4 and 5 are the ones that turn a lab notebook into an intelligence asset. They are also the ones experts resist — so the UI must make them one tap each, and must give value back immediately ("here are the closest past judgments and what reality did to them").

## 3. The closure loop (reality answers over time)

Each prediction carries its own `horizon_days`, so the system schedules its own follow-ups:

- **1 month / 6 months / 12 months** site visits (driven by the predictions' horizons, not a fixed calendar).
- At each due date the engine surfaces exactly which metrics are owed an observation (`dueFollowups`).
- A field observation (protimeter reading, photo, salt check) closes that prediction.
- **Closure rate is the core health metric of the whole company** — an open judgment is potential; a *closed* one is the asset.

## 4. The confidence metric (was the expert right — and honest?)

Two numbers per closed judgment:

- **Outcome** = mean of per-prediction grades (`matched`=1, `partial`=0.5, `missed`=0) → *how right was the judgment?*
- **Brier score** = mean of `(confidence − grade)²` → *was the stated confidence honest?* Low = well-calibrated; if outcome < confidence the expert was **over-confident**, if outcome > confidence they were **under-confident**.

Across thousands of judgments these aggregate into a **per-expert, per-domain calibration record** — the thing that is actually sellable, because it lets MATRIYA attach *provable* confidence to a recommendation ("this judgment class has held at 0.85 in the field").

## 5. The real Fresco case (worked end to end)

**Damp stone wall — lime render vs cement.**

- **Problem:** cement render peeling, trapping moisture; salts spalling the masonry.
- **Decision:** strip cement; breathable NHL lime render + mineral silicate paint.
- **Why:** high vapour permeability dries the wall outward; lime's low modulus matches soft masonry (no stress cracks); evaporation moves salt crystallisation to the cleanable surface, not behind a film.
- **Rejected:** cement (traps moisture, rigid), acrylic film paint (blisters), gypsum (re-dissolves).
- **Confidence:** 0.8.
- **Predictions (falsifiable):** ① `wall_moisture_pct` `< 5` by **180d** (from 9% baseline, ±1.5 partial band); ② `delamination` ≤ `minimal` by **365d**; ③ `salt_efflorescence` ≤ `minimal` by **180d**.
- **Reality:** at 180d moisture **6.0%** (→ *partial*), salts **minimal** (→ *matched*); at 365d delamination **none** (→ *matched*).

**Result:** outcome **83% → CORRECT**, Brier **0.057 → well-calibrated.** The wall dried slightly slower than predicted, but the mechanism held. This single graded record is now a reusable, falsifiable asset.

## 6. Reproducible run

```
$ cd mvp/validated-judgment && node demo.mjs

=== 1. CAPTURE GATE ===
Judgment with no falsifiable prediction -> REFUSED ✓
Judgment FRESCO-0001 captured. 3 predictions to close.

=== 2. CLOSURE SCHEDULE ===
as of 2026-06-01: 0 follow-up(s) due -> —
as of 2026-09-01: 2 follow-up(s) due -> wall_moisture_pct, salt_efflorescence
as of 2027-04-01: 3 follow-up(s) due -> wall_moisture_pct, delamination, salt_efflorescence

=== 3. PREDICTION vs REALITY ===
  wall_moisture_pct  expected < 5          observed 6          -> PARTIAL
  salt_efflorescence expected <= minimal   observed minimal    -> MATCHED
  delamination       expected <= minimal   observed none       -> MATCHED

=== 4. JUDGMENT SCORE ===
  closed:       3/3 predictions
  outcome:      83%  -> verdict: CORRECT
  confidence:   0.8  (expert's prior)
  Brier score:  0.057  -> well-calibrated
```

## 7. What this MVP deliberately leaves out (next steps, not gold-plating)

- **Persistence beyond a JSON file** (Supabase table is a 1-hour change when you want it).
- **A real capture UI** — this is the engine; the form above maps 1:1 to fields.
- **Multi-judgment calibration dashboards** — meaningful only once there are dozens of closed judgments; the per-judgment Brier already computes the input.
- **Data-rights / multi-tenant isolation** — the existential decision from the value memo; out of scope for a single-case MVP but must precede any aggregation across customers.

> **The point of this MVP:** prove that *one* expert judgment can be captured in under two minutes, refused if it isn't falsifiable, closed by reality on a schedule, and scored for both correctness and honesty. Everything else — the graph, the prediction engine, the moat — is this same record, accumulated.
