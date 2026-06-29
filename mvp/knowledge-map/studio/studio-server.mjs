// STUDIO SERVER — a READ-ONLY endpoint for the Control Room.
//
//   GET /api/control-room   →   studioData() as JSON
//   GET /                    →   the control-room.html
//
// Read-only by construction: it has exactly these two GET routes, computes the
// data fresh on each request, and never writes, approves, or touches any ledger.
// No POST/PUT/DELETE exist. This is the live feed for the React tab's auto-refresh
// — and a safe way to test the UX without any production risk.
//
//   run: node studio/studio-server.mjs   (PORT env or 8787)

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { studioData } from './studio-data.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8787;

const server = createServer((req, res) => {
  // CORS for the CRA dev server; GET-only, so it can never mutate anything.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'GET') { res.writeHead(405, { 'Content-Type': 'text/plain' }); return res.end('read-only: GET only'); }

  if (req.url.startsWith('/api/control-room')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(studioData()));
  }
  if (req.url === '/' || req.url.startsWith('/control-room')) {
    try {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(readFileSync(`${here}/control-room.html`));
    } catch { res.writeHead(404); return res.end('build it first: matriya studio'); }
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found — try GET /api/control-room');
});

server.listen(PORT, () => {
  console.log(`MATRIYA studio server (READ-ONLY) → http://localhost:${PORT}`);
  console.log(`  GET /api/control-room   live studioData() JSON`);
  console.log(`  GET /                    the control room HTML`);
  console.log('  no write routes exist. Point the React tab here via REACT_APP_CONTROL_ROOM_URL.');
});
