// The complete MATRIYA model: Reasoning Qualification + end-to-end chain + Law Gate.
//   run: node chain-demo.mjs
import { runReasoningTests } from './reasoning.mjs';
import { runChain, lawGate, SAMPLE_CASES } from './chain.mjs';

console.log('\n═══ ENHANCEMENT 1 — REASONING QUALIFICATION (4th authority, now active) ═══\n');
console.log('  judges the INFERENCE, not the evidence: does the conclusion follow?\n');
for (const r of runReasoningTests())
  console.log(`  ${r.pass ? '✓' : '✗'} [${r.got.padEnd(13)}] ${r.label}`);

console.log('\n═══ THE COMPLETE MODEL — a case end-to-end through every authority ═══\n');
for (const c of SAMPLE_CASES) {
  const r = runChain(c);
  console.log(`  • ${c.name}`);
  for (const t of r.trace) console.log(`      ${t.authority.padEnd(24)} ${String(t.verdict).padEnd(14)}`);
  console.log(`      ⇒ ${r.stoppedAt} — ${r.status}\n`);
}

console.log('═══ ENHANCEMENT 2 — LAW GATE (the capstone) ═══\n');
const g = lawGate();
for (const c of g.criteria) console.log(`  ${c.status === 'PASS' ? '✓' : '✗'} ${c.test.padEnd(42)} ${c.detail}`);
console.log(`\n  ⇒ ${g.verdict}`);
console.log(`  promote automatically: ${g.promote} — a green board makes a metric PROMOTABLE, never auto-promoted.`);
console.log('  the system never declares its own laws; it lays the whole auditable case in front of a human.\n');
