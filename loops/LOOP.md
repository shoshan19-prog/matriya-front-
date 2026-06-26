# LOOP.md — Loop Engineering for matriya-frontend

> **Loop engineering is replacing yourself as the person who prompts the agent.
> You design the system that does it instead.** — Addy Osmani, _Loop Engineering_ (June 2026)

A *loop* is a recursive goal: you define a purpose and an AI agent iterates until
the goal is met. This directory is the control plane for the loops that maintain
this React (Create React App) frontend.

---

## The 5 building blocks (+ memory)

| Block | What it is here |
|-------|-----------------|
| **Automations / Scheduling** | GitHub Actions `schedule:` triggers + Claude Code `/loop` commands |
| **Worktrees** | Isolated git worktrees so parallel loops never clobber each other |
| **Skills** | Project knowledge in `.claude/commands/` — reusable loop definitions |
| **Plugins & Connectors** | GitHub MCP for PR/CI/issue access |
| **Sub-agents** | Maker/checker splits — one agent fixes, another verifies |
| **State / Memory** | `STATE.md` is the durable spine that survives between runs |

---

## Active loops

| Pattern | File | Cadence | Autonomy | Cost |
|---------|------|---------|----------|------|
| Daily Triage | [patterns/daily-triage.md](patterns/daily-triage.md) | 1–2h / daily | L1 (report only) | Low |
| PR Babysitter | [patterns/pr-babysitter.md](patterns/pr-babysitter.md) | 5–15 min | L2 (assisted) | High |
| CI Sweeper | [patterns/ci-sweeper.md](patterns/ci-sweeper.md) | on CI failure | L2 (cautious) | Very high |

---

## Autonomy levels (phased rollout)

Always start a new loop at **L1** and only promote it after it earns trust.

- **L1 — Report.** Observes and writes findings. Changes nothing. Zero blast radius.
- **L2 — Assisted.** Proposes a concrete change (branch / draft PR / patch) for human approval. No auto-merge.
- **L3 — Unattended.** Acts and merges on its own inside a tight denylist. Narrow, reversible, well-tested tasks only.

---

## Non-negotiable guardrails

1. **Cost ceiling.** Every loop declares a token/run budget in [loop-budget.md](loop-budget.md). Over budget → stop and report.
2. **Measurable stop condition.** `npm run build` succeeds, `CI=true npm test` green, no new findings for 2 rounds. No vague goals.
3. **Human in the loop.** Nothing merges to `main` without review unless promoted to L3.
4. **Append-only audit trail.** Every run appends to [loop-run-log.md](loop-run-log.md).

---

## How to run a loop

```
/loop-daily-triage      # one-shot triage report (build + test + audit)
/loop-ci-sweeper        # diagnose + fix a failing CI run
/loop-pr-babysitter     # watch an open PR and respond
```

Scheduled variants: [.github/workflows](../.github/workflows).

---

_Inspired by Addy Osmani (https://addyosmani.com/blog/loop-engineering/) and
Boris Cherny: "I don't prompt Claude anymore. My job is to write loops."_
