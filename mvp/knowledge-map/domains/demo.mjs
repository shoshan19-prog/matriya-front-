// Knowledge Domain Registry — built from the REAL four-product reconstructions.
// run: node demo.mjs
//
// Inverts the index: Domains → Products → Episodes. Every tag below is traceable
// to a docs/PRODUCT_STORY_*.md episode — nothing invented. The registry numbers
// are therefore the TRUE current evidence, which is honestly thin.

import { DOMAIN } from './domains.mjs';
import { buildDomainRegistry, domainEvidence, buildMaterialIndex, materialHistory } from './registry.mjs';
import { REAL_EPISODES as E } from './corpus.mjs';

// (REAL_EPISODES now lives in corpus.mjs — the single source of truth.)
const registry = buildDomainRegistry(E);
const materials = buildMaterialIndex(E);

console.log('═══ KNOWLEDGE DOMAIN REGISTRY (organized by what we LEARNED, not what we made) ═══\n');
console.log('  Domain                         Evidence  Products  Episodes  Gaps  Status');
for (const r of registry)
  console.log(`  ${r.domain.padEnd(30)} ${String(r.evidence).padStart(6)}   ${String(r.products).padStart(6)}   ${String(r.episodes).padStart(6)}   ${String(r.gaps).padStart(3)}   ${r.status}`);
console.log('\n  evidence weight: measured=2 · qualitative=1 · empty(known gap)=0');

console.log('\n═══ PROTEUS re-oriented — "what do we really know about Compression Strength?" ═══\n');
const comp = domainEvidence(registry, DOMAIN.COMPRESSION);
console.log(`  Domain: ${comp.domain}   status: ${comp.status}   (${comp.gaps} known gaps)`);
for (const b of comp.bars)
  console.log(`    ${b.product.padEnd(14)} ${b.bar.padEnd(10)} ${b.evidence}${b.measured ? '  (measured)' : ''}`);
console.log('    → the answer is no longer "ask MPZ" — it is "MPZ carries it, the others are gaps".');

console.log('\n═══ MATERIAL HISTORY — the life of a raw material across ALL products ═══\n');
const verm = materialHistory(materials, 'vermiculite');
console.log(`  vermiculite — ${verm.products} products, ${verm.appearances} appearances, +${verm.positive}/−${verm.negative}:`);
for (const e of verm.episodes) console.log(`    ${e.product.padEnd(14)} ${e.episode.padEnd(8)} ${e.effect.toUpperCase().padEnd(8)} ${e.note}`);
console.log('    ⇒ cross-product finding: vermiculite NEVER appears in a frozen success — every time, adhesion/flow failed.');

console.log('\n  Top materials by reach:');
for (const m of materials.slice(0, 6))
  console.log(`    ${m.name.padEnd(16)} ${m.products}p / ${m.appearances}ep   +${m.positive}/−${m.negative}`);

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('The index is inverted: Knowledge Domains → Products → Episodes → Documents.');
console.log('Products became evidence sources. Now Fresco can ask "what do we know about');
console.log('compression / adhesion / fire / a material" — questions a product-only system cannot answer.');
