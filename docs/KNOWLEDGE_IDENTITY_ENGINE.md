# Knowledge Identity Engine

*Prepared 2026-06-26. Evolves the Identity Resolver into a shared engine, per the recommended order: **Authority Registry → Evidence Chain → Margin Rule → Human Feedback Learning → Calibration v2.** The same engine is meant to serve every component (MATRIYA, PROTEUS, Router, Search, RAG, Benchmark) and every source (SharePoint, Drive, Priority…). Code in `mvp/intake/`, runs with `node engine-demo.mjs` and `node calibration/harness.mjs`. No graph writes.*

```
Collector → Entity Extraction → Authority Registry → Evidence Chain → Identity Resolution (Margin) → Feedback → Knowledge Graph
```

## 1. Entity Authority Registry (`authority.mjs`)

Not every entity is equal — the engine asks *"which entity do I believe?"*, not just *"what did I find?"*.

| entity | authority | | entity | authority |
|---|--:|---|---|--:|
| formula_id | 0.99 | | version | 0.90 |
| batch_id | 0.98 | | date | 0.80 |
| experiment_id | 0.98 | | operator | 0.45 |
| lab_sample | 0.95 | | path | 0.35 |
| product_code | 0.95 | | name | 0.20 |

Authorities are **learned** over time from feedback (#4). This one table is the shared source of truth.

## 2. Evidence Chain (`identityResolver.renderChain`)

Confidence is no longer one opaque number — it is a chain of believed entities. From `node engine-demo.mjs`:

```
■ Furnace_Report.pdf  → טיח מעכב בעירה   confidence 0.999 (support 3.1)
   ✓ product_code=INT-TFX  authority 0.95  [content]
   ✓ version=v044          authority 0.90  [content]
   ✓ date=2024-03-11       authority 0.80  [content]
   ✓ operator=Rachel       authority 0.45  [content]
```

The user (and PROTEUS) sees **why** the score was given. Confidence = noisy-OR over the chain; *support* = Σ authorities (used by the margin rule).

## 3. Margin Rule (abstain when two products compete)

If the top two candidates have comparable **support**, the engine **abstains** → human review, rather than guess:

```
■ review.pdf → ABSTAIN — ambiguous between טיח מעכב בעירה / שליכט W100 → human review
```

Effect (calibration harness): **adversarial "mention-in-passing" false-link rate 0.25 → 0.** The price is some recall (1.0 → 0.81): genuinely ambiguous files (A02/A04, where two product codes each appear once) route to review instead of being guessed — the correct trade.

## 4. Human Feedback Learning (`feedback.mjs`)

After Rachel confirms ✓/✗, the engine doesn't just nudge a weight — it **attributes**: which entity type *helped*, which *misled*. From the harness:

```
product_code  helped 10  misled 0  → authority 0.95 → 0.97
date          helped 5   misled 0  → authority 0.80 → 0.90
version       helped 4   misled 0  → authority 0.90 → 0.95
operator      helped 1   misled 1  → authority 0.45 → 0.47
```

So the system learns, e.g., *date contributed many correct links* and *operator is a coin-flip* — and re-weights the registry toward each type's measured precision. *(Honest: on this fixture the residual errors are **ambiguity**, not authority, so re-weighting didn't move precision — feedback fixes authority errors, the margin rule fixes ambiguity errors. Different tools for different failures.)*

## 5. Calibration v2 (`calibration/`)

Recalibration maps raw→empirical (**ECE 0.1 → 0**), and the **risk-budgeted threshold** derives the auto-link cut: at target precision **0.95**, threshold = calibrated 1.0, **coverage 0.81** — i.e. 81% of true links can auto-link at 100% precision; the rest go to review. *Calibration v2 proper runs after enough real feedback accumulates.*

## Where it stands (calibration harness, 22-item fixture)

| | before (flat weights) | now (engine) |
|---|--:|--:|
| precision | 0.889 | **0.929** |
| false-link | 0.111 | **0.071** |
| adversarial false-link | 0.25 | **0.00** |
| calibration ECE | 0.136 | **0 (recalibrated)** |
| auto-link coverage @P=0.95 | 0 | **0.81** |

## The vision this realizes

The Identity Resolver is now a **Knowledge Identity Engine**: authority‑weighted, explainable (chains), self‑aware (abstains), and self‑improving (feedback). Any component — MATRIYA, PROTEUS, Router, Search, RAG, Benchmark — and any source can rely on the *same* identity substrate. The bottleneck was never file intake; it was **identity**, and identity is now measurable, explainable, and learnable.

## Decision (unchanged)

**No graph writes** until the synthetic fixture is replaced by **30–50 real human-labeled files** and the engine's precision/coverage clear the bar. Then: Content Extraction (real xlsx/PDF/OCR with per-entity provenance) → thresholded graph-write (`≥0.95 auto · 0.70–0.95 review · <0.70 orphan`).
