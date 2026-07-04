---
name: good-morning
description: >
  MATRIYA Morning MRI. Trigger on "בוקר טוב" / "good morning" / "daily" / "MRI".
  Reads MATRIYA/System_State/** (the structural self-memory: Reality, Knowledge, Runtime,
  Integrations, Projects, Corpus, Decisions, Health + Strategic drift/momentum/readiness),
  re-checks ONLY what changed since the last stamp, updates the diffs, and prints a colored
  MRI board that reports not just WHAT changed but WHY IT MATTERS (the causal chain).
  Read-only by default. LAW-EVIDENCE-001: no board line exceeds its evidence (🟢/🟡/⚪).
---

# בוקר טוב — MATRIYA Morning MRI

## Procedure (read-only unless writes authorized)
1. **Load state:** read all `MATRIYA/System_State/**` layers.
2. **Differential probes — only what can have changed:**
   - Reality: `git -C <repo> rev-parse HEAD` + `git log <last>..HEAD` per repo (skip unchanged HEAD).
   - Runtime: probe Railway / Vercel / Supabase / workers if reachable, else keep UNKNOWN.
   - Integrations: env-key presence + reachability → status ∈ {Connected,Disconnected,Partial,Error,Unknown}.
   - Knowledge: re-count prod RAG docs; recompute KUR inputs + corpus health.
   - Corpus: Drive files with `modifiedTime > last_stamp`; new duplicates/entities/contradictions.
   - Projects: recompute knowledge %/missing/next action from new corpus.
3. **Update only the diffs**, stamp `last_run` (ask before writing unless auto-commit context).
4. **Strategic:** update Structural Drift (planned vs drift?), Knowledge Momentum (trend), Readiness Index.
5. **Print the MRI board** (below), then the **why-it-matters** chains, then **Highest-ROI Today**.

## Board format
```
MATRIYA — Morning MRI   <date>     (Δ since <last_run>)
──────────────────────────────────────────────
🟢/🟡/🔴 Reality      : changed repos <n>, new commits <n>, deploy <Δ|none>
🟢/🟡/🔴 Knowledge    : +<n> docs, +<n> experiments, Density +<x>%, KUR +<x>%
🟡/⚪   Runtime      : Railway/Vercel/Supabase <state>, Worker <state>
🟢     Corpus       : <n> dup, <n> new entities, <n> contradictions, <n> high-value
🟡     Projects     : <project: next-action> ...
🔴     Attention    : <integration/security issue> [priority]
Strategic:
   Drift            : <planned | DRIFT: ...>
   Momentum         : KUR <trend>  (Accelerating|Steady|STALLED)
   Readiness        : ingestion <p>% · demo <p>% · publication <p>%
⭐ Highest ROI Today : <asset/action>  (ΔK=<n>, Leverage=<n>)
──────────────────────────────────────────────
```

## Why-it-matters (mandatory — this is the point)
For each material change, print the causal chain, e.g.:
```
New fire report discovered
  → confidence of APP mechanism +6%
  → alternative-path ranking updated
  → experiment priority changed
```
Never report a raw delta without its downstream consequence.

## Guardrails
- READ-ONLY unless explicitly authorized. Never print secrets.
- Skip repos with unchanged HEAD (differential, not full scan).
- LAW-EVIDENCE-001: label every line 🟢VERIFIED / 🟡PARTIAL / ⚪UNKNOWN; projected ≤ observed.
- Decisions layer is authoritative: do NOT re-open a decision in `Decisions/decisions.json` (accepted/deprecated) unless the user reopens it.
