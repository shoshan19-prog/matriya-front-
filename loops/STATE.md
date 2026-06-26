# STATE.md — Durable loop memory

> The spine that lives **outside** any single conversation. Loops read this at the
> start of a run and write it at the end.

_Last updated: 2026-06-26 (daily-triage run #1)_

---

## Open items (carried between runs)

> Append `- [ ] <item> — discovered <date> by <loop>`; check off when resolved.

- [ ] 🔴 `[VERIFIED count / UNVERIFIED exploitability]` `npm audit`: 64 vulnerabilities (1 critical, 22 high, 36 moderate, 5 low) — counts confirmed via `npm audit --json`; mostly react-scripts **transitive, dev-only** deps. **Action: classify runtime/dev/transitive/non-exploitable before any fix; never `audit fix --force` (breaks the build).** discovered 2026-06-26 by daily-triage
- [ ] 🟡 `[VERIFIED drift / UNVERIFIED impact]` react / react-dom 18.3.1 → 19.x available (major) — confirmed via `npm outdated`; migration impact not evaluated. discovered 2026-06-26 by daily-triage
- [x] 🟢 `[VERIFIED]` CI workflow added this session — confirmed GREEN on 18.x + 20.x (PR #1 checks) — 2026-06-26
- [x] 🟢 `[VERIFIED]` Lockfile drift (`yaml@2.9.0` missing) — reproduced in CI log, fixed by ci-sweeper, re-run green — 2026-06-26

---

## Known-good baseline

- **Build:** `npm run build` (react-scripts)
- **Test:** `CI=true npm test` (non-watch)
- **Last green commit:** `1de5b27` (CI green on Node 18 + 20, 2026-06-26)
- **Node:** see CI matrix (18 / 20)

> ⚠️ Local sandbox note: dependencies are not installed here and `npm ci` may be blocked
> in this sandbox, so `npm run build` / tests could not run locally. Trust GitHub Actions
> CI (ubuntu-latest) for the real build/test signal.

---

## Decisions & conventions the loops must respect

- Develop on branch `claude/<session>`; never push straight to `main`.
- Do not commit secrets; `.env` stays local (see `.env.example`).
- Do not "fix" tests by weakening assertions — fix the cause.
- Respect existing component structure under `src/`.

---

## Suppressions / known false positives

- _none yet_

---

## Hand-off notes

- **🧊 STABILIZATION MODE ACTIVE (from 2026-06-26)** — see `loops/STABILIZATION.md`. Freeze: no new features/adapters/v2/repos, no architecture changes unless a material defect. Allowed: passive PR watch, track PRs to merge, data collection into `loops/metrics.md`. Exit → produce "Loop Engineering v1 Validation Report".
- **PR #1 watch ACTIVE** under `loops/MONITORING-POLICY.md` — passive/conservative. Auto-fix only for infra (CI fail / merge conflict / lockfile drift / clear infra). Never merge, change app code, refactor, expand scope, or answer design comments on the user's behalf. Non-infra review requests → document + wait for human. Log every event.
- **Observation Layer v2 — PLANNED, BLOCKED.** Do NOT start until PR #1 is merged AND the system runs several days with no abnormal intervention. Goal: evolve the Loop mechanism from code-only monitoring into a general MATRIYA observation layer covering knowledge, documents, experiments, equipment, and projects (same control plane: STATE/run-log/budget/evidence_level).
