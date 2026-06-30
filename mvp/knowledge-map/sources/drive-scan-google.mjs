// GOOGLE DRIVE SCANNER (CI) — the unattended, server-side scanner for the GitHub
// Action. Unlike the interactive MCP path, this calls the Google Drive REST API
// directly with the user's own OAuth refresh token (from CI secrets), so it runs
// headless on a GitHub runner with open internet. Read-only: it only LISTS files.
// Zero dependencies (Node 22 global fetch). Never logs secrets.

async function getAccessToken({ clientId, clientSecret, refreshToken }) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }),
  });
  if (!res.ok) throw new Error(`token endpoint ${res.status}`);
  return (await res.json()).access_token;
}

/** List non-folder Drive files modified since `since` (RFC3339). Returns a
 *  normalized inventory or an honest failure reason — never throws to the caller. */
export async function googleDriveScan({ clientId, clientSecret, refreshToken, since }) {
  const missing = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN']
    .filter((k) => !({ GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret, GOOGLE_REFRESH_TOKEN: refreshToken })[k]);
  if (missing.length) return { ok: false, reason: 'not_configured', missing };

  let token;
  try { token = await getAccessToken({ clientId, clientSecret, refreshToken }); }
  catch (e) { return { ok: false, reason: 'auth_failed', detail: String(e.message) }; }

  const q = `mimeType != 'application/vnd.google-apps.folder' and modifiedTime > '${since}'`;
  const fields = 'nextPageToken,files(id,name,modifiedTime,size,mimeType)';
  const inventory = [];
  let pageToken;
  try {
    do {
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}`
        + `&fields=${encodeURIComponent(fields)}&pageSize=100&orderBy=modifiedTime desc`
        + (pageToken ? `&pageToken=${pageToken}` : '');
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) return { ok: false, reason: 'drive_error', status: r.status };
      const j = await r.json();
      for (const f of j.files || [])
        inventory.push({ source: 'drive', id: f.id, name: f.name, modified: f.modifiedTime, size: Number(f.size || 0) });
      pageToken = j.nextPageToken;
    } while (pageToken);
  } catch (e) { return { ok: false, reason: 'network', detail: String(e.message) }; }

  return { ok: true, inventory };
}
