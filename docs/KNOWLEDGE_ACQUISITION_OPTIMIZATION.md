# Knowledge Acquisition Optimization — PROTEUS's real objective function

*Prepared 2026-06-28. The realization: this is no longer a RAG system or a knowledge graph. It is a system that performs **Knowledge Acquisition Optimization** — it computes which action would most increase Fresco's scientific knowledge, and does that. Volume KPIs (episodes / families / production decisions) measure size; the real KPI is **Knowledge Gain**. Code in `mvp/knowledge-map/domains/knowledge-gain.mjs`, runs with `node gain-demo.mjs`.*

```
Knowledge Domain → Coverage → Density → Expected Knowledge Gain
                                              ↓
                                      Candidate Ranking
                                              ↓
                                    RECOMMEND  (PROTEUS)
                                              ↓
                                 ⛔ HUMAN APPROVAL  (every new Intake)
                                              ↓
                                         Extraction
                                              ↓
                                    Recalculate Domains  ──┐
                                              ↑            │
                                              └────────────┘  (the optimization loop)
```

> **Governance rule (hard constraint):** *PROTEUS may rank and recommend automatically. PROTEUS may not extract a new source without human approval.* Extraction changes the corpus and touches proprietary/sensitive sources (Drive, SharePoint, email, Priority), so the loop is **recalc → recommend → approve → extract → recalc** — never recalc → extract → recalc. `recommendNext()` returns a recommendation flagged `approvalRequired`; it never returns an action.

---

## 1. Knowledge Density — not "does the domain exist", but "how grounded is it"

Coverage says a domain is present. **Density** says how well-founded it is — measured data, product spread, volume → a **confidence** per domain (real numbers, post-GRANITAL):

| Domain | Evidence | Products | Episodes | Measured | Confidence |
|--------|:---:|:---:|:---:|:---:|:---:|
| Compression Strength | 9 | 1 | 5 | 4 | 0.63 |
| Density | 2 | 1 | 1 | 1 | 0.63 |
| Workability / Flow | 8 | 3 | 6 | 2 | 0.62 |
| Color / Shade | 7 | 1 | 4 | 3 | 0.57 |
| Adhesion | 6 | 2 | 6 | 0 | 0.35 |
| Fire Resistance | 5 | 1 | 4 | 1 | 0.32 |
| Water / Moisture | 4 | 2 | 4 | 0 | 0.30 |
| Granulometry | 2 | 2 | 2 | 0 | 0.25 |
| Set / Cure | 2 | 1 | 2 | 0 | 0.15 |

`confidence = 0.5·measured-ratio + 0.3·product-coverage + 0.2·volume`. So Adhesion is well-*covered* (6 episodes, 2 products) but low-*density* (0 measured → 0.35): we have a lot of qualitative adhesion notes and not one measurement. That gap is invisible to a coverage-only view.

---

## 2. Knowledge Gain — the new KPI (per extraction, not per document)

Every extraction earns a score for its **real** contribution:

| Contribution | Points |
|--------------|------:|
| Opens a new domain | **+10** |
| Adds a 2nd product to a single-product domain | **+6** |
| Adds measured data to a domain | **+5** |
| Adds a new product family | **+4** |
| Adds a production decision | **+3** |
| Adds a new episode (decision cycle) | **+2** |
| Adds a new material to the cross-product history | **+2** |
| Just more documents of a kind we already have | **+0** |

**Retro-scoring GRANITAL** (vs the state before it) = **Knowledge Gain 45**: `+10 opens Color · +4 new family · +5 measured Color · +5 measured Workability · +3 production decision · +10 episodes · +8 materials`. The gap-driven pick wasn't just "interesting" — it was the single highest-gain move available, because it opened an empty domain.

---

## 3. Expected Gain — PROTEUS chooses the next action

Before extracting, PROTEUS predicts each candidate's gain against the *current* registry and ranks by it:

```
gain  25  ROI  8.3  BETONIZE 2030          +6 2nd-product Color +3 production +10 episodes +6 materials
gain  22  ROI  7.3  PROTECH A1             +5 measured Workability +3 production +10 episodes +4 materials
gain  19  ROI 19.0  fire-retardant plaster +4 new family +6 2nd-product Fire +3 production +2 episode +4 materials
gain  11  ROI  5.5  F.SILICATO             +3 production +6 episodes +2 materials

▶ VERDICT: GO — extract BETONIZE 2030 (expected gain 25)
```

PROTEUS no longer asks "what's missing in product X." It asks **"which action increases Fresco's scientific knowledge the most"** — a stronger objective than "close the gate."

---

## Innovation — Knowledge ROI + Saturation detection

Two additions beyond the proposal:

- **Knowledge ROI = expected gain ÷ extraction effort.** Note the tension above: BETONIZE has the highest *gain* (25) but the **fire-retardant plaster has by far the highest *ROI* (19)** — it is thin/cheap yet opens a new family and a 2nd Fire source. So PROTEUS can optimize for *most knowledge* (gain) or *most knowledge per unit effort* (ROI) — a real strategic lever, not one fixed answer.
- **Saturation detection.** The acquisition loop has a stopping rule: when even the best candidate's expected gain falls below `SATURATION_GAIN = 8`, another extraction yields diminishing scientific value → **stop or switch focus.** This turns "keep extracting forever" into a bounded optimization with a terminal condition — the difference between hoarding documents and *optimizing knowledge*.

---

## The loop (what PROTEUS now runs)

```
1. build registry + density from current episodes
2. for each candidate, compute Expected Knowledge Gain (and ROI)
3. recommendNext → STOP if best gain < saturation, else RECOMMEND the best (approvalRequired)
4. ⛔ human approves the Intake
5. extract → add episodes → recalculate domains
6. go to 1
```

This is **Knowledge Acquisition Optimization**: a system whose core job is to maximize the rate at which the organization learns — *under human control of every new Intake*. Not RAG. Not a knowledge graph. A governed optimizer over Fresco's scientific knowledge.

### Where the loop stands now (after 8 extractions)

Domains Workability and Color are **Mature**; the promotion gate is **OPEN** (50 episodes · 5 families · 8 production decisions). The current recommendation:

```
gain 11  F.SILICATO              (silicate sibling — modest)
gain 11  CC TOP COAT             (2nd-tier color)
▶ RECOMMEND: F.SILICATO (expected gain 11) — PENDING HUMAN APPROVAL
```

But the honest highest-value gap is no longer on the scouted list: **Adhesion is the weakest-density domain (6 episodes, 0 measured → confidence 0.35).** The most valuable next Intake would be a **measured-adhesion source** (pull-off / cross-cut data) — which requires a *new scout*, itself a recommendation pending approval. PROTEUS surfaces this; the human decides.

## Status & next

- Built & runnable: `knowledge-gain.mjs` (Density · Gain · Expected Gain · ROI · saturation), `gain-demo.mjs`.
- Drives the extraction loop: current verdict = extract **BETONIZE** next (highest gain), with PROTECH and the fire-retardant plaster following; F.SILICATO last.
- Next (opt-in): wire `acquisitionVerdict` into the live PROTEUS retrieval/recommendation loop; per-domain target confidence (stop a domain at confidence ≥ X); decision-link density once episodes carry their decisions into the registry.

> PROTEUS's central role, stated plainly: **compute the action that most increases Fresco's scientific knowledge — then do it, until the marginal gain saturates.**
