// Knowledge Strategy — PROTEUS as R&D manager.   run: node demo.mjs
// Retrieve vs Generate · Acquisition Cost Vector · Knowledge Demand (5.6) · Priority.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { COST_VECTORS } from './cost-vector.mjs';
import { demandRegister } from './demand.mjs';
import { buildPriorities, protocol, rdPlan } from './priority.mjs';

console.log('═══ THE STRUCTURAL RESULT — Knowledge Acquisition splits into two classes ═══\n');
console.log('  Knowledge Need → "can this knowledge already exist?"');
console.log('     YES → RETRIEVE  (document / archive search)   e.g. Granulometry (PSD archive)');
console.log('     NO  → GENERATE  (design & run an experiment)  e.g. Set/Cure (Vicat), Adhesion (Pull-off)');

console.log('\n═══ ACQUISITION COST VECTOR — cost is not one number ═══\n');
console.log('  event                   ₪       days  tech  equipment            external');
for (const [k, v] of Object.entries(COST_VECTORS))
  console.log(`  ${k.padEnd(22)} ${String(v.ils).padStart(6)}  ${String(v.days).padStart(4)}   ${v.technicians}    ${v.equipment.padEnd(20)} ${v.external ? 'YES' : 'no'}`);

console.log('\n═══ PHASE 5.6 — KNOWLEDGE DEMAND (how often we needed it and lacked it) ═══\n');
const assets = buildKnowledgeAssets(REAL_EPISODES);
const reg = demandRegister(assets);
console.log('  asset                          demand  source');
for (const a of assets) console.log(`  ${a.name.padEnd(28)} ${String(reg[a.name].value).padStart(5)}   ${reg[a.name].source}`);
console.log('\n  ⓘ demand here is a PROXY from corpus signals — it UNDER-counts truly-missing assets');
console.log('    (no data → no recorded need). Real demand = a log of Router/PROTEUS MISSES (telemetry).');

console.log('\n═══ PRIORITY = f(ΔK, Demand, Cost, Confidence Gap) — PROTEUS as R&D manager ═══\n');
const rows = buildPriorities(REAL_EPISODES);
console.log('  Asset                     Mode      Event              ΔK    demand  gap   cost   PRIORITY');
for (const r of rows)
  console.log(`  ${r.asset.padEnd(24)} ${r.mode.padEnd(8)} ${r.event.padEnd(18)} ${r.expectedDK.toFixed(2)}  ${String(r.demand).padStart(5)}  ${r.confGap.toFixed(2)}  ${r.costComposite.toFixed(2)}   ${r.priority}`);
const p = protocol(rows);
console.log(`\n  ▶ PROTEUS (4 fields): Asset=${p.Asset} · Mode=${p.Mode} · Event=${p.Event} · ExpectedΔK=${p.ExpectedDK} · Priority=${p.Priority}`);

console.log('\n═══ DEMAND CHANGES THE DECISION — inject real telemetry (illustrative) ═══\n');
const realDemand = { 'Adhesion': 42, 'Set / Cure': 35, 'Water Resistance / Moisture': 12, 'Fire Resistance': 8 };
const rows2 = buildPriorities(REAL_EPISODES, realDemand);
console.log('  with real Router-miss telemetry (Adhesion 42, Set/Cure 35, …):');
for (const r of rows2.slice(0, 4))
  console.log(`    ${r.asset.padEnd(24)} ${r.mode.padEnd(8)} ${r.event.padEnd(16)} demand ${String(r.demand).padStart(3)}  PRIORITY ${r.priority}`);
const p2 = protocol(rows2);
console.log(`  ▶ now top priority: ${p2.Asset} (${p2.Event}) — high DEMAND outweighs marginally cheaper events.`);
console.log('    An experiment that adds little NEW knowledge but is needed 42× has high operational value.');

console.log('\n═══ R&D PORTFOLIO under a budget + a free lab window ═══\n');
for (const scen of [{ budgetILS: 2000, labDays: 7 }, { budgetILS: 20000, labDays: 60 }]) {
  const plan = rdPlan(rows2, scen);
  console.log(`  budget ₪${scen.budgetILS}, lab window ${scen.labDays}d → run {${plan.chosen.map((r) => r.event).join(', ')}}`);
  console.log(`     spend ₪${plan.spendILS}, expected ΣΔK ≈ ${plan.expectedDKtotal}`);
}

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('PROTEUS no longer says "do Pull-off". It says: given THIS budget and THIS free');
console.log('lab week, run this PORTFOLIO — maximizing value (ΔK × demand × confidence-gap)');
console.log('per cost. MATRIYA stops acquiring knowledge and starts managing the knowledge strategy.');
