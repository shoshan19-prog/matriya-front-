# Pattern: Daily Triage

**Cadence:** every 1–2 hours, or once daily · **Autonomy:** L1 (report only) · **Cost:** Low

## Goal (the recursive purpose)

Keep a current picture of the frontend's health so nothing rots silently. The loop
observes; it does **not** change code.

## Stop condition

Done when it has produced a triage report covering the checks below and appended a row
to `loop-run-log.md`. One pass per run — no iteration.

## What it does each run

1. Read `STATE.md` (open items, suppressions) so it doesn't re-raise known issues.
2. Gather signal:
   - `npm run build` — does the production build succeed?
   - `CI=true npm test -- --watchAll=false` — do tests pass?
   - `git log --since="last run"` — what changed?
   - Open issues / PRs (via GitHub MCP) — anything stale (> 7 days)?
   - `npm audit` + `npm outdated` — security & dependency drift.
3. Triage into: 🔴 needs action · 🟡 watch · 🟢 healthy.
4. **Tag every finding with `[evidence_level]`** (VERIFIED / PARTIAL / UNVERIFIED) — see
   "Evidence level" in `../LOOP.md`. Severity and evidence are separate axes. For security
   findings, also note the dep class (runtime / dev / transitive / non-exploitable).
5. Write findings to `STATE.md` (Open items) and append to `loop-run-log.md`.
5. If nothing new, say so — silence is a valid, logged result.

## Guardrails

- L1 only: never edits code, never opens PRs.
- Budget: ~30k tokens/run (see `loop-budget.md`). Over budget → write partial + stop.
- Respect suppressions in `STATE.md`.

## Run it

```
/loop-daily-triage
```
Scheduled variant: `.github/workflows/loop-daily-triage.yml`.
