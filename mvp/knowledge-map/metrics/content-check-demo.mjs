// Content-Check (3 filters) + the intake seam that stops at REVIEW.
//   run: node content-check-demo.mjs
import { runContentTests, contentGateSummary } from './content-check.mjs';
import { intakeDocument, SAMPLE_DOC } from './intake.mjs';

console.log('\n═══ CONTENT CHECK — a validator of CLAIMS (3 single-responsibility filters) ═══\n');
console.log('  Measured Claim → Units → Baseline → Physical Constraints → REVIEW\n');
console.log('  classes: ACCEPT · REVIEW_OUTLIER · CONTRADICTS_EXISTING · INSUFFICIENT_BASELINE');
console.log('  HARD RULE: no auto-reject — every non-ACCEPT routes to HUMAN REVIEW.\n');

for (const r of runContentTests())
  console.log(`  ${r.pass ? '✓' : '✗'} ${r.label.padEnd(32)} → ${r.got.padEnd(22)} [units:${r.filters?.units} physics:${r.filters?.physics} baseline:${r.filters?.baseline}]`);

const g = contentGateSummary();
console.log(`\n  false claims all stopped (≠ACCEPT): ${g.falseStopped}  ·  no auto-reject anywhere: ${g.noAutoReject}  ·  ${g.classified}/${g.total}`);
console.log(`  PHYSICS caught beyond the baseline (impossible yet baseline couldn't judge): ${g.physicsCaughtBeyondBaseline}`);
console.log('    ↳ e.g. absorption 130%: baseline INSUFFICIENT, but physics says impossible → CONTRADICTS.');

console.log('\n═══ INTAKE SEAM — Document → Extraction → Claim → Content Check → REVIEW (stop) ═══\n');
const r = intakeDocument(SAMPLE_DOC);
console.log(`  document: "${r.document}"  → extracted ${r.extracted} measured claims`);
for (const [q, items] of Object.entries(r.queues))
  console.log(`    ${q.padEnd(22)} ${items.length}  ${items.map((x) => `${x.claim.asset.split(' ')[0]} ${x.claim.value}${x.claim.unit}`).join(' · ')}`);
console.log(`\n  downstream: ${r.downstream}`);
console.log(`  auto-created events: ${r.autoCreatedEvents}  ← REVIEW_OUTLIER is NOT a Knowledge Event; nothing flows past the seam without a human.\n`);
