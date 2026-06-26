# metrics.md — Loop Engineering v1 stabilization data (matriya-front-)

> **Data collection only.** During stabilization we record; we do not change behaviour
> based on these numbers until the Validation Report. Append events; recompute totals.
> Source of raw events: `loop-run-log.md`. Period start: **2026-06-26**.

## Metric definitions

| Metric | Definition |
|--------|------------|
| Loop runs | Count of loop executions (any loop) |
| Events | PR/CI/review events received |
| Automatic interventions | Fixes pushed by a loop (infra-only, per policy) |
| Human interventions | Actions a human had to take that the loop could not/was not allowed to |
| False positives | A finding raised that turned out not to be real/relevant |
| False negatives | A real problem the loop **failed** to detect |
| MTTD | Mean time from problem occurring to loop detecting it |
| MTTR | Mean time from detection to resolution |

## Running totals (recompute on each update)

| Metric | Value as of 2026-06-26 |
|--------|------------------------|
| Loop runs | 2 (daily-triage #1, ci-sweeper #1) |
| Events | 1 (CI failure) |
| Automatic interventions | 1 (lockfile fix) |
| Human interventions | 0 |
| False positives | 0 |
| False negatives | 0 |
| MTTD | ~immediate (CI failure surfaced on first run) |
| MTTR | ~5 min (CI red → fix pushed → green) |

## Event ledger (append one row per event)

| Date/UTC | Type | Detected by | Auto/Human | Detect→Resolve | FP/FN | Notes |
|----------|------|-------------|------------|----------------|-------|-------|
| 2026-06-26 ~18:43 | CI failure | ci-sweeper | Auto | ~5 min | neither | `npm ci` lockfile drift (`yaml@2.9.0` missing). Reproduced in CI log, fixed via `--package-lock-only`, re-run green 18.x+20.x. First real data point. |
