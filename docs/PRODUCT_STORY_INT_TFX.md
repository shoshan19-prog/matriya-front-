# Product Reconstruction — INT-TFX (mineral intumescent fire-protective coating)

> Extraction #2 of the Organizational Learning Backlog plan. Chosen for **cross-family diversity** — a different product family from the plaster line. Read-only; nothing in Drive modified. Qualitative only; raw specs kept local.
>
> *Prepared 2026-06-28. Same rules: never invent; VERIFIED vs ASSUMPTION; source per statement; contradictions preserved; absence reported.*

---

## 0. Honest headline (read first)

INT-TFX **exists as a fully-specified R&D dossier but has essentially NO executed experimental corpus.** It is a **December 2025 "locked product file" (תיק מוצר נעול) at Stage 0 → POC**. Its own experiment log has **three planned-but-empty rows** (EXP-INT-01/02/03) plus **one legacy reference row** (EXP-LEG-044) — the only row with measured data, and that row is an explicitly *historical* formulation, not an INT-TFX additive trial. **No INT-TFX additive trial (INT-A/B/C) has been run.** `[VERIFIED]`

The July-2024 intumescent burn campaign and the 2022 APP/pentaerythritol/melamine recipes were read **and kept separate** — they are a different (legacy) product line, not INT-TFX. They were **not** substituted in to inflate the corpus.

**Family:** **mineral intumescent fire-protective coating** ("Radiative–Structural Barrier" concept) — **distinct from the plaster family.** Cross-family diversity confirmed. `[VERIFIED]`

**Source (primary, VERIFIED):** `INT-TFX — תיק מוצר טכנולוגי (פיתוח מו״פ)` (Google Doc, id `14yvxt9_ROQFlnSmZEfGnc6NY0JhfK9Ni4GIK1CgnMtw`). Plus adjacent equipment/procurement references (lab-equipment seed tagging the muffle + flammability furnace "INT-TFX (critical)"; acquisition manual listing INT-TFX as 1 of 6 active POCs).

---

## 1. Knowledge Episodes

These are **definition / decision cycles**, not experiments — which is itself the finding about where INT-TFX sits in Fresco's process.

### EP-TFX-01 — Reframe the mechanism (hypothesis lock)
- **Question:** intumescents fail late (400–600°C: chimneys, char collapse, uncontrolled radiative transfer). Can fire resistance improve by controlling the char as an **active thermal body** rather than chasing expansion ratio?
- **Hypothesis:** "שיפור עמידות אש אינו מושג ע״י ניפוח נוסף, אלא ע״י שליטה בקרינה, ספיחת חום מאוחרת וייצוב מבני של שלד ה-char" — a **Radiative–Structural Barrier**.
- **Decision:** ACCEPTED as the locked framework (Stage 0 done).
- **Stages:** `MEETING, DECISION` · **Outcome:** `accepted` · prod-decision: no.

### EP-TFX-02 — Lever selection (which additive families are allowed)
- **Hypothesis:** three separable additive groups — **A** radiation scatterers (TiO₂ rutile, micronized iron oxide), **B** endothermic heat sinks (hydromagnesite/huntite, fine ATH), **C** mineral skeleton builders (microsilica, zinc borate) + **D** hollow microspheres; **excludes** organics/PCM/active-carbon/open graphite.
- **Experiment:** INT-A/B/C formulations specified (additives + dosages + suppliers) — **not executed.**
- **Decision:** ACCEPTED (formulations + lab order quantities locked; change only via documented ITERATE).
- **Stages:** `SUPPLIER_CHANGE, DECISION` · **Outcome:** `open` (awaiting trials) · prod-decision: no.

### EP-TFX-03 — Legacy burn anomaly EXP-LEG-044 (the only measured datapoint)
- **Experiment:** reference burn of a historical formula (`10.04.2025-044`, VINNAPAS EZ 3112 + Exolit AP435) under the Hobersal furnace ramp.
- **Results (measured):** "67 דק׳ עד 374°C ואז קפיצה ל-554°C" — a **discontinuous temperature jump** (suspected char crack / channel opening); chimneys = yes; collapse = yes.
- **Decision:** **HOLD** under the Burn-Test Anomaly Gate — "כשל תשתית / מדידה, לא פורמולציה" cannot be ruled out yet.
- **Why:** the gate forbids a formulation conclusion before a PV-vs-setpoint check + identical blank run + sensor verification + DFT documented.
- **Stages:** `LAB_TRIAL, MEASURE (burn/time-to-temp), DECISION` · **Outcome:** `open / retrial (HOLD)` · prod-decision: no.

### EP-TFX-04 — Define the burn protocol & anomaly gate
- **Decision:** ACCEPTED a binding SOP — Hobersal HCV56/13X FAST, carbon steel (no primer), DFT recorded, dry ≥24 h; metrics = time-to-500°C cold side, expansion ratio (record-only), char stability, chimneys, collapse.
- **Stages:** `DECISION` (process governance) · **Outcome:** `accepted` · prod-decision: no.

---

## 2. Counts & honesty

| Metric | Value |
|--------|-------|
| Episodes | **4** (3 definition/decision, 1 legacy measured, held at a gate) |
| Executed INT-A/B/C additive trials | **0** |
| Production decisions | **0** |
| Family | **mineral intumescent fire-protective coating** *(new family — cross-family ✓)* |
| Strength / SEM / viscosity for INT-TFX | **ABSENT** (EXP-INT rows blank) |
| Meeting notes / emails / handwritten / weekly logs for INT-TFX | **ABSENT** as standalone artifacts |

**Contradictions:** none internal. One naming ambiguity preserved (not merged): "intumescent" = (a) the legacy 2022/2024 APP-based line, vs (b) the 2025 INT-TFX mineral-additive concept. Kept separate.

**What INT-TFX teaches the Organizational Learning corpus:** Fresco has a **second, very different process posture** — a *gate-first, define-before-experiment* discipline (mechanism lock, lever lock, anomaly gate) — the opposite of the plaster line's *trial-heavy, measure-light* posture. That contrast is exactly the kind of cross-family signal the engine needs — but with **0 executed trials and 0 production decisions**, INT-TFX adds episodes and a family, **not** production-decision evidence. Honest consequence: the production-decision gate will stay short of target on reality, not projection (§ ledger).
