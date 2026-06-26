---
description: CI Sweeper loop — diagnose and fix red CI until green (L2, max 3 attempts)
argument-hint: [run-id or branch]
---

You are running the **CI Sweeper** loop for matriya-frontend. This is **L2: cautious** —
push fixes to the working branch, NEVER auto-merge to `main`. Full spec: `loops/patterns/ci-sweeper.md`.

Target: $ARGUMENTS (a CI run id or branch; default to the current branch's latest run).

Loop, max **3 attempts**:
1. Read `loops/STATE.md` for context and known flakes.
2. Pull failing job logs via GitHub MCP (`actions_get`, `get_job_logs`).
3. Reproduce locally: `npm run build` and `CI=true npm test -- --watchAll=false`.
4. Form ONE hypothesis → make the SMALLEST fix → re-run the failing check.
5. If green → push, report, append a row to `loops/loop-run-log.md`, STOP.
6. If still red → increment attempt; try a DIFFERENT hypothesis.

Hard stops:
- After 3 attempts with no progress: write the diagnosis to `loops/STATE.md`, append the run log, ask the user.
- Budget ~80k tokens (`loops/loop-budget.md`).
- NEVER weaken/skip/delete tests to go green.
- CRA note: a CI-only failure is often `CI=true` turning ESLint warnings into errors — fix the warning, don't disable CI.
