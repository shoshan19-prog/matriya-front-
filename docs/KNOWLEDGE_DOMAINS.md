# Knowledge Domains — the super-layer that inverts the index

*Prepared 2026-06-28. The most important thing the four reconstructions proved is not their numbers — it is **MATRIYA's maturity**: each product is now a development **story**, not a folder. That unlocks a bigger move. The next unit is no longer the **product** — it is the **Knowledge Domain** (Adhesion, Compression, Fire, Moisture…). טיח תל אביב / MPZ / INT-TFX / Thermal stop being products and become **evidence sources** for the same domains. Code in `mvp/knowledge-map/domains/`, runs with `node demo.mjs`, built from the REAL episodes.*

```
            BEFORE                              AFTER
    Documents → Episodes → Products      Knowledge Domains
                                                ↓
                                            Products
                                                ↓
                                            Episodes
                                                ↓
                                            Documents
```

The index is **inverted**: knowledge stops being organized around *what we made* and starts being organized around *what we learned.*

---

## The Knowledge Domain Registry (real numbers, from the 4 reconstructions)

`node mvp/knowledge-map/domains/demo.mjs` — every tag is traceable to a `docs/PRODUCT_STORY_*.md` episode; nothing is invented, so the numbers are honestly thin:

*Updated after 8 extractions + 2 retrieval iterations (Granulometry, then "more of the good and known"). Numbers are real.*

| Domain | Evidence | Products | Measured | Confidence | Status |
|--------|:--------:|:--------:|:--------:|:--------:|--------|
| Compression Strength | 15 | 3 | 7 | 0.94 | **Mature** · RETRIEVE_COMPLETE |
| Density | 10 | 5 | 5 | 0.93 | **Mature** · RETRIEVE_COMPLETE |
| Workability / Flow | 34 | 8 | 13 | 0.81 | **Mature** · RETRIEVE_COMPLETE |
| Granulometry / Fractions | 10 | 3 | 4 | 0.78 | Partial · RETRIEVE_COMPLETE |
| Color / Shade | 22 | 7 | 7 | 0.73 | Mature · *RETRIEVE_AVAILABLE* |
| Fire Resistance | 9 | 3 | 2 | 0.62 | Growing · EXTERNAL_ONLY |
| Water Resistance / Moisture | 8 | 3 | 2 | 0.62 | Growing · EXTERNAL_ONLY |
| **Adhesion** | 6 | 2 | **0** | **0.35** | *GENERATE_REQUIRED* |
| **Set / Cure** | 2 | 1 | **0** | **0.15** | *GENERATE_REQUIRED* |

**The RETRIEVE class is now nearly exhausted.** "More of the good and known" lifted Compression (2nd + 3rd real sources → 1-product Partial to **Mature 0.94**) and Density (**0.93**). What stays weak — **Adhesion and Set/Cure, both 0 measured** — is exactly the data that *does not exist* and must be **generated** by experiment (confirmed by the ROI scout). The knowledge frontier has shifted from retrieval to the lab.

*Evidence weight: `measured = 2 · qualitative = 1 · empty = 0`.* The aspirational "Mature" table from the proposal is now **partly real**: gap-/gain-driven extraction took Color from Empty → **Mature** (3 products, measured ΔE) and built Workability into the most-grounded domain (5 products, 10 measured). The standout remaining weakness is **Adhesion** — well-*covered* (6 episodes, 2 products) but **0 measured** → low density (see Knowledge Density in `KNOWLEDGE_ACQUISITION_OPTIMIZATION.md`); a *measured-adhesion* source is the next high-value target.

---

## PROTEUS re-oriented — from "what's missing in MPZ?" to "what do we know about strength?"

```
"What do we really know about Compression Strength?"   status: Partial (3 known gaps)
    MPZ            ██████████  9   (measured)
    טיח תל אביב    ·           0   (target only — fields empty)
    Thermal        □           0
    INT-TFX        □           0
  → the answer is no longer "ask MPZ" — it is "MPZ carries it, the others are gaps."
```

A product-only engine could only answer *"what's left to do on MPZ."* The domain engine answers the question Fresco actually cares about: **"what does the whole company know about compression strength, and where is the evidence?"**

---

## Material History — the life of a raw material, across all products

The same inversion applied to **materials**: collect a material across every product, year, trial, failure and decision → a history of the *material itself*, not the product.

```
vermiculite — 2 products, 2 appearances, +0 / −2
    טיח תל אביב   TLV-02   NEGATIVE   dropped — poor adhesion / drying
    Thermal       TH-01    NEGATIVE   drinks water, no flow, breaks
  ⇒ cross-product finding: vermiculite NEVER appears in a frozen success —
    every time it appeared, adhesion / flow failed.
```

That is a conclusion **no product file contains**, because it only exists *across* products. The registry also ranks materials by reach (NHL 2 products / 3 episodes; white cement strength-positive; pumice −2; …) — the seed of a true material knowledge base.

---

## The questions this unlocks

Questions a product-based engine **cannot** answer, and a domain/material-based one can:

- *"In all of Fresco's history, when did reducing water improve strength?"* → the Set/Cure + Compression domains (MPZ Dec-2025 vs April: **OLH-8**).
- *"Everywhere we used vermiculite, what happened to workability?"* → the material history above (always negative).
- *"Which materials always appeared before an adhesion failure?"* → cross-reference Adhesion-failure episodes with their material tags.

---

## How it sits on everything already built

```
Knowledge Domains      ← NEW super-layer ("what we learned")
      ↓
Products               ← the four PRODUCT_STORY reconstructions ("what we made")
      ↓
Episodes               ← decision cycles (Knowledge Episodes)
      ↓
Documents              ← the raw sources (Knowledge Source Map / Trust Engine)
```

The Organizational Learning Engine learns *how* Fresco decides; the Domain Registry organizes *what* Fresco knows. Together they turn the product dossiers into **Fresco's scientific knowledge map.**

---

## Honest caveats & next

- **Numbers are real and therefore thin.** 9 domains, most `Partial`/`Seed`, one empty. This is the true state after four products — growth comes from extracting more episodes, not from re-weighting.
- **Tags are hand-mapped from the reconstructions** (traceable to PRODUCT_STORY episodes). `DOMAIN_MARKERS` in `domains.mjs` is the path to auto-tagging episodes into domains; an LLM pass would do it at scale.
- **Empty ≠ absent evidence elsewhere.** A `0/empty` cell (e.g. Color) means *we have not recorded it*, which is a finding, not proof none exists.
- **Built & runnable:** `domains.mjs` (vocabulary + markers), `registry.mjs` (domain aggregation + material index), `demo.mjs` (on the real four products).
- **Next (opt-in):** a persisted Domain Registry that updates as each new product is reconstructed; per-domain maturity targets; wire `domainEvidence()` into PROTEUS so every recommendation cites domain evidence + gaps; auto-tag episodes via `DOMAIN_MARKERS`.

> Knowledge stops being organized around *what we produced* and starts being organized around *what we learned*. That is MATRIYA's next leap: from a system of product dossiers to **Fresco's scientific knowledge map.**
