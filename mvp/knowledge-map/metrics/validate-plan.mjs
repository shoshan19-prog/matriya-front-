// The methodological experiment: independence, discrimination, compressibility.
//   run: node validate-plan.mjs
// Answers the question "does convergence prove the metrics measure the same thing?"

import { independenceMatrix, discrimination, promotionGate } from './discrimination.mjs';
import { compressibility, understandingCurve } from './compressibility.mjs';

console.log('═══ STEP 0 — are the three mechanisms even INDEPENDENT? ═══\n');
const im = independenceMatrix();
console.log('  top action per mechanism, across objectives:');
for (const r of im.rows) console.log(`    ${r.scenario.padEnd(26)} Business→${r.Business.padEnd(16)} Information→${r.Information.padEnd(16)} Gradient→${r.Gradient}`);
console.log('  pairwise agreement:');
for (const [k, v] of Object.entries(im.matrix)) console.log(`    ${k.padEnd(24)} ${v}`);
console.log('  ⇒');
for (const v of im.verdict) console.log(`    • ${v}`);

console.log('\n═══ STEP 1 — DISCRIMINATION (negative control: do they diverge where they should?) ═══\n');
const d = discrimination();
console.log(`  global most-business-critical : ${d.global.business}`);
console.log(`  global most-disordered (order): ${d.global.order}`);
console.log(`  diverge across objectives: ${d.divergeCount}/${d.ofN}`);
console.log(`  ⇒ ${d.note}`);

console.log('\n═══ STEP 2 — DECISION COMPRESSIBILITY (how few pieces explain a decision?) ═══\n');
const c = compressibility();
console.log('  decision                        total  minimal  ratio');
for (const r of c.rows)
  console.log(`  ${r.decision.padEnd(30)} ${String(r.total).padStart(5)}   ${r.minimal == null ? '  —' : String(r.minimal).padStart(3)}    ${r.ratio == null ? 'INCOMPRESSIBLE (evidence missing)' : r.ratio}`);
console.log(`  avg compressibility (explainable): ${c.avgCompressibility}  (lower = deeper understanding)`);
console.log(`  incompressible decisions: ${c.incompressible.join(', ')} — both the strength claim (no measurement exists)`);

console.log('\n═══ INNOVATION — UNDERSTANDING CURVE (rate of true understanding over time) ═══\n');
const u = understandingCurve();
console.log(`  compressibility over the timeline: ${u.points.map((p) => `${p.date}:${p.ratio}`).join(' → ')}`);
console.log(`  slope ${u.slope} ⇒ ${u.reading}`);
if (u.incompleteLate) console.log('  ⚠ the LATEST decisions are incompressible — the lab understood adhesion but NOT the load-bearing claim.');

console.log('\n═══ THE 2-D PROMOTION GATE (reproducibility × discrimination) ═══\n');
const g = promotionGate({ projectsConverged: 1, discriminationPassed: d.pass });
console.log(`  reproducibility (≥3 projects): ${g.reproducibility ? '✓' : '✗'}   discrimination (≥1 control): ${g.discrimination ? '✓' : '✗'}`);
console.log(`  ⇒ promote metric to architecture? ${g.promote ? 'YES' : 'NOT YET'} — need: ${g.need.join(', ')}`);

console.log('\n════════════════════════════════════════════════════════════════════════');
console.log('Honest conclusion: Information ≈ entropy-gradient are NOT independent (same formula);');
console.log('Business ⟂ Order ARE independent and discriminate (diverge across objectives & globally).');
console.log('So convergence is meaningful only between Business and Order — and they pass the negative');
console.log('control. Compressibility adds a new axis: TLV is understood on adhesion, NOT on strength.');
console.log('Still 2 positive projects short of promotion. No law declared.');
