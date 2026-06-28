// Knowledge Acquisition Optimization — PROTEUS's objective function.
// run: node gain-demo.mjs
//
// 1) Knowledge Density per domain (how grounded, not just "exists").
// 2) Retro Knowledge GAIN of the last extraction (GRANITAL) — proves the KPI.
// 3) Expected GAIN ranking of the next candidates + saturation verdict.

import { REAL_EPISODES } from './corpus.mjs';
import { buildDomainRegistry } from './registry.mjs';
import { domainDensity, expectedGain, rankByExpectedGain, acquisitionVerdict, GAIN } from './knowledge-gain.mjs';

const registry = buildDomainRegistry(REAL_EPISODES);
const density = domainDensity(registry, REAL_EPISODES);

console.log('═══ 1. KNOWLEDGE DENSITY (how well-grounded each domain is) ═══\n');
console.log('  Domain                         Evidence  Products  Episodes  Measured  Confidence');
for (const d of density)
  console.log(`  ${d.domain.padEnd(30)} ${String(d.evidence).padStart(6)}   ${String(d.products).padStart(6)}   ${String(d.episodes).padStart(6)}   ${String(d.measured).padStart(6)}      ${d.confidence.toFixed(2)}`);
console.log('\n  confidence = 0.5·measured-ratio + 0.3·product-coverage + 0.2·volume');
console.log('  → "we have a Color domain" (coverage) is not the same as "Color is well-grounded" (density).');

// ── 2. Retro Knowledge GAIN of GRANITAL — measured against the state BEFORE it ──
const before = buildDomainRegistry(REAL_EPISODES.filter((e) => e.product !== 'GRANITAL'));
const granitalActual = expectedGain(
  { product: 'GRANITAL (actual)', knownFamily: false,
    signals: { COLOR: 'measured', WORKABILITY_FAIL: 'measured', PRODUCTION_DECISION: true },
    richness: 'rich', newMaterials: 5 }, before);
console.log('\n═══ 2. KNOWLEDGE GAIN of the last extraction (GRANITAL, retro) ═══\n');
console.log(`  GRANITAL Knowledge Gain = ${granitalActual.expectedGain}`);
console.log(`    ${granitalActual.breakdown.join('  ')}`);
console.log('  → the gap-driven choice paid off: it OPENED a domain (+10) and added a new family (+4).');

// ── 3. Expected GAIN ranking of the next candidates (now being extracted) ──────
// Metadata from the scout; family-novelty conservative.
const CANDIDATES = [
  { product: 'BETONIZE 2030',  knownFamily: true,  richness: 'rich',
    signals: { COLOR: 'qualitative', WORKABILITY_FAIL: 'qualitative', PRODUCTION_DECISION: true }, newMaterials: 3 },
  { product: 'PROTECH A1',     knownFamily: true,  richness: 'rich',
    signals: { WORKABILITY_FAIL: 'measured', PRODUCTION_DECISION: true }, newMaterials: 2 },
  { product: 'fire-retardant plaster', knownFamily: false, richness: 'thin',
    signals: { FIRE: 'qualitative', PRODUCTION_DECISION: true }, newMaterials: 2 },
  { product: 'F.SILICATO',     knownFamily: true,  richness: 'medium',
    signals: { WORKABILITY_FAIL: 'qualitative', PRODUCTION_DECISION: true }, newMaterials: 1 },
];
const ranked = rankByExpectedGain(CANDIDATES, registry);
console.log('\n═══ 3. EXPECTED KNOWLEDGE GAIN — PROTEUS picks the next action ═══\n');
for (const r of ranked)
  console.log(`  gain ${String(r.expectedGain).padStart(3)}  ROI ${String(r.roi).padStart(4)}  ${r.product.padEnd(24)} ${r.breakdown.join(' ')}`);

const verdict = acquisitionVerdict(ranked);
console.log(`\n  ▶ ACQUISITION VERDICT: ${verdict.stop ? 'STOP' : 'GO'} — ${verdict.reason}`);
console.log('  (saturation guard: stop when even the best expected gain < 8 → diminishing scientific value)');

console.log('\n  GAIN RULES:', Object.entries(GAIN).map(([k, v]) => `${k}=${v}`).join('  '));

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('PROTEUS no longer chooses "which product". It computes which ACTION maximizes');
console.log('Fresco\'s scientific knowledge — Knowledge Acquisition Optimization. That, not');
console.log('RAG or a knowledge graph, is its core job.');
