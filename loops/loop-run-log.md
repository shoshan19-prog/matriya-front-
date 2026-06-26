# loop-run-log.md — Execution history

> Append-only. Every loop run adds one row. Never edit or delete past rows — this is
> the audit trail. If a run capped its coverage (sampled, skipped, timed out), say so
> in **Notes** so a clean-looking row never hides incomplete work.

| Date | Loop | Autonomy | Outcome | Findings | Evidence | Actions | ~Tokens | Notes |
|------|------|----------|---------|----------|----------|---------|---------|-------|
| 2026-06-26 | daily-triage | L1 | ok | 3 | VERIFIED×1, mixed×2 | report only | ~12k | run #1. 64 npm-audit vulns (counts VERIFIED, exploitability UNVERIFIED, mostly dev-only transitive); react 18→19 (VERIFIED, impact UNVERIFIED); CI added. Deps not installed locally — CI is the real build/test signal. |
| 2026-06-26 | ci-sweeper | L2 | fixed | 1 | VERIFIED | pushed lockfile fix | ~10k | attempt 1/3. `npm ci` failed: "Missing: yaml@2.9.0 from lock file" — reproduced in CI log (VERIFIED). Pre-existing lockfile drift (tailwindcss transitive). Fixed via `npm install --package-lock-only`; CI re-run GREEN on 18.x+20.x. |
