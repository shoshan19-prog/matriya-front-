// Decision Value — Knowledge → Decision → Business Value.   run: node demo.mjs
// Makes MATRIYA a Decision-Intelligence system, not just Scientific Memory.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { BUSINESS_OBJECTIVES, businessImpactMap } from './business-impact.mjs';
import { buildDecisionPriorities, protocol } from './decision-value.mjs';
import { rdPlan } from '../strategy/priority.mjs';
import { backtestKnowledgeROI } from './decision-ledger.mjs';

const assets = buildKnowledgeAssets(REAL_EPISODES);

console.log('═══ BUSINESS IMPACT — same knowledge, different business value ═══\n');
console.log('  objective = "customer returns from cracking" (Quality+Customer weighted)\n');
const biz = businessImpactMap(assets.map((a) => a.name), BUSINESS_OBJECTIVES['customer-returns-cracking']);
console.log('  asset                          business impact');
for (const a of assets) console.log(`  ${a.name.padEnd(28)} ${biz[a.name]}`);
console.log('\n  → Adhesion tops because cracking → returns; Water/Salt-spray is lower THIS year.');

console.log('\n═══ PRIORITY = f(ΔK, Demand, BUSINESS IMPACT, Cost, Confidence Gap) ═══\n');
const rows = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking');
console.log('  Asset                  Mode      Event            ΔK    bizImpact  decValue  PRIORITY');
for (const r of rows)
  console.log(`  ${r.asset.padEnd(22)} ${r.mode.padEnd(8)} ${r.event.padEnd(16)} ${r.expectedDK.toFixed(2)}    ${r.businessImpact.toFixed(2)}      ${r.decisionValue.toFixed(2)}     ${r.priority}`);
const p = protocol(rows);
console.log(`\n  ▶ PROTEUS: Asset=${p.Asset} · Mode=${p.Mode} · Event=${p.Event} · ΔK=${p.ExpectedDK} · Business=${p.BusinessImpact} · DecisionValue=${p.DecisionValue} · Priority=${p.Priority}`);
console.log('    not "what teaches the most" — "what produces the most VALUE for the organization".');

console.log('\n═══ INNOVATION 2 — OBJECTIVE-CONDITIONED PLANNING (the R&D plan follows strategy) ═══\n');
for (const obj of Object.keys(BUSINESS_OBJECTIVES)) {
  const r = buildDecisionPriorities(REAL_EPISODES, obj);
  const plan = rdPlan(r, { budgetILS: 6000, labDays: 30 });
  console.log(`  objective "${obj}":`);
  console.log(`     ranked: ${r.slice(0, 3).map((x) => `${x.event}(biz ${x.businessImpact})`).join(' > ')}`);
  console.log(`     ₪6,000/30d portfolio → {${plan.chosen.map((x) => x.event).join(', ')}}`);
}
console.log('\n  The PORTFOLIO follows strategy: regulatory pulls in FIRE_CONE, sales pulls in COLOR_QUV.');
console.log('  Pull-Off stays #1 across all three — honestly, a cheap FIRST measurement of an unmeasured,');
console.log('  customer-critical property is robust under almost any strategy (4× the ΔK of an incremental');
console.log('  test, half the cost). Business steers the rest of the plan, not just the headline.');

console.log('\n═══ INNOVATION 1 — DECISION LEDGER BACKTEST (did knowledge actually change outcomes?) ═══\n');
console.log('  asset                    decisions  realized  regret  verdict');
for (const b of backtestKnowledgeROI())
  console.log(`  ${b.asset.padEnd(24)} ${String(b.decisions).padStart(6)}    ${String(b.realizedValue).padStart(6)}  ${String(b.regret).padStart(6)}  ${b.verdict}`);
console.log('\n  Adhesion shows a NEGATIVE regret: a decision made WITHOUT pull-off data caused returns →');
console.log('  the missing knowledge has proven business cost. That closes the loop knowledge⇄business.');

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Final chain: Sources → Episodes → Knowledge Events → Knowledge Assets →');
console.log('Transformations → Demand → DECISION VALUE → PROTEUS. The goal is not maximal');
console.log('knowledge but maximal DECISION QUALITY — MATRIYA becomes Decision Intelligence.');
