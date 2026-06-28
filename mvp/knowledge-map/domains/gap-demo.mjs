// Domain-Gap Targeting — "choose the next extraction by gap, not by name".
// run: node gap-demo.mjs
//
// Prints (1) the live domain-gap ranking from the REAL registry, (2) the five
// target signals mapped to the domains they fill, and (3) how candidate products
// are scored. The candidate list is replaced by the read-only corpus SCOUT.

import { buildDomainRegistry } from './registry.mjs';
import { REAL_EPISODES } from './corpus.mjs';
import { domainGaps, SIGNAL_DOMAINS, selectNextExtraction } from './gap-targeting.mjs';

const registry = buildDomainRegistry(REAL_EPISODES);
const gaps = domainGaps(registry);

console.log('═══ 1. DOMAIN-GAP RANKING (where the knowledge map is weakest) ═══\n');
console.log('  Domain                         Status        Products  Episodes  GAP');
for (const g of gaps)
  console.log(`  ${g.domain.padEnd(30)} ${g.status.padEnd(13)} ${String(g.products).padStart(6)}   ${String(g.episodes).padStart(6)}    ${g.gap}`);
console.log('\n  GAP = how much the next product should aim to fill it (Empty=5, Seed=4, Partial=3,');
console.log('  +2 if only one product carries it). The next extraction targets the TOP rows.');

console.log('\n═══ 2. TARGET SIGNALS → domains they fill (current gap weight) ═══\n');
const gapOf = Object.fromEntries(gaps.map((g) => [g.domain, g.gap]));
for (const [sig, doms] of Object.entries(SIGNAL_DOMAINS)) {
  const detail = doms.length ? doms.map((d) => `${d} (+${gapOf[d] ?? 3})`).join(', ') : 'production-decision → gate bonus (+3)';
  console.log(`  ${sig.padEnd(20)} → ${detail}`);
}

console.log('\n═══ 3. CANDIDATE SCORING (mechanism; real candidates come from the SCOUT) ═══\n');
// EXAMPLE candidates — illustrative shapes only, NOT corpus-verified. The scout
// replaces these with real products + which of the 5 signals each truly carries.
const EXAMPLE = [
  { product: '«color-bearing product»', signals: { COLOR: true, PRODUCTION_DECISION: true }, richness: 'medium' },
  { product: '«2nd compression source»', signals: { COMPRESSION: true, WORKABILITY_FAIL: true }, richness: 'rich' },
  { product: '«2nd fire source»', signals: { FIRE: true }, richness: 'thin' },
];
const ranked = selectNextExtraction(EXAMPLE, gaps);
for (const r of ranked)
  console.log(`  ${String(r.score).padStart(5)}  ${r.product.padEnd(26)} fills: ${r.fills.join(', ')}  [${r.richness}]`);
console.log('\n  ⚠ EXAMPLE rows only. Run the scout, then score real candidates with the same call.');

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('A Color source is worth the most (that domain is EMPTY); a 2nd Fire or 2nd');
console.log('Compression source clears the single-product penalty. Extraction is now driven');
console.log('by the knowledge map\'s holes, not by the product catalogue.');
