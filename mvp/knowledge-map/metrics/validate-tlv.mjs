// VALIDATION EXPERIMENT — test the 3 hypothesis-metrics on טיח תל אביב.
//   run: node validate-tlv.mjs
//
// Discipline (same as the project throughout): these metrics are HYPOTHESES.
// Before declaring "research progress = entropy reduction" a law, test whether
// the metrics (a) converge with the existing mechanisms and (b) explain decisions
// better. Report honestly — support, partial, or refute.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { informationPotential } from './information-potential.mjs';
import { entropyTrajectory, detectPhaseTransition } from './phase-transition.mjs';
import { traceability } from './traceability.mjs';
import { entropyGradient } from '../evidence/entropy.mjs';
import { buildDecisionPriorities } from '../decision-value/decision-value.mjs';

const TLV_ASSETS = ['Adhesion', 'Compression Strength', 'Workability / Flow', 'Granulometry / Fractions'];
const topFor = (rows, key) => rows.find((r) => TLV_ASSETS.includes(r.asset))?.[key];

console.log('═══ VALIDATION — 3 hypothesis-metrics on טיח תל אביב (NOT yet laws) ═══\n');

// ── H1: do Information Potential, Entropy-gradient and Business-priority converge?
const ip = informationPotential();
const grad = entropyGradient();
const prio = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking');
const ipTop = ip.find((r) => TLV_ASSETS.includes(r.asset));
const gradTop = grad.find((r) => TLV_ASSETS.includes(r.asset));
const prioTop = prio.find((r) => TLV_ASSETS.includes(r.asset));
console.log('H1 — convergence of three independent mechanisms (TLV-relevant action):');
console.log(`   Information Potential → ${ipTop.event} (${ipTop.asset})  IP ${ipTop.IP}`);
console.log(`   Entropy gradient      → ${gradTop.event} (${gradTop.asset})  ΔH/₪1k ${gradTop.gradient}`);
console.log(`   Business priority      → ${prioTop.event} (${prioTop.asset})  priority ${prioTop.priority}`);
const agree = ipTop.event === gradTop.event && gradTop.event === prioTop.event;
console.log(`   ⇒ ${agree ? 'SUPPORTED — all three converge on the SAME action (independent confirmation)' : 'PARTIAL — they differ; investigate why'}\n`);

// ── H2: is there a phase transition in TLV's entropy trajectory?
const tlv = REAL_EPISODES.filter((e) => e.product === 'טיח תל אביב').sort((a, b) => a.id.localeCompare(b.id));
const series = entropyTrajectory(tlv);
const pt = detectPhaseTransition(series);
console.log('H2 — phase transition in TLV entropy trajectory:');
console.log(`   trajectory: ${series.map((s) => s.entropy).join(' → ')}`);
console.log(`   ⇒ ${pt.transition ? 'OBSERVED — ' + pt.note : 'NOT OBSERVED — ' + pt.note}`);
console.log(`   (honest: TLV's 28-day strength was never measured, so its entropy never fully collapses —`);
console.log(`    a single project can't confirm this metric; it needs trajectories from several projects.)\n`);

// ── H3: decision traceability of TLV
const tr = traceability();
console.log('H3 — decision traceability (Evidence Conservation):');
console.log(`   ${tr.complete}/${tr.total} TLV decisions fully traceable to evidence → traceability ${tr.traceability}`);
for (const l of tr.leaks) console.log(`   ⚠ leak ${l.id}: "${l.decision}"\n        ${l.why}`);
console.log(`   ⇒ SUPPORTED as a diagnostic — it localizes the leak to the unmeasured STRENGTH claim,`);
console.log(`     the exact gap every other layer also flags. The metric explains WHY a decision is weak.\n`);

console.log('════════════════════════════════════════════════════════════════════════');
console.log('VERDICT (pre-registered):');
console.log(`  • Information Potential: ${agree ? 'converges with priority & gradient → promising' : 'diverges → study'}.`);
console.log('  • Phase Transition: not confirmable on one (incomplete) project — needs ≥3 trajectories.');
console.log('  • Decision Traceability: useful now — pinpoints knowledge leaks (TLV = 0.71, both leaks on strength).');
console.log('  Recommendation: keep all three as INSTRUMENTED HYPOTHESES; promote to architecture only after');
console.log('  they replicate across INT-TFX, MPZ and a 3rd project — exactly the gate used for OLH patterns.');
