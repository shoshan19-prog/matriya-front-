// Knowledge Demand (Phase 5.6) — how often the system NEEDED a knowledge and
// did NOT have it. This is completely different information from ΔKnowledge:
// an experiment may add little new knowledge, yet if the system is asked for it
// dozens of times, its OPERATIONAL value is very high.
//
// TRUE demand = a log of Router/PROTEUS MISSES (a query the incomplete asset
// could not answer). We don't have query telemetry yet, so demand here is a
// transparent PROXY from the corpus, clearly flagged, with a hook to inject real
// telemetry as it accrues.

import { ASSET_META } from '../assets/asset-meta.mjs';

/**
 * Proxy demand from corpus signals: an asset that the lab kept bumping into
 * (dead-ends, open frontier, decision-relevance) was implicitly "needed".
 * NOTE: this UNDER-counts truly-missing assets (no data → no recorded need),
 * which is exactly why real query telemetry must replace it.
 */
export function demandProxy(assets) {
  const reg = {};
  for (const a of assets) {
    const meta = ASSET_META[a.name] || { deadEnds: 0 };
    reg[a.name] = a.openQuestions + 3 * (meta.deadEnds || 0) + (a.patterns?.length || 0);
  }
  return reg;
}

/** Merge proxy demand with injected REAL telemetry (real overrides proxy). */
export function demandRegister(assets, realTelemetry = {}) {
  const proxy = demandProxy(assets);
  const reg = {};
  for (const name of Object.keys(proxy))
    reg[name] = { proxy: proxy[name], real: realTelemetry[name] ?? null, value: realTelemetry[name] ?? proxy[name],
      source: realTelemetry[name] != null ? 'telemetry' : 'proxy' };
  return reg;
}
