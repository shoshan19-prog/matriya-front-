# Knowledge Assets — MATRIYA's primary unit

*Prepared 2026-06-28. The architectural keystone: the primary unit is no longer the **Product**, the **Episode**, or the **Document** — it is the **Knowledge Asset**, the scientific knowledge itself. This separates the knowledge **sources** (Drive, SharePoint, Email, Priority, suppliers, papers) from the knowledge **content**. Once that separation exists, every new source becomes just another evidence supplier — the core never changes. This is what turns MATRIYA from a system *for Fresco* into a system extensible to any organization. Code in `mvp/knowledge-map/assets/`, runs with `node demo.mjs`.*

```
Raw Sources → Collectors → Normalizer → Identity → Episodes
     → KNOWLEDGE ASSETS → Domains → Patterns → PROTEUS
```

The product is no longer the center. The material is not the center. The document is not the center. **The scientific asset is the center**, and everything else either feeds it (sources/episodes) or reasons over it (patterns/PROTEUS).

---

## The unit

A Knowledge Asset rolls up everything known about one scientific property, across **all** products, and cleanly separates three things:

- **internal evidence** — what we actually have (real corpus numbers);
- **frontier** — the sub-dimensions still missing (honest gaps, never claimed as data);
- **external knowledge** — where the missing evidence could come from (ASTM / suppliers / papers).

A real card from `node mvp/knowledge-map/assets/demo.mjs`:

```
Knowledge Asset
────────────────────────────
Name:              Compression Strength
Category:          Mechanical
Evidence:          9   (measured 4)
Products:          1
Episodes:          5
Materials:         NHL, white cement
Confidence:        0.63
Knowledge Density: 0.63
Patterns:          OLH-5, OLH-8
Dead Ends:         1
Open Questions:    8
Expected Gain:     0.62
Frontier (missing): marine / sulfate environment · aging & durability · freeze–thaw · pull-off correlation · early vs 28-day kinetics
External Knowledge: ASTM C109 / EN 196-1, Sika / BASF admixtures, cement-chemistry papers
```

Numbers are **real** (the corpus has compression evidence only from MPZ). The proposal's "Evidence 52 / Products 7" is the destination; this is the honest current state. The frontier and external rows are the asset's *map of what it still needs and where to get it*.

---

## The full asset table (real, 8-product corpus)

| Asset | Category | Evid | Meas | Prod | Conf | DeadE | OpenQ | ExpGain |
|-------|----------|----:|----:|----:|----:|----:|----:|----:|
| Workability / Flow | Rheological | 28 | 10 | 5 | 0.78 | 3 | 4 | 0.45 |
| Color / Shade | Optical | 14 | 3 | 3 | 0.64 | 1 | 5 | 0.54 |
| Compression Strength | Mechanical | 9 | 4 | 1 | 0.63 | 1 | 8 | 0.62 |
| Fire Resistance | Protective | 9 | 2 | 3 | 0.62 | 1 | 6 | 0.55 |
| Water Resistance | Protective | 8 | 2 | 3 | 0.62 | 2 | 4 | 0.55 |
| Adhesion | Mechanical/Surface | 6 | 0 | 2 | 0.35 | 2 | 5 | **0.79** |
| Density | Mechanical | 4 | 2 | 2 | 0.75 | 0 | 2 | 0.31 |
| Granulometry | Granular | 2 | 0 | 2 | 0.25 | 0 | 2 | 0.61 |
| Set / Cure | Process | 2 | 0 | 1 | 0.15 | 0 | 3 | 0.75 |

---

## The Router changes — "which asset is incomplete?", not "where is a document?"

```
Compression Strength  (confidence 0.63)
  missing : marine/sulfate · aging · freeze–thaw · pull-off correlation · early-vs-28-day
  look in : ASTM C109 / EN 196-1 · Sika/BASF · papers   (across SharePoint · Drive · Priority · Gmail · scanned binders)
```

The Router no longer hunts documents. It asks **which Knowledge Asset is incomplete**, reads the asset's frontier, and searches *every* pipeline for only the evidence that would close *that* asset.

---

## PROTEUS changes — "Next Knowledge Asset", not "Next Product"

```
▶ ACQUIRE: Adhesion
  ↑ NEED: pull-off strength (MEASURED — none yet)
  ↑ EXPECTED GAIN: 0.79
  look in: ASTM D4541 (pull-off), EN 1542, adhesion-promoter suppliers
  — PENDING HUMAN APPROVAL (governance: recommend, don't auto-extract)
```

PROTEUS ranks **acquisition targets**, not products. It independently converges on **Adhesion** — the asset with 6 episodes but **0 measured data** (confidence 0.35) — the same weak point the domain-gap analysis flagged, now expressed as a knowledge-acquisition decision. Governance still holds: PROTEUS recommends; a human approves the Intake.

---

## Why this solves scale

When Fresco has 500 products, 80,000 documents, 300,000 emails, 40 staff — **the architecture does not change.** There are simply more evidence streams feeding the *same* Knowledge Assets. The asset count grows with science (new properties), not with paperwork. Separating knowledge from its sources is what makes the system scale-invariant and organization-agnostic.

---

## The architectural evolution (Phase 5 fixed now)

```
Phase 1   Document Memory          — index files
Phase 2   Product Memory           — product dossiers
Phase 3   Episode Memory           — decision cycles
Phase 4   Scientific Memory        — Knowledge Domains
Phase 5   KNOWLEDGE ASSETS         ← fixed here: the scientific asset is the unit
Phase 6   Scientific Laws          — promoted patterns (OLH → laws), under the gate
Phase 7   PROTEUS                  — Knowledge Acquisition Optimization
```

Phases 1–4 already exist in the codebase (intake → identity → episodes → domains); Phase 5 is now the explicit top-level unit (`assets/`); Phase 6 is the promotion protocol in the Organizational Learning Backlog (gate now OPEN); Phase 7 is the governed acquisition optimizer.

---

## Status & next

- Built & runnable: `asset-meta.mjs` (frontier + external + patterns + dead-ends per property), `knowledge-asset.mjs` (`buildKnowledgeAssets`, `assetGaps` router, `nextKnowledgeAsset` PROTEUS), `demo.mjs`.
- Sits on the real 8-product corpus; internal numbers real, frontier/external honest.
- Next (opt-in): persist assets; wire `assetGaps()` to fan out across live pipelines (SharePoint/Gmail/Priority/supplier portals); attach promoted Laws (Phase 6) to assets; let PROTEUS's `nextKnowledgeAsset` drive the governed recommend→approve→extract loop.

> The decision fixed here: **separate the knowledge from its sources.** From now on, a new source (Teams, Gmail, a scanned binder, a BASF datasheet) is just another evidence supplier for the same Knowledge Assets — the scientific core of MATRIYA stays invariant as the organization scales.
