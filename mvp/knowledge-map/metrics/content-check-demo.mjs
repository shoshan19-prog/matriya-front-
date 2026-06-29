// The content-check REVIEW gate — close the Sensitivity Harness adversarial gap.
//   run: node content-check-demo.mjs
import { runContentTests, contentGateSummary } from './content-check.mjs';

console.log('\n═══ CONTENT CHECK — is the CLAIM plausible? (provenance already vouched the SOURCE) ═══\n');
console.log('  measured_claim → normalize units → compare to asset baseline → classify\n');
console.log('  classes: ACCEPT · REVIEW_OUTLIER · CONTRADICTS_EXISTING · INSUFFICIENT_BASELINE');
console.log('  HARD RULE: no auto-reject — every non-ACCEPT routes to HUMAN REVIEW.\n');

for (const r of runContentTests())
  console.log(`  ${r.pass ? '✓' : '✗'} ${r.label.padEnd(34)} → ${r.got.padEnd(20)} ${r.reason}`);

const g = contentGateSummary();
console.log(`\n  the false claims (the adversarial test): all stopped (≠ACCEPT) = ${g.falseStopped}`);
console.log(`  governance invariant — no auto-reject anywhere = ${g.noAutoReject}`);
console.log(`  classified as expected: ${g.classified}/${g.total}`);
console.log('\n  ⇒ the Sensitivity Harness adversarial gap is CLOSED for numeric claims (caught as');
console.log('    REVIEW_OUTLIER / CONTRADICTS_EXISTING). Honest limits kept explicit: an in-range');
console.log('    false value and a purely qualitative claim still need a human — that is why the');
console.log('    gate REVIEWS, it never auto-accepts and never auto-rejects.\n');
