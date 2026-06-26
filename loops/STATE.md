# STATE.md — Durable loop memory

> The spine that lives **outside** any single conversation. Loops read this at the
> start of a run and write it at the end.

_Last updated: 2026-06-26 (daily-triage run #1)_

---

## Open items (carried between runs)

> Append `- [ ] <item> — discovered <date> by <loop>`; check off when resolved.

- [ ] 🔴 `npm audit`: 64 vulnerabilities (1 critical, 22 high, 36 moderate, 5 low) — discovered 2026-06-26 by daily-triage. Mostly react-scripts transitive deps; triage carefully (CRA audit noise is common — don't blindly `audit fix --force`, it can break the build).
- [ ] 🟡 react / react-dom 18.3.1 → 19.x available (major) — discovered 2026-06-26 by daily-triage
- [ ] 🟢 CI workflow added this session — confirm it goes green on first run — discovered 2026-06-26 by daily-triage

---

## Known-good baseline

- **Build:** `npm run build` (react-scripts)
- **Test:** `CI=true npm test` (non-watch)
- **Last green commit:** _(not yet confirmed — CI just added)_
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

- _none yet_
