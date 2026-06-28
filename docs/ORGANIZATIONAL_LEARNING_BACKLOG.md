# Organizational Learning Backlog

*Prepared 2026-06-28. The Learning Pattern Engine is, today, a **HYPOTHESIS engine**, not a proven-pattern engine. Its real value is not that it found patterns — it is that it **refuses to promote a pattern before there is enough support**. That restraint is what separates "looks interesting" from "a proven organizational pattern." Until the corpus reaches evidential volume, the correct deliverable is this backlog: a register of organizational hypotheses awaiting evidence. Live ledger: `node mvp/knowledge-map/learning/backlog.mjs`.*

---

## Promotion gate — nothing is promoted until ALL three clear

*Updated after 8 gap-/gain-driven extractions (TLV · thermal · INT-TFX · MPZ · GRANITAL · fire-plaster · BETONIZE · PROTECH A1).*

```
episodes              [████████████████████]  50/30   ✓  CLEARED
product families      [████████████████████]   5/3    ✓  CLEARED
production decisions  [████████████████████]   8/5    ✓  CLEARED

VERDICT: GATE OPEN — promotion allowed per-hypothesis
```

**All three gates cleared — the gate is OPEN.** But opening the gate is a *precondition*, not a promotion: each hypothesis still needs its own ≥4 support, in ≥2 families, with a real effect size, and a human sign-off (the 5-step protocol below). Today every OLH is still `NEEDS_OWN_SUPPORT` — the closest is **OLH-8** (process > formula, 2 families). So the corpus is now large enough to *test* patterns; none is yet *proven*.

The gate is a **global precondition**: even a hypothesis that reached its own support threshold may not be promoted while the corpus as a whole is this thin. Numbers reflect only Episodes actually reconstructed — nothing is invented.

| Gate | Now | Target | Why |
|------|-----|--------|-----|
| Real episodes | 25 | **≥30** | enough decision cycles for a contrast to mean something |
| Product families | **3 ✓** | **≥3** | a pattern must hold *across* products, not in one |
| Production decisions | 3 | **≥5** | "success" must be anchored in real go-to-production calls |

**The cross-family gate cleared; the volume gates did not.** That is the honest outcome of extraction, and the reason the gate is three-dimensional: diversity alone is not enough.

---

## The waiting hypotheses (organizational, not material)

Each is an honest `HYPOTHESIS` — `BLOCKED_ON_VOLUME` until the gate opens, then `READY_TO_PROMOTE` only once its own support ≥ 4.

| ID | Hypothesis | Support now | Source | Note |
|----|-----------|:----------:|--------|------|
| **OLH-1** | Almost every raw-material change follows a fixed route: *Field failure → Meeting → Supplier change → Lab trial → Compression → Decision → Production* | 1 / 4 | engine | full path only in TLV; MPZ skips the field/meeting preamble |
| **OLH-2** | Skipping the SEM / microstructure step raises the re-trial probability | **0 / 4** | engine | **SEM is absent in ALL 4 families — Fresco essentially never runs SEM; untestable, and that absence is itself the finding** |
| **OLH-3** | Decisions that relied only on viscosity (no strength) often ended in another trial | 1 / 4 | expert | seen in the thermal variant; needs more cases |
| **OLH-4** | Combining field feedback + lab result before a formula change → higher success rate | 1 / 4 | expert | in TLV the measurement was empty — the lab side can't be confirmed |
| **OLH-5** | Number of trials until a formula freezes converges to a typical range | 2 / 4 | engine | TLV ~15 pilots + MPZ batch series → 2 points |
| **OLH-6** | A supplier change happens when QC (sieve / COA) shows inconsistent fractions | 1 / 4 | expert | צמיתות → כפר גלעדי (TLV); MPZ had no supplier-change episode |
| **OLH-7** | Skipping water-absorption characterization before choosing a lightweight aggregate → repeated failure | 1 / 4 | expert | the thermal-variant failure chain |
| **OLH-8** | Process control (water / curing) can dominate the strength result more than the formula | 1 / 4 | engine | **measured:** MPZ same formula, Dec-2025 beat April at every grade via water/curing — but one family only |
| **OLH-9** | Decisions are usually made *before* the response is measured (a "measurement-light" process) | 3 / 4 | engine | seen in 4/4 families (TLV empty · thermal density-only · INT-TFX empty · MPZ measured only from 2025) — descriptive, needs an outcome definition before promotion |

