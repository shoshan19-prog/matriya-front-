// Router → telemetry emitter (the FIRST live signal). RECORD ONLY, pass-through.
//
// Approved scope: this emitter may record ONLY router_hit / router_miss.
// Boundaries: append-only · no auto-extract · no auto-generate · no graph write ·
// NO change to the Router's answer · no secrets · NO full query text.
// Stored per event (privacy-safe): timestamp, asset_id, route, hit/miss,
// confidence, anonymized_query_hash, user_role. The raw query is HMAC-hashed and
// then discarded — it is never persisted.

import { createHmac } from 'node:crypto';
import { appendEvent } from './telemetry.mjs';

const ROUTER_EVENTS = ['router_hit', 'router_miss'];
// salt comes from the environment and is NEVER written into an event.
const SALT = process.env.MATRIYA_TELEMETRY_SALT || 'dev-salt-not-for-prod';

/** One-way, salted hash of a query — anonymization, not storage. */
export function anonymizeQuery(query, salt = SALT) {
  return createHmac('sha256', salt).update(String(query ?? '')).digest('hex').slice(0, 16);
}

/** Build the privacy-safe event. Full query text is intentionally absent. */
export function routerEvent({ asset_id, route, hit, confidence, user_role, query, ts }) {
  return {
    type: hit ? 'router_hit' : 'router_miss',
    ts: ts ?? Date.now(),
    asset: asset_id,
    route: route ?? null,
    hit: !!hit,
    confidence: confidence ?? null,
    anonymized_query_hash: anonymizeQuery(query),
    user_role: user_role ?? null,
    // (no `query` field — raw text is never stored, sensitive or not)
  };
}

/**
 * Wrap a Router. The wrapper returns routerFn's answer UNCHANGED and only records
 * a hit/miss event on the side. Telemetry failures are swallowed so the recorder
 * can never affect the Router path. getLog/setLog hold the append-only log.
 */
export function instrumentRouter(routerFn, getLog, setLog) {
  return function instrumented(query, ctx = {}) {
    const res = routerFn(query, ctx);                 // ← the Router answer, untouched
    try {
      const ev = routerEvent({
        asset_id: res.asset_id, route: res.route, hit: res.answered,
        confidence: res.confidence, user_role: ctx.user_role, query, ts: ctx.ts,
      });
      if (!ROUTER_EVENTS.includes(ev.type)) throw new Error('router emitter restricted to hit/miss');
      setLog(appendEvent(getLog(), ev.type, ev));     // append-only
    } catch { /* telemetry must never affect routing */ }
    return res;                                       // ← returned unchanged
  };
}

// ── Required outputs ─────────────────────────────────────────────────────────
export function demandByAsset(log) {
  const d = {};
  for (const e of log) if (e.type === 'router_miss') d[e.asset] = (d[e.asset] || 0) + 1;
  return d;
}

export function missRateByAsset(log) {
  const m = {}, h = {};
  for (const e of log) {
    if (e.type === 'router_miss') m[e.asset] = (m[e.asset] || 0) + 1;
    if (e.type === 'router_hit') h[e.asset] = (h[e.asset] || 0) + 1;
  }
  const out = {};
  for (const a of new Set([...Object.keys(m), ...Object.keys(h)])) {
    const miss = m[a] || 0, hit = h[a] || 0;
    out[a] = { miss, hit, total: miss + hit, missRate: +(miss / (miss + hit)).toFixed(2) };
  }
  return out;
}

export function topUnansweredAssets(log, n = 5) {
  const r = missRateByAsset(log);
  return Object.entries(r).map(([asset, v]) => ({ asset, ...v }))
    .sort((a, b) => b.miss - a.miss || b.missRate - a.missRate).slice(0, n);
}
