// SharePoint Collector adapter — READ-ONLY, env-only, never prints/stores secrets.
// Reads SHAREPOINT_TENANT_ID / CLIENT_ID / CLIENT_SECRET / SHAREPOINT_SITE_URL from
// the environment (NOT from chat). Emits raw items in the uniform Collector shape;
// the Normalizer turns them into NormalizedDocuments identical to any other source.
//
// Returns: [{ source_id, name, path, mime_type, size_bytes, web_url }]
// Throws { code:'NOT_CONFIGURED' } if env vars are absent.

const env = (k) => process.env[k];

export function isConfigured() {
  return !!(env('SHAREPOINT_TENANT_ID') && env('SHAREPOINT_CLIENT_ID') && env('SHAREPOINT_CLIENT_SECRET') && env('SHAREPOINT_SITE_URL'));
}

async function token() {
  const r = await fetch(`https://login.microsoftonline.com/${env('SHAREPOINT_TENANT_ID')}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: env('SHAREPOINT_CLIENT_ID'), client_secret: env('SHAREPOINT_CLIENT_SECRET'), scope: 'https://graph.microsoft.com/.default' }),
  });
  const d = await r.json();
  if (!r.ok || !d.access_token) { const e = new Error(`Graph token failed (${r.status}: ${d.error || 'unknown'})`); e.code = 'TOKEN_FAILED'; throw e; } // note: never logs the secret
  return d.access_token;
}

const G = async (path, t) => { const r = await fetch('https://graph.microsoft.com/v1.0' + path, { headers: { Authorization: 'Bearer ' + t } });
  const d = await r.json(); if (!r.ok) throw new Error(`${r.status} ${JSON.stringify(d.error || d).slice(0, 140)}`); return d; };

export async function collect({ folder = null } = {}) {
  if (!isConfigured()) { const e = new Error('SharePoint env vars not set in this environment'); e.code = 'NOT_CONFIGURED'; throw e; }
  const t = await token();
  const u = new URL(env('SHAREPOINT_SITE_URL'));
  const site = await G(`/sites/${u.hostname}:/${u.pathname.replace(/^\/+/, '')}`, t);
  const drive = await G(`/sites/${site.id}/drive`, t);
  const start = folder ? `/drives/${drive.id}/root:/${folder.replace(/^\/+/, '')}:` : `/drives/${drive.id}/root`;
  const rootItem = await G(start + '?$select=id', t);

  const out = [];
  const walk = async (id, path) => {
    let next = `/drives/${drive.id}/items/${id}/children?$select=id,name,size,file,folder,webUrl,parentReference&$top=200`;
    while (next) {
      const page = await G(next, t);
      for (const it of page.value || []) {
        const p = (path ? path + '/' : '') + it.name;
        if (it.folder) await walk(it.id, p);
        else out.push({ source_id: it.id, name: it.name, path: p, mime_type: it.file?.mimeType || null, size_bytes: it.size ?? null, web_url: it.webUrl || null });
      }
      next = (page['@odata.nextLink'] || '').replace('https://graph.microsoft.com/v1.0', '') || null;
    }
  };
  await walk(rootItem.id, folder || '');
  return out;
}