**OLH-2 is the sharpest reminder of the discipline:** after four families, the engine *still cannot test it* — there is not one SEM episode anywhere. A lesser system would "surface" it; this one marks it `support 0/4` and turns the absence into a finding: *SEM is not part of Fresco's process.* **OLH-8 is the first measured process insight** (MPZ strength recovered through water/curing, not formula) — promising, but one family, so still a hypothesis.

---

## Extraction results — projection met reality

All four products were reconstructed from the real Drive corpus (one doc each: `PRODUCT_STORY_*`). **Projection vs reality:**

| # | Product | Family | Proj ep / prod | **Real ep / prod** | Outcome |
|---|---------|--------|:---:|:---:|--------|
| 1 | טיח תל אביב | restoration plaster | 7 / 1 | **7 / 1** | on target |
| 2 | טיח תל אביב תרמי *(halted)* | restoration plaster | 7 / 0 | **7 / 0** | negative knowledge captured |
| 3 | INT-TFX | intumescent coating | 9 / 2 | **4 / 0** | **under** — Stage-0 dossier, 0 trials run |
| 4 | MPZ / cementitious | cementitious | 9 / 2 | **7 / 2** | real strength data ✓ |

```
projected total: 32 ep · 3 families · 5 prod   →   ACTUAL: 25 ep · 3 families · 3 prod
families CLEARED · episodes need 5 more · production decisions need 2 more → GATE STILL LOCKED
```

**What extraction taught us (the value of counting real, not planned):**
- **INT-TFX under-delivered.** It is a *locked Stage-0 dossier* — a fully defined product with **zero executed experiments and zero production decisions**. The projection assumed 9 ep / 2 prod; reality was 4 ep / 0 prod. Counting real episodes caught this; counting plans would have falsely "opened" the gate.
- **INT-TFX still earned its place** — it added the **third family** (intumescent coating) and revealed a *different process posture*: gate-first, define-before-experiment, the opposite of the plaster line's trial-heavy / measure-light style. That contrast is exactly the cross-family signal the engine needs.
- **MPZ is the strength breakthrough.** The only family with real 7/28-day compression data — and its lesson is a *process* one (**OLH-8**): the same formula passed or failed on water/curing control.
- **The thermal variant is pure Dead-End Memory** — a documented failure chain (vermiculite/perlite/pumice all drink water), 0 production decisions, exactly its intended role.

**To close the remaining gap (5 episodes, 2 production decisions):** extract a **second well-executed cementitious or plaster product with real go-to-production decisions** (INT-TFX cannot help until its INT-A/B/C trials are actually run). Volume — not method — is still the only thing between hypotheses and patterns.

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

- Built & runnable: `backlog.mjs` — the live evidence ledger (now holding the **real** post-extraction numbers) + 9-hypothesis register + actual-yield reconciliation (`node backlog.mjs`).
- Four products reconstructed (`docs/PRODUCT_STORY_TEL_AVIV_PLASTER.md`, `…_THERMAL.md`, `…_INT_TFX.md`, `…_MPZ_CEMENTITIOUS.md`). Families gate cleared (3/3); episodes 25/30 and production decisions 3/5 still short.
- Next step is **still not more code** — it is one more real-execution product with genuine production decisions to cross the 30 / 3 / 5 gate. When `node backlog.mjs` reports `GATE OPEN`, promotion begins under the protocol above.

> The deliverable today is restraint made measurable: every organizational insight is held as a hypothesis, with the exact evidential volume it is still waiting for. That is the difference between a system that *guesses* how Fresco works and one that will eventually *know*.
