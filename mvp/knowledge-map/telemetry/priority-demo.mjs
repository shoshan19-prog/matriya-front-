// Priority/ERP telemetry — cost stops being an estimate.   run: node priority-demo.mjs

import { recordFromPriority, realCostFromTelemetry, mergedCostVectors, applyRealCosts, experimentEvent } from './priority-telemetry.mjs';
import { COST_VECTORS } from '../strategy/cost-vector.mjs';
import { learningPrimitives, rankEventsByROI } from './../events/learning-primitives.mjs';
import { buildKnowledgeEvents } from '../events/event.mjs';
import { REAL_EPISODES } from '../domains/corpus.mjs';

// SAMPLE Priority/ERP feed — experiments ordered+finished with REAL cost/duration.
// Real ERP records replace this verbatim (same shapes). Marked SAMPLE.
const ERP = [
  { event: 'FIRST_PULL_OFF', asset: 'Adhesion', phase: 'finished', costILS: 1450, durationDays: 6, erp_doc: 'PR-2026-0412' },
  { event: 'FIRST_SET_TIME', asset: 'Set / Cure', phase: 'finished', costILS: 520, durationDays: 2, erp_doc: 'PR-2026-0413' },
  { event: 'SALT_SPRAY', asset: 'Water Resistance / Moisture', phase: 'finished', costILS: 21000, durationDays: 44, erp_doc: 'PR-2026-0388' },
  { event: 'SEM_AFTER_COMPRESSION', asset: 'Compression Strength', phase: 'finished', costILS: 2900, durationDays: 16, erp_doc: 'PR-2026-0401' },
];

let log = [];
recordFromPriority(() => log, (l) => { log = l; }, ERP);

console.log('═══ PRIORITY/ERP → TELEMETRY (Stage 2): record-only, behind ingest ═══\n');
console.log(`  ${log.length} experiment_generated events recorded (SAMPLE ERP feed).`);
console.log('  privacy-safe shape (ERP doc id HASHED, no secrets):');
console.log('   ', JSON.stringify(experimentEvent({ event: 'FIRST_PULL_OFF', asset: 'Adhesion', costILS: 1450, durationDays: 6, erp_doc: 'PR-2026-0412', ts: 1 })));

console.log('\n═══ ACQUISITION COST VECTOR — estimate → REAL ═══\n');
const real = realCostFromTelemetry(log);
const merged = mergedCostVectors(real);
console.log('  event                   estimate ₪/days   →   real ₪/days      source');
for (const k of Object.keys(COST_VECTORS)) {
  const e = COST_VECTORS[k], m = merged[k];
  const changed = m.source === 'telemetry';
  console.log(`  ${k.padEnd(22)} ₪${String(e.ils).padStart(6)}/${String(e.days).padStart(2)}d    →   ${changed ? '₪' + String(m.ils).padStart(6) + '/' + String(m.days).padStart(4) + 'd' : '   (no data yet)'}   ${m.source}${changed ? ' ✓' : ''}`);
}

console.log('\n═══ ROI recomputed on REAL cost (knowledge-per-shekel, now measured) ═══\n');
const prims = learningPrimitives(buildKnowledgeEvents(REAL_EPISODES));
const before = rankEventsByROI(prims);                       // estimated cost
const after = rankEventsByROI(prims, applyRealCosts(real));   // real cost
const bById = Object.fromEntries(before.map((r) => [r.name, r.roiPer1k]));
console.log('  event                   ROI(estimate) → ROI(real)   cost source');
for (const r of after) {
  const b = bById[r.name];
  const tag = real[r.name] ? 'telemetry ✓' : 'estimate';
  console.log(`  ${r.name.padEnd(22)} ${b.toFixed(3)}  →  ${r.roiPer1k.toFixed(3)}   ${tag}`);
}

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Cost is no longer an estimate. Priority/ERP records the real ₪ and days of each');
console.log('experiment (append-only, hashed, no secrets), and the Acquisition Cost Vector +');
console.log('ROI become exact — without changing ERP or any decision. Sources connect at ingest.');
