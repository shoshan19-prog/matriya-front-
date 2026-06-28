# Knowledge Intake OS — Identity Resolution before MATRIYA

*Prepared 2026-06-26. Evolves the intake layer per the key insight: the real bottleneck is **not document classification — it is Identity Resolution.** Most lab files name no product; they contain entities (version, experiment id, date, operator, formula id). So between Normalizer and MATRIYA we insert two layers — **Identity Resolver** and **Knowledge Linker** — that resolve identity from content/metadata/relationships, not filenames. Code in `mvp/intake/`, runs with `node demo-identity.mjs`, zero deps.*

```
Adapters → Collectors → Normalizers → Identity Resolver → Knowledge Linker → Evidence Graph → MATRIYA → PROTEUS
```

## The reframing (why this matters)

The orphan we found — `בדיקת לחיצה.xlsx` — is **the rule, not the exception**. `Brookfield.xlsx`, `תוצאות אש.pdf`, furnace photos, `SEM001.tif`: none names its product. So the question is not *"which product does the filename belong to"* (classification) but *"which entities appear inside this file, and which known product/version do they corroborate"* (**identity resolution**). Once this layer is strong, **almost any new source plugs in without touching MATRIYA or PROTEUS** — because everything becomes the same *resolved entity*, regardless of origin (SharePoint / Drive / Gmail / OneDrive / Teams / Dropbox / USB / a Windows folder).

## Five weighted signals (not the filename alone)

| Signal | Weight |
|---|---|
| file name | low (0.10) |
| folder path | medium (0.30) |
| document content | high (0.60) |
| metadata / OCR | high (0.60) |
| **existing relationships** (the graph) | **highest (0.90)** |

`entities.mjs` extracts typed entities (`version`, `product_code`, `experiment_id`, `date`, `operator`, `formula_id`, `measurement`) and tags each with the signal it came from. `identityResolver.mjs` maps entities to known products via the registry (existing relationships) and computes a **noisy‑OR confidence** over the independent signals that corroborate the same product — so multiple weak signals (folder + date + operator) add up, and one registry‑confirmed id dominates. `linker.mjs` attaches the result; an orphan becomes a confidence‑scored link **with its evidence**, never a hard guess.

## Proof (`node mvp/intake/demo-identity.mjs`)

Files that the filename‑classifier left as orphans, resolved from content/metadata:

| File | Resolved | Confidence | Because |
|---|---|---|---|
| `בדיקת לחיצה.xlsx` | MPZ hydraulic line | **0.99** | `MPZ15` + batch date `14.12.2025` (both registry‑confirmed) |
| `Furnace_Report.pdf` | טיח מעכב בעירה (`v044`, `INT‑TFX`) | **1.0** | version + product_code + date + operator all corroborate |
| `IMG_3421.jpg` | — *(stays orphan)* | 0 | found `v043` but **no product anchor** → honestly unresolved |
| `SEM001.tif` | — *(stays orphan)* | 0 | no identifying entities |

So PROTEUS no longer receives `Orphan`. It receives *"0.99, likely MPZ line, because code + batch‑date,"* **and** what genuinely cannot be resolved stays honestly unresolved — the system does not invent links.

## What PROTEUS now operates on

Not documents — **resolved entities**: products, versions, experiments, results, decisions, each with provenance and a confidence. MATRIYA stops "reading files" and starts reasoning over identified knowledge, independent of where it came from.

## Honest caveats (where this can still go wrong — design against it)

1. **Confidence must be CALIBRATED, or 0.99 is a vanity number.** A 0.93 link is only trustworthy if, measured over many resolved links, ~93% are actually correct. This needs the same discipline as VDI: human‑confirm a sample, measure precision per confidence band, recalibrate. *(The current noisy‑OR easily reaches ~1.0 from a few 0.9 signals — that is "very likely," not "certain," until calibrated.)*
2. **False‑link risk.** An entity id mentioned *in passing* (a comparison to another product) creates a wrong link. So low‑confidence links stay **CANDIDATE**, not asserted; high‑consequence merges route to a human (human‑on‑the‑loop).
3. **Content extraction is the real cost.** Resolving by content means parsing xlsx/PDF and **OCR** for images — each a failure mode. Provenance records *which signal produced each entity*, so a bad OCR is traceable and revocable.
4. **The registry IS the moat and the dependency.** The "existing relationships" signal (highest weight) is only as good as the graph. It bootstraps from name/path‑verified docs, then compounds — the flywheel.

## Build status

- Built & runnable: `entities.mjs`, `registry.mjs` (seed), `identityResolver.mjs`, `linker.mjs`, `demo-identity.mjs`. Plus the prior `schema/normalizer/classifier/adapters`.
- The SharePoint adapter is read‑only/env‑only and ready; identity resolution works **today** on Drive‑sourced content and on any future source identically.

## Next (opt‑in)

- **Calibration loop** for identity confidence (tie to the V‑layer / VDI discipline).
- **Real content extraction** wired into the Collector (xlsx/PDF/OCR) so `content` is populated for real files, not just the demo.
- **Feed resolved entities into the Law/Evidence graph** (`POST /laws/:id/evidence`) so identity, dossier, and law‑evolution share one substrate.
