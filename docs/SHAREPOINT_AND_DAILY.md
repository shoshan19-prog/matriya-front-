# SharePoint ingest + the daily knowledge pipeline

*Prepared 2026-06-29. Built turnkey: the read-only SharePoint adapter and the daily process (scan → understand → index → review). It cannot run live from this environment yet — for two independent, honest reasons — but the moment both are resolved it runs with one command, no code change.*

---

## Why it can't connect from here yet (the honest status)

| Check | Result |
|-------|--------|
| `SHAREPOINT_*` env vars (tenant/client/secret/site) | ❌ not set in this container |
| `login.microsoftonline.com` (OAuth token) | ✅ reachable (HTTP 200) |
| `graph.microsoft.com` (read SharePoint) | ❌ **blocked by the network policy** — proxy returns `403 to CONNECT (policy denial)` |

So there are **two independent blockers**: no credentials, **and** the environment's egress policy denies `graph.microsoft.com`. Neither can be worked around from inside the container (bypassing the proxy/TLS is forbidden). To enable:

1. Add the 4 env vars to **this** session's environment (app-only `Sites.Read.All` / `Files.Read.All`).
2. Choose a **network policy that allow-lists `graph.microsoft.com`** (Environment Settings → see code.claude.com/docs/en/claude-code-on-the-web).

The adapter detects each state precisely:
```
$ matriya ingest sharepoint
  live status: not configured — set env: SHAREPOINT_TENANT_ID, … (values never logged)
# once env is set but graph is still blocked:
  live status: configured, but network_blocked (graph.microsoft.com not allowed by policy)
# once both are resolved:
  live status: connected — site "Fresco R&D", 3 drive(s) reachable (read-only)
```

---

## The adapter — read-only, env-only, no secrets

`mvp/knowledge-map/adapters/sharepoint.mjs`:
- **App-only client-credentials** (the secret is sent to Microsoft only — never logged or stored; the access token lives in memory only).
- **Read-only:** only `GET` to Graph (sites → drives → files); the single `POST` is the OAuth token request.
- **Privacy:** errors are mapped to non-sensitive reasons (`not_configured` / `auth_failed` / `network_blocked` / `graph_error`); no secret or token ever appears in output.
- Connects **behind `ingest`** — it never touches engine logic.

---

## The daily process — scan → understand → index → review (governed)

`mvp/knowledge-map/pipeline.mjs`, run `matriya daily sharepoint` (or `matriya daily sample` to see it now):

```
DAILY  scan→understand→index→review
  scan:       5 files
  understand: 4 classified, 1 skipped · Adhesion 1, Water 1, Color 1, Set/Cure 1
  index:      4 staged candidate episodes (NOT committed)
  review:     phase 0.2→0.2
     Set / Cure: 0.15 → 0.44 (+0.29)  via Vicat set time MPZ.xlsx
     Adhesion:   0.35 → 0.55 (+0.20)  via Pull-off test report TLV render.xlsx
     Water:      0.62 → 0.69 (+0.07)  via Salt spray Q1 results.pdf
     Color:      0.73 → 0.75 (+0.02)  via Color spectro ΔE batch 204.xlsx
  ⛔ PENDING HUMAN REVIEW — nothing written to the corpus until you approve
```

- **scan** — pull a read-only inventory from the source adapter.
- **understand** — classify each file to a Knowledge Asset (test-type names first: a *Pull-off report* → Adhesion; *Vicat* → Set/Cure; *salt-spray* → Water; *ΔE/spectro* → Color), measured vs qualitative.
- **index** — STAGE candidate episodes (dry — nothing committed).
- **review** — show exactly what would change (which assets move, by how much, the phase delta) for sign-off.

**Governance:** the pipeline never writes to the corpus on its own. The review (ביקורת) is the gate — a human approves each staged item before it folds in. This is the same no-auto-action rule enforced everywhere.

The sample run shows the payoff: a SharePoint **Pull-off report** is exactly the measurement that closes the Adhesion `GENERATE_REQUIRED` gap (0.35 → 0.55) — the daily scan would surface it and present it for approval, instead of it sitting unseen in a folder.

---

## Scheduling the daily run (when connected)

`matriya daily sharepoint` is one command; schedule it (cron / CI / a Claude Code session hook) to run each morning. It emits a review report only — a human approves what folds in. (No scheduler is created here; that's an ops decision.)

## Status & next

- Built & runnable: `adapters/sharepoint.mjs` (read-only Graph), `pipeline.mjs` (scan→understand→index→review), wired into `matriya ingest sharepoint` and `matriya daily`.
- **Blocked live only by environment config** (creds + graph allow-list) — not by code. `matriya daily sample` demonstrates the full pipeline now.
- Next (when connected): run the live daily scan; route staged measured items through approval into `domains/corpus.mjs`; the same pipeline serves Drive and any future adapter unchanged.

> The connector and the daily scan → understand → index → review are built and governed. The only thing between them and live SharePoint data is two environment settings — credentials and a network-policy allow-list for `graph.microsoft.com`.
