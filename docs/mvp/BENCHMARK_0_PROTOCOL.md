# Benchmark 0 — Scientific Validation Protocol (pre-registration)

*Prepared 2026-06-26. The project crosses a line here: from **software engineering** to **scientific validation**. These are different disciplines with different standards of proof. This document pre-registers the test — hypotheses and pass/fail criteria stated **before** seeing real data — and reports honestly what is, and is not, verified today.*

## The distinction that matters

| Claim | Status | How established |
|---|---|---|
| Architecture (Law → check → breakdown → decisive experiment → successor) | **VERIFIED** | code, runs end-to-end |
| Implementation logic (the K→C→B→N→L loop behaves as specified) | **VERIFIED** | in-memory DoD simulations |
| **Instrument behaviour** (false-positive rate, sensitivity/resolution) | **VERIFIED** | `benchmark0.mjs`, measured below |
| **Scientific discovery on real data** (finds a *real, unknown-in-advance* Fresco boundary that holds up) | **UNVERIFIED** | requires real data — not yet run |

The last row is the only one that matters for the product thesis, and it is the one not yet established. Everything below is built to settle it — or to fail informatively.

## Two findings about the instrument (measured today, on synthetic controls)

These validate the *tool*, not the scientific claim. From `node mvp/validation/benchmark0.mjs`:

1. **False discovery is low but not zero.** With no boundary present, the detector stays silent (0.0% false positives) at low/moderate noise — the guards (sign-consistency ≥80%, bias >3σ, low-side-explained ≥80%) work. **But at high noise (σ=4) it invents a boundary ~1.7–2.5% of the time.** Non-zero. Therefore a single hit is *not* self-certifying; it must beat a per-dataset null (see permutation test).
2. **Resolution is coarse — this is the real limitation.** The detector reliably finds only *dramatic, cliff-like* breakdowns (effect ≳30 → 72–86% detection). Moderate boundaries (effect ≈19) are caught ~30% of the time; subtle ones (effect ≤12) are **invisible (~0%)**. **Plainly: a gradual or modest real Fresco boundary would be missed most of the time.** This is a stated blind spot, not a surprise to discover later.

> Implication for priorities: confounder control and fancier models are premature while the instrument's *power* is this limited on clean synthetic data. The first job is to learn whether the basic principle finds anything real.

## Pre-registered hypotheses & criteria (declare before looking)

- **H1 (rediscovery / retrodiction — Benchmark 0):** Given one real project with a boundary the team *already trusts* but which is **held out** from the engine, the engine rediscovers it.
  - **PASS iff:** breakdown on the correct feature, threshold within tolerance of the known boundary, **and** permutation-null `p < 0.05`.
  - **FAIL otherwise** — and a fail is logged with *which* assumption it implicates (linearity, density, effect size, confounding).
- **H0 (null discipline):** On a project with *no* expected boundary, the engine reports **no** surviving breakdown (`p ≥ 0.05`). A false alarm here is as informative as a miss.
- **H2 (prospective discovery — Benchmark 1, the real prize, later):** The engine proposes a boundary/decisive experiment for a region **no one has characterised**, that experiment is run, and it **confirms** the prediction. This is discovery; H1 is only rediscovery.

Stating these now is the point: it prevents moving the goalposts after seeing results.

## Why one project, one hit, is *not* proof (challenging the framing)

- **A single rediscovery can be luck or triviality.** Without the **null controls** above and the **permutation test** below, "it found the boundary" is unfalsifiable. The detector that always fires also "finds" every boundary.
- **Retrodiction ≠ discovery.** Rediscovering a *known* (held-out) boundary (H1) is necessary but retrospective. The scientific milestone is **prospective** (H2): predict an unknown boundary, then confirm it by experiment. Don't let a passed H1 be reported as discovery.
- **A "no" is a result.** If H1 fails, the harness says *why* (missed feature? failed the null? too sparse?), which directs the next model change. That is more valuable than a vague success.

## The rigorous gate: per-dataset permutation null

A real-data hit is credible only if it beats its own shuffled control. `run-on-real.mjs` shuffles the outcome (destroying any real input→outcome relationship), re-runs detection 300×, and computes `p = (1 + #{shuffles with bias ≥ observed}) / (301)`. This directly controls the ~2% false-discovery risk measured above, *per dataset*, with no distributional assumptions.

## How to run Benchmark 0 on real Fresco data

I cannot run this — the real data (e.g. טיח ת"א, INT-TFX, ISM-01) is not in any repository I can reach, and I will not fabricate data and call it a result. The step is yours:

1. Export ONE project as JSON (template: `mvp/validation/fresco-project.template.json`):
   ```json
   { "config": { "xKey": "app_pct", "yKey": "ttf_days",
                  "features": ["humidity_pct", "app_pct"],
                  "trueBoundary": { "feature": "humidity_pct", "threshold": 80 } },
     "experiments": [ { "id": "...", "app_pct": 28, "humidity_pct": 55, "ttf_days": 33 }, ... ] }
   ```
   - `xKey`: the input you believe drives the outcome. `yKey`: the measured outcome. `features`: candidates a boundary might live along. `trueBoundary`: the boundary you already trust — **held out** from detection, used only to grade.
2. `node mvp/validation/run-on-real.mjs your-project.json`
3. Read the verdict: rediscovered? does it beat the null? If both → H1 passes for that project.

### Self-test of the harness (synthetic template — NOT a scientific result)
```
# Benchmark 0 — fresco-project.template.json   (N=28)
law: ttf_days ≈ 0.89·app_pct + 8.2   (established on 20 consistent experiments)
🔥 breakdown: humidity_pct ≥ 78.5   bias 24.4, sign-consistency 100%
   permutation null: p = 0.0033 (0/300 shuffles matched)  -> SURVIVES the null ✓
HELD-OUT CHECK: true boundary humidity ≥ 80  ->  REDISCOVERED ✓ (off by 1.5)
VERDICT: Benchmark 0 PASSED — rediscovered a held-out boundary that beats its null.
```
This proves the *pipeline* runs and grades correctly on data with a known planted boundary. It proves **nothing** about real discovery — the numbers are synthetic and the boundary was planted by me.

## What changes after Benchmark 0

- **If H1 passes on ≥2 independent real projects** (and H0 stays clean): the basic principle is validated; *then* invest in confounder control → multivariate → nonlinear models, and design a prospective H2 trial.
- **If H1 fails:** stop adding capability. The harness names the failing assumption; fix that one thing and re-run. Building a more sophisticated engine on an unvalidated principle is the trap this protocol exists to prevent.

> Bottom line: the engines are built and the instrument is characterised (low-but-nonzero false discovery, coarse resolution). The next milestone is not a feature — it is a one-line scientific question answered on real data: **did MATRIYA rediscover a held-out Fresco boundary that beats its null?** Pass or fail, that is the most valuable result the project can now produce.
