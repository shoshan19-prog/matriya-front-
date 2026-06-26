# Pattern: CI Sweeper

**Cadence:** on CI failure · **Autonomy:** L2 (cautious) · **Cost:** Very high

## Goal (the recursive purpose)

When CI goes red, diagnose and fix it, looping until **CI is green** — then report.

## Stop condition

- ✅ CI passes → report the green status and stop (the report **is** the deliverable).
- 🛑 After **3 fix attempts** with no progress → stop, write the diagnosis to `STATE.md`, ask the human.
- 🛑 Failure is real but out of scope → report where you're stuck.

## What it does each round

1. Pull the failing job logs (GitHub MCP `get_job_logs` / `actions_get`).
2. Reproduce locally: `npm run build` and `CI=true npm test -- --watchAll=false`.
3. Form a hypothesis → make the **smallest** fix → re-run the failing check.
4. If green, push and report. If still red, increment attempt counter and re-diagnose (a different hypothesis).
5. Append every attempt to `loop-run-log.md` with the token cost.

## Guardrails

- L2: pushes fixes to the working branch; **no auto-merge** to `main`.
- Hard cap: **3 attempts per failure**, ~80k tokens/run (see `loop-budget.md`).
- Never make CI green by deleting/skipping/weakening tests — fix the underlying bug.
- Watch for CRA quirks: a build that fails CI but passes locally is often
  `CI=true` treating ESLint warnings as errors — fix the warning, don't disable CI.
