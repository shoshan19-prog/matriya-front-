// SharePoint adapter — READ-ONLY Microsoft Graph ingest, behind matriya ingest.
//
// Connects ONLY through env vars; NEVER logs or stores secrets/tokens. Read-only
// (GET to Graph; the only POST is the OAuth token request to login.microsoftonline).
// App-only client-credentials flow (Sites.Read.All / Files.Read.All).
//
// This module is turnkey: the moment BOTH (a) the 4 SHAREPOINT_* env vars are
// present in this environment AND (b) the network policy allows graph.microsoft.com,
// `scan()` returns a real file inventory. Until then it returns a precise reason.

const ENV = () => ({
  tenant: process.env.SHAREPOINT_TENANT_ID,
  client: process.env.SHAREPOINT_CLIENT_ID,
  secret: process.env.SHAREPOINT_CLIENT_SECRET,
  site:   process.env.SHAREPOINT_SITE_URL,
});

const REQUIRED = ['SHAREPOINT_TENANT_ID', 'SHAREPOINT_CLIENT_ID', 'SHAREPOINT_CLIENT_SECRET', 'SHAREPOINT_SITE_URL'];

/** Are all 4 env vars present? (checks presence only — never reads values out) */
export function isConfigured() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  return { configured: missing.length === 0, missing };
}

// OAuth client-credentials token. The secret is sent to Microsoft only; never logged.
async function getToken() {
  const { tenant, client, secret } = ENV();
  const body = new URLSearchParams({
    client_id: client, client_secret: secret,
    scope: 'https://graph.microsoft.com/.default', grant_type: 'client_credentials',
  });
  const r = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body,
  });
  if (!r.ok) throw Object.assign(new Error('token_failed'), { kind: 'auth', status: r.status });
  const j = await r.json();
  return j.access_token; // held in memory only, never persisted/logged
}

// GET-only Graph call.
async function gget(token, url) {
  const r = await fetch(url.startsWith('http') ? url : `https://graph.microsoft.com/v1.0${url}`,
    { headers: { authorization: `Bearer ${token}` } });
  if (!r.ok) throw Object.assign(new Error('graph_error'), { kind: 'graph', status: r.status });
  return r.json();
}

// Parse SHAREPOINT_SITE_URL → { host, path } for the Graph site lookup.
function parseSite(siteUrl) {
  const u = new URL(siteUrl);
  return { host: u.hostname, path: u.pathname.replace(/\/$/, '') };
}

/** Read-only inventory of the SharePoint site (sites → drives → files). */
export async function scan({ maxFiles = 1000 } = {}) {
  const cfg = isConfigured();
  if (!cfg.configured) return { ok: false, reason: 'not_configured', missing: cfg.missing };
  try {
    const token = await getToken();
    const { host, path } = parseSite(ENV().site);
    const site = await gget(token, `/sites/${host}:${path}`);
    const drives = (await gget(token, `/sites/${site.id}/drives`)).value || [];
    const inventory = [];
    for (const d of drives) {
      const walk = async (itemUrl) => {
        const kids = (await gget(token, itemUrl)).value || [];
        for (const it of kids) {
          if (inventory.length >= maxFiles) return;
          if (it.folder) await walk(`/drives/${d.id}/items/${it.id}/children`);
          else inventory.push({
            source: 'sharepoint', drive: d.name, name: it.name, id: it.id,
            size: it.size, modified: it.lastModifiedDateTime, mime: it.file?.mimeType || null,
          });
        }
      };
      await walk(`/drives/${d.id}/root/children`);
    }
    return { ok: true, site: site.displayName, drives: drives.length, files: inventory.length, inventory };
  } catch (e) {
    // Map errors to a precise, non-sensitive reason (no secrets in the message).
    const reason = e.kind === 'auth' ? 'auth_failed'
      : (e.kind === 'graph' ? 'graph_error'
      : /403|ECONN|ENOTFOUND|fetch failed|CONNECT/i.test(e.message) ? 'network_blocked (graph.microsoft.com not allowed by policy)'
      : 'error');
    return { ok: false, reason, status: e.status || null };
  }
}

/** Human-readable status line for `matriya ingest sharepoint`. */
export async function status() {
  const cfg = isConfigured();
  if (!cfg.configured) return `not configured — set env: ${cfg.missing.join(', ')} (values never logged)`;
  const r = await scan({ maxFiles: 1 });
  if (r.ok) return `connected — site "${r.site}", ${r.drives} drive(s) reachable (read-only)`;
  return `configured, but ${r.reason}${r.status ? ' [' + r.status + ']' : ''}`;
}
