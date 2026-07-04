# MATRIYA — System State Layer (MRI)

Structural, evidence-gated memory of the whole MATRIYA / Fresco ecosystem, so every session
starts from **the same picture + a delta**, not a re-scan. Consumed by the `good-morning` skill,
which produces the **MATRIYA Morning MRI**.

## Layers
**Core (8):**
1. `Reality/` — what actually exists (repos, branches, services, deployments, capabilities, modules)
2. `Knowledge/` — KUR, corpus health, coverage, evidence, density, top assets, lost knowledge, flow
3. `Runtime/` — what is actually alive (Railway/Vercel/Supabase/workers/cron/queues/errors/latency)
4. `Integrations/` — every external system + status ∈ {Connected, Disconnected, Partial, Error, Unknown}
5. `Projects/` — per-project: status, knowledge %, documents, missing, next action
6. `Corpus/` — deltas: new/changed files, duplicates, contradictions, new entities/relations/experiments
7. `Decisions/` — accepted / rejected / pending / deprecated (so the same discussions don't recur)
8. `Health/` — MRI scores: overall, knowledge, runtime, integrations, projects, security, coverage, automation

**Strategic (3):**
9. `Strategic/structural_drift.json` — new repo/module/endpoint/integration or contract change → planned evolution vs drift?
10. `Strategic/knowledge_momentum.json` — rate of learning (KUR/Evidence/Events trend), not just size
11. `Strategic/readiness_index.json` — "ready for X?" per next step (ingestion / deploy / publication / demo)

## Rules
- **Evidence-gated (LAW-EVIDENCE-001):** every field carries 🟢VERIFIED / 🟡PARTIAL / ⚪UNKNOWN. No board line exceeds its evidence.
- **Differential:** the morning run re-checks only what can have changed (git HEAD, Drive modifiedTime, deploy hash, RAG count, sensor status); unchanged repos are skipped.
- **Why-it-matters:** the Morning MRI reports the causal chain of each change, not just the change.
- Seeded 2026-07-01 from the verified Knowledge Discovery audit; `deployments`/`runtime` live status is ⚪ until probed from the operating environment.
