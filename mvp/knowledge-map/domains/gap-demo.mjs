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

console.log('\n═══ 3. REAL CANDIDATES (from the read-only corpus scout) → ranked ═══\n');
// VERIFIED by the scout (read directly). Signal strength: measured vs qualitative.
const CANDIDATES = [
  { product: 'GRANITAL (silicate paint)',  signals: { COLOR: 'measured', PRODUCTION_DECISION: true }, richness: 'rich',
    note: 'Spectro Calculation.xlsx — real ΔE/L* colorimetry (the only true color data in Drive)' },
  { product: 'BETONIZE 2030-A',            signals: { COLOR: 'qualitative', WORKABILITY_FAIL: 'qualitative', PRODUCTION_DECISION: true }, richness: 'rich',
    note: 'floating-pigment + shade-match episode; viscosity fix; formulas 187/188 final' },
  { product: 'PROTECH A1',                 signals: { WORKABILITY_FAIL: 'measured', PRODUCTION_DECISION: true }, richness: 'rich',
    note: 'foam/separation → raise antifoam → formula 162 final (clean fail→fix arc)' },
  { product: 'F.SILICATO',                 signals: { WORKABILITY_FAIL: 'qualitative', PRODUCTION_DECISION: true }, richness: 'medium',
    note: 'low-viscosity fix' },
  { product: 'טיח מעכב בעירה (fire-retardant)', signals: { FIRE: 'qualitative', PRODUCTION_DECISION: true }, richness: 'thin',
    note: '2nd fire source — burner tests, but no own folder; likely too thin alone' },
];
const ranked = selectNextExtraction(CANDIDATES, gaps);
for (const r of ranked) {
  const c = CANDIDATES.find((x) => x.product === r.product);
  console.log(`  ${String(r.score).padStart(5)}  ${r.product.padEnd(30)} [${r.richness}]`);
  console.log(`         fills: ${r.fills.join(', ')}`);
  console.log(`         ↳ ${c.note}`);
}

console.log(`\n  ▶ RECOMMENDED NEXT EXTRACTION: ${ranked[0].product}`);
console.log('    It seeds the EMPTY Color domain with MEASURED ΔE data — the rarest, highest-value');
console.log('    signal — and adds a new family (silicate paint) + a production decision.');

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Extraction is now driven by the knowledge map\'s holes, not by the product');
console.log('catalogue: a measured Color source outranks everything because that domain is empty.');
