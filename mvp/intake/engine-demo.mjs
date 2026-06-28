// Knowledge Identity Engine — evidence-chain + margin demo.
//   run:  node engine-demo.mjs
import { normalize } from './normalizer.mjs';
import { classify } from './classifier.mjs';
import { link } from './linker.mjs';

const meta = { system: 'sharepoint', site: 'Fresco', collector: 'demo', fetched_at: '2026-06-26' };
const run = (name, path, content) => link(classify(normalize({ source_id: name, name, path }, meta)), { content });

const cases = [
  ['Furnace_Report.pdf', 'Fire/Furnace_Report.pdf', 'INT-TFX-044 Version 044 Thickness=2000µm Operator Rachel 2024-03-11'],
  ['Brookfield.xlsx', 'Viscosity/Brookfield.xlsx', 'F.SILICATO נוסחה 9 צמיגות 30.09.2021 דוד'],
  ['review.pdf', 'docs/review.pdf', 'Survey mentions INT-TFX, W100, BETONIZE2030A — no single subject.'], // ambiguous → abstain
];

for (const [n, p, c] of cases) {
  const r = run(n, p, c).identity.resolved;
  console.log(`\n■ ${n}`);
  if (r.product) {
    console.log(`  → ${r.product}   confidence ${r.confidence} (support ${r.support})`);
    console.log('  evidence chain (why):');
    r.chain.forEach((l) => console.log(`     ✓ ${l.type}=${l.value}  authority ${l.authority}  [${l.signal}]`));
  } else if (r.abstain) {
    console.log(`  → ABSTAIN (margin rule) — ambiguous between ${r.ambiguous_between?.join(' / ')} → human review`);
  } else {
    console.log('  → orphan (no identifying entities)');
  }
}
console.log('\nThe score is a CHAIN of believed entities (authority-weighted), not one opaque number;');
console.log('and when two products compete too closely, the engine abstains instead of guessing.');
