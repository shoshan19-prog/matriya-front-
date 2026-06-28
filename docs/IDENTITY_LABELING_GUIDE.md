# Identity Labeling Guide — the one input that unblocks graph-write

*Prepared 2026-06-26. The Knowledge Identity Engine is built and measurable, but its numbers rest on a **synthetic** fixture. The single thing needed to make them real — and to decide whether we may write to the graph — is **30–50 human-labeled lab files** from Rachel. This is how to produce them.*

## What to do (Rachel)

1. Open `mvp/intake/calibration/LABELING_FORM.csv` (a template with 3 example rows).
2. Pick **30–50 representative lab files** — deliberately include the hard ones: shared test files (`בדיקת לחיצה.xlsx`, `Brookfield.xlsx`), furnace/fire reports, photos, SEM, and a few that mention more than one product.
3. Fill one row per file:

| column | meaning |
|---|---|
| `id` | any short unique tag (e.g. R01) |
| `file_name` | the file's name |
| `folder_path` | its folder (e.g. `בדיקות מעבדה`) |
| `content_snippet` | **the line(s) inside the file that carry identifiers** — product code, version, experiment id, batch, date, operator. (Until automatic extraction is wired, paste the key line; quote it if it has commas.) |
| `gold_product` | the **correct** product. **Leave EMPTY if the file truly belongs to no single product** (orphan). |
| `gold_version` | correct version if known, else empty |
| `gold_experiment` | correct experiment id if known, else empty |

4. Save the filled file as `mvp/intake/calibration/labeled-real.csv` (this name is **git-ignored** — real data never leaves the machine).

## What happens next (me)

```
node mvp/intake/calibration/harness.mjs
```
The harness auto-detects `labeled-real.csv` and runs the full measurement on **real** labels: precision, recall, false-link rate, calibration (ECE), feedback attribution, and the risk-budgeted auto-link threshold.

## The bar to clear before any graph-write

- **Calibration ECE low** (raw confidence ≈ true accuracy) — after recalibration.
- **Auto-link precision ≥ 0.95** at a usable coverage (the risk-budgeted threshold gives the cut).
- **Adversarial false-link ≈ 0** (the margin rule should hold on real mention-in-passing cases).

If those hold → we proceed to real Content Extraction and **thresholded graph-write** (`≥0.95 auto · 0.70–0.95 review · <0.70 orphan`). If they don't → the harness shows exactly *which entity type or which ambiguity* is the problem, and we fix that — not guess.

## Why only ~30–50

Enough to estimate per-confidence-band accuracy and per-entity-type reliability without over-burdening the lab. More is better for calibration, but 30–50 (with a fair share of hard/orphan/ambiguous cases) is the minimum that makes the numbers trustworthy.
