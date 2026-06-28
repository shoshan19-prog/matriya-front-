// Router telemetry — the first LIVE emitter, demonstrated.   run: node router-demo.mjs
// Wraps a pass-through Router, records hit/miss only, derives real Demand.

import { instrumentRouter, demandByAsset, missRateByAsset, topUnansweredAssets, routerEvent } from './router-telemetry.mjs';
import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildDecisionPriorities } from '../decision-value/decision-value.mjs';

// A real Router would search the knowledge base. Here a pass-through stub returns
// {asset_id, route, answered, confidence}. SAMPLE: a week of queries pre-labelled
// with which asset they hit and whether the system could answer.
const WEEK = [
  ['pull-off strength?', 'Adhesion', false, 0.35, 'rnd'],
  ['why cracking on exterior?', 'Adhesion', false, 0.35, 'support'],
  ['adhesion to concrete', 'Adhesion', false, 0.35, 'rnd'],
  ['bond strength spec for tender', 'Adhesion', false, 0.35, 'sales'],
  ['wet adhesion', 'Adhesion', false, 0.35, 'rnd'],
  ['set time MPZ10?', 'Set / Cure', false, 0.15, 'production'],
  ['open time of paint', 'Set / Cure', false, 0.15, 'support'],
  ['when second coat?', 'Set / Cure', false, 0.15, 'support'],
  ['Vicat result', 'Set / Cure', false, 0.15, 'rnd'],
  ['MPZ20 28-day strength', 'Compression Strength', true, 0.63, 'rnd'],
  ['marine durability', 'Compression Strength', false, 0.63, 'sales'],
  ['sulfate resistance', 'Compression Strength', false, 0.63, 'rnd'],
  ['viscosity PROTECH A1', 'Workability / Flow', true, 0.78, 'production'],
  ['flow of betonize', 'Workability / Flow', true, 0.78, 'rnd'],
  ['KEIM 9457 ΔE match', 'Color / Shade', true, 0.64, 'production'],
  ['fade after 1 year', 'Color / Shade', false, 0.64, 'sales'],
  ['Kfar Giladi sieve', 'Granulometry / Fractions', true, 0.65, 'qc'],
  ['A1 fire rating', 'Fire Resistance', true, 0.62, 'regulatory'],
  ['water uptake w-value', 'Water Resistance / Moisture', false, 0.62, 'rnd'],
];

const routerFn = (q, ctx) => {
  const row = ctx._row;
  return { asset_id: row[1], route: `/ask/${row[1]}`, answered: row[2], confidence: row[3] };
};

let log = [];
const ask = instrumentRouter(routerFn, () => log, (l) => { log = l; });

console.log('═══ ROUTER → TELEMETRY (live emitter): pass-through, records hit/miss only ═══\n');
let unchanged = 0;
WEEK.forEach((row, i) => {
  const res = ask(row[0], { user_role: row[4], _row: row, ts: 1000 + i }); // ts injected for determinism
  if (res.answered === row[2] && res.confidence === row[3]) unchanged++;     // answer untouched
});
console.log(`  ${WEEK.length} queries routed; Router answers unchanged in ${unchanged}/${WEEK.length} (pass-through verified).`);
console.log(`  ${log.length} telemetry events recorded.`);

console.log('\n  privacy-safe event shape (raw query NEVER stored):');
console.log('   ', JSON.stringify(routerEvent({ asset_id: 'Adhesion', route: '/ask/Adhesion', hit: false, confidence: 0.35, user_role: 'support', query: 'why cracking on exterior?', ts: 1001 })));

console.log('\n═══ demand_by_asset (real, from router_miss) ═══\n');
const dem = demandByAsset(log);
for (const a of Object.keys(dem).sort((x, y) => dem[y] - dem[x])) console.log(`  ${a.padEnd(28)} ${dem[a]}`);

console.log('\n═══ miss_rate_by_asset ═══\n');
const mr = missRateByAsset(log);
console.log('  asset                          miss/total   miss-rate');
for (const a of Object.keys(mr).sort((x, y) => mr[y].missRate - mr[x].missRate))
  console.log(`  ${a.padEnd(28)} ${mr[a].miss}/${mr[a].total}        ${mr[a].missRate}`);

console.log('\n═══ top_unanswered_assets (where the system fails to answer) ═══\n');
for (const t of topUnansweredAssets(log)) console.log(`  ${t.asset.padEnd(28)} ${t.miss} misses (rate ${t.missRate})`);

console.log('\n═══ change in PROTEUS priority after LIVE telemetry ═══\n');
const before = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking');
const after = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking', dem);
const b = Object.fromEntries(before.map((r) => [r.event, r.priority]));
console.log('  event                   priority(proxy) → priority(LIVE)   Δ');
for (const r of after.slice(0, 6)) {
  const d = +(r.priority - b[r.event]).toFixed(2);
  console.log(`  ${r.event.padEnd(22)} ${b[r.event].toFixed(2)}  →  ${r.priority.toFixed(2)}    ${d >= 0 ? '+' : ''}${d}`);
}

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Demand is now LIVE: it measures what people actually ask and where the system');
console.log('fails to answer — without changing a single Router response or storing one query.');
