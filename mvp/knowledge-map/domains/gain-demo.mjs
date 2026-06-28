// Knowledge Acquisition Optimization — PROTEUS's objective function.
// run: node gain-demo.mjs
//
// 1) Knowledge Density per domain (how grounded, not just "exists").
// 2) Retro Knowledge GAIN of the last extraction (GRANITAL) — proves the KPI.
// 3) Expected GAIN ranking of the next candidates + saturation verdict.

import { REAL_EPISODES } from './corpus.mjs';
import { buildDomainRegistry } from './registry.mjs';
import { domainDensity, expectedGain, rankByExpectedGain, recommendNext, GAIN, GOVERNANCE } from './knowledge-gain.mjs';

const registry = buildDomainRegistry(REAL_EPISODES);
const density = domainDensity(registry, REAL_EPISODES);

console.log('═══ 1. KNOWLEDGE DENSITY (how well-grounded each domain is) ═══\n');
console.log('  Domain                         Evidence  Products  Episodes  Measured  Confidence');
for (const d of density)
  console.log(`  ${d.domain.padEnd(30)} ${String(d.evidence).padStart(6)}   ${String(d.products).padStart(6)}   ${String(d.episodes).padStart(6)}   ${String(d.measured).padStart(6)}      ${d.confidence.toFixed(2)}`);
console.log('\n  confidence = 0.5·measured-ratio + 0.3·product-coverage + 0.2·volume');
console.log('  → "we have a Color domain" (coverage) is not the same as "Color is well-grounded" (density).');

// ── 2. Retro Knowledge GAIN of GRANITAL — against the TRUE historical state when
//      it was extracted (only the original four products; Color still empty then).
const PRE_GRANITAL = ['טיח תל אביב', 'תרמי', 'INT-TFX', 'MPZ'];
const before = buildDomainRegistry(REAL_EPISODES.filter((e) => PRE_GRANITAL.includes(e.product)));
const granitalActual = expectedGain(
  { product: 'GRANITAL (actual)', knownFamily: false,
    signals: { COLOR: 'measured', WORKABILITY_FAIL: 'measured', PRODUCTION_DECISION: true },
    richness: 'rich', newMaterials: 5 }, before);
console.log('\n═══ 2. KNOWLEDGE GAIN of the last extraction (GRANITAL, retro) ═══\n');
console.log(`  GRANITAL Knowledge Gain = ${granitalActual.expectedGain}`);
console.log(`    ${granitalActual.breakdown.join('  ')}`);
console.log('  → the gap-driven choice paid off: it OPENED a domain (+10) and added a new family (+4).');

// ── 3. Expected GAIN ranking of the REMAINING candidates (BETONIZE/PROTECH/fire
//      already extracted & integrated). PROTEUS RECOMMENDS — it does not extract.
const CANDIDATES = [
  { product: 'F.SILICATO',     knownFamily: true,  richness: 'medium',
    signals: { WORKABILITY_FAIL: 'qualitative', PRODUCTION_DECISION: true }, newMaterials: 1 },
  { product: 'CC TOP COAT 118/120/121', knownFamily: true, richness: 'medium',
    signals: { COLOR: 'qualitative', PRODUCTION_DECISION: true }, newMaterials: 1 },
  { product: '«measured-Adhesion source (none scouted yet)»', knownFamily: true, richness: 'medium',
    signals: { /* adhesion has 0 measured across 4 products */ }, newMaterials: 0 },
];
const ranked = rankByExpectedGain(CANDIDATES, registry);
console.log('\n═══ 3. EXPECTED KNOWLEDGE GAIN — PROTEUS RECOMMENDS (human approves) ═══\n');
for (const r of ranked)
  console.log(`  gain ${String(r.expectedGain).padStart(3)}  ROI ${String(r.roi).padStart(4)}  ${r.product.padEnd(36)} ${r.breakdown.join(' ')}`);

const rec = recommendNext(ranked);
console.log(`\n  ▶ ${rec.action}: ${rec.reason}`);
console.log(`  ⛔ GOVERNANCE: ${rec.governance}`);

console.log('\n  GAIN RULES:', Object.entries(GAIN).map(([k, v]) => `${k}=${v}`).join('  '));

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('PROTEUS computes which ACTION maximizes Fresco\'s scientific knowledge and');
console.log('RECOMMENDS it — but a human approves every new Intake. The loop is');
console.log('recalc → recommend → approve → extract → recalc.');
