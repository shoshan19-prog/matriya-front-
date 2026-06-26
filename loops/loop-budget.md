# loop-budget.md — Cost ceilings

> Loops can burn tokens fast. Each loop declares a **per-run** and **per-day** ceiling.
> A run that would exceed its ceiling must **stop and report**, not push through.

## Ceilings

| Loop | Per-run cap | Per-day cap | If exceeded |
|------|-------------|-------------|-------------|
| daily-triage | ~30k tokens | ~60k | Stop, write partial report to STATE.md |
| ci-sweeper | ~80k tokens | ~250k | Stop after 3 fix attempts; report diagnosis |
| pr-babysitter | ~40k / event | ~200k | Stop, ask the human via a PR comment |

## Cadence math (why caps matter)

A loop on a 15-minute cadence fires ~96×/day. Prefer the **longest cadence that
still meets the goal**, and prefer event-driven triggers (on PR / on CI failure)
over polling. React builds are CPU-heavy in CI — avoid running the CI Sweeper on a
fixed poll; let it trigger on failure only.

## Running spend

- _no spend recorded yet_
