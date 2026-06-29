# Opening the SharePoint connection — what only you/your admin can do

*Prepared 2026-06-29. I cannot open the SharePoint connection from inside this environment: it needs Azure credentials that are yours to create, and an egress-policy change that requires an administrator — and I will not bypass the proxy or disable TLS. Everything on the MATRIYA side is already built and tested (Scanner contract, Change Detector, Feed, snapshot store, the `liveChanges` wire, and `matriya changes sharepoint`). Two gates remain, both outside my control. Here is exactly how to open them.*

---

## Gate 1 — credentials (your Azure AD tenant)

Create an app registration and grant it read access to the SharePoint site:

1. **Azure Portal → Microsoft Entra ID (Azure AD) → App registrations → New registration.** Note the **Application (client) ID** and the **Directory (tenant) ID**.
2. **Certificates & secrets → New client secret.** Copy the secret value once (it is shown only once).
3. **API permissions → Add a permission → Microsoft Graph → Application permissions → `Sites.Read.All`** (read-only is enough). Then **Grant admin consent**.
4. Have the **site URL** of the SharePoint site to scan, e.g. `https://contoso.sharepoint.com/sites/RnD`.

Then set these four environment variables in the environment (via the Claude Code on the web environment settings — env vars are configured there; values are never logged or committed):

```
SHAREPOINT_TENANT_ID   = <Directory (tenant) ID>
SHAREPOINT_CLIENT_ID   = <Application (client) ID>
SHAREPOINT_CLIENT_SECRET = <the client secret value>
SHAREPOINT_SITE_URL    = https://<tenant>.sharepoint.com/sites/<site>
```

The adapter sends the secret only to `login.microsoftonline.com`, holds the token in memory, and never logs or persists it.

## Gate 2 — network egress policy (administrator)

Right now the environment's egress policy **denies `graph.microsoft.com`** (the proxy returns 403 on CONNECT). `login.microsoftonline.com` is already reachable, so only the Graph API host needs allow-listing. This is set when the environment is created and **cannot be changed from inside the session** — it requires whoever configured the environment's network policy. See the network-policy docs: https://code.claude.com/docs/en/claude-code-on-the-web

Allow-list at minimum:
```
graph.microsoft.com          (the Graph API — currently blocked)
login.microsoftonline.com    (the OAuth token endpoint — already reachable)
```

## When both gates are open — nothing else to do

Run:
```
matriya changes sharepoint
```
- First run → a **baseline** (every file reads NEW, flagged as a baseline, not a flood).
- Every run after → the **real delta** since the last scan: `NEW / UPDATED / DELETED`, persisted append-only.

No additional code is needed: the adapter's `scan()` already emits the normalized inventory, `liveChanges` feeds it into the append-only snapshot store, and the Change Feed + Knowledge Pipeline are unchanged.

## How to tell which gate is still closed

`matriya changes sharepoint` tells you precisely:
- `unavailable — not_configured` → Gate 1 (env vars) is still open work; it lists the exact vars.
- `unavailable — network_blocked` → Gate 1 is done, Gate 2 (the `graph.microsoft.com` allow-list) is still closed.
- a real feed → both gates are open.

It never fabricates a feed — if it can't reach the source, it says so.
