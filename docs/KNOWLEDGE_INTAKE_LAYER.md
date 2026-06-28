# Knowledge Intake Layer — source-agnostic Collector

*Prepared 2026-06-26. Implements the proposed architecture: never wire MATRIYA directly to SharePoint; put a read-only Collector in front that emits one normalized shape, so the knowledge engine is independent of the source and the source can be swapped (SharePoint → Drive → Dropbox → …) without touching the engine. Code in `mvp/intake/`, runs with `node demo.mjs`, zero deps.*

```
SharePoint ┐
Drive      ├─► Collector(adapter, READ-ONLY) ─► Normalizer ─► Product Classifier ─► MATRIYA Graph ─► PROTEUS
Dropbox …  ┘
```

## Why this shape (and one sharpening)

- **MATRIYA never depends on SharePoint.** It consumes `NormalizedDocument`s. Swap the adapter, the engine is unchanged.
- **Sharpening:** the normalized unit carries **provenance + `content_hash`** (`source.system`, `path`, `source_id`, `fetched_at`, hash). That makes intake **idempotent** (re-runs don't duplicate; only changed files re-ingest) and extends MATRIYA's audit/calibration discipline all the way back to the source. Intake without provenance would break the very thing MATRIYA exists to guarantee.

## The pieces (all built, runnable)

| Module | Role |
|---|---|
| `schema.mjs` | `NormalizedDocument` + `validate()` — the uniform unit every source maps to |
| `normalizer.mjs` | raw adapter item → `NormalizedDocument` (doc_type, field flags, versions, provenance) |
| `classifier.mjs` | assigns each doc to a product with confidence `VERIFIED/PARTIAL/UNVERIFIED`; `coverage()` + orphans |
| `adapters/sharepoint.mjs` | **READ-ONLY**, **env-only** (never reads secrets from chat, never prints them), Microsoft Graph; emits uniform raw items |
| `adapters/drive.mjs` | maps a Google-Drive (MCP) listing into the same raw-item shape |
| `demo.mjs` | runs Drive items **and** a SharePoint-shaped item through the **same** pipeline |

## The normalized document (shape)

```
doc_id            // stable hash of (source_system, source_id) — same file ⇒ same id across runs
source            // { system, site, path, source_id, web_url }
name, mime_type, size_bytes, doc_type
fields_present    // { composition, percentages, psd, water_powder, process, strength, dates }
versions          // batch/date markers if extractable
product           // { name, code, confidence: VERIFIED|PARTIAL|UNVERIFIED, evidence }
provenance        // { fetched_at, content_hash, collector }
```

## Classification rules (no invention)

- `VERIFIED` — a product name/code appears in the file **name**.
- `PARTIAL` — a product keyword appears only in the folder **path**.
- `UNVERIFIED` — no match → **orphan** (kept, not forced onto a product).
- The **most specific** keyword wins (longest match), so "טיח תל אביב תרמי" ≠ "טיח תל אביב".

## Proof (`node mvp/intake/demo.mjs`)

- 8 docs (7 Drive + 1 synthetic SharePoint), **0 invalid** against the schema.
- A Drive doc and a SharePoint doc come out with **identical structure** — the engine can't tell which source they're from.
- Coverage maps each to its product (`טיח תל אביב`, `טיח תל אביב תרמי`, `שליכט W100`, `שפכטל צמנטי`, `Primer`…), all `VERIFIED`.
- **3 orphans** correctly *not* forced onto a product.

## Honest findings from the run

1. **A real classifier bug was caught and fixed** — the thermal render was being swallowed by the base "טיח תל אביב" substring; now most-specific-match wins.
2. **Shared lab-test files orphan under name/path matching.** `בדיקת לחיצה.xlsx` — the file that holds the **missing strength response** — has no product name in its filename, so it can't be linked by name alone. These must be associated by **content** (the products named *inside* the sheet), not filename. This is the single most important intake gap, because it's where the response data lives.
3. **SharePoint adapter is built but not configured in this environment** (env vars unset → the demo used a synthetic SharePoint item). The moment the 4 env vars exist in *this* environment, the real adapter feeds identical raw items into the unchanged pipeline — no engine change.

## How it feeds MATRIYA Graph → PROTEUS

Each `NormalizedDocument` becomes nodes/edges in the law/evidence graph: the document is **evidence**, its `product` is the **association**, its `fields_present`/`versions` seed the **dossier**, and its `provenance.content_hash` gives the **idempotent, auditable lineage** the Law graph requires. PROTEUS (the reasoning/decision layer) then operates on the graph, never on raw SharePoint — exactly the decoupling this layer provides.

## Next (each opt-in)

- **Set the 4 SharePoint env vars in this environment** → run the real Collector (Inventory → product mapping → coverage → orphans) on actual SharePoint.
- **Content-level linker** for shared lab files (parse products named inside a sheet) → rescue the strength-bearing orphans.
- **Wire Collector output into the Law-graph evidence store** (the `POST /laws/.../evidence` path).
