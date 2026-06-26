// Knowledge Gap Detector — demo on a Fresco-style case.
//
// Hidden truth (the engine does NOT know this — it must DISCOVER it):
//   * "dry" regime (humidity < 80): a flame-retardant additive APP% protects,
//     so time-to-failure TTF rises with APP.   -> APP explains TTF
//   * "humid" regime (humidity >= 80): the additive hydrolyses/leaches and the
//     protection COLLAPSES — TTF flattens, independent of APP.
// There is NO data in humidity (74, 84): the boundary is unexplored.
//
//   run:  node demo.mjs
//
import { detectKnowledgeGaps } from './engine.mjs';

// tiny seeded PRNG so the demo is reproducible
function mulberry32(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(42);
const noise = (k = 2) => (rnd() * 2 - 1) * k;

let id = 0;
const experiments = [];
// dry regime: humidity 40..74, TTF = 0.9*APP + 8  (APP explains TTF)
for (const hum of [40, 50, 58, 64, 70, 74]) for (const app of [20, 28, 34, 40]) {
  experiments.push({ id: `E${++id}`, app_pct: app, humidity_pct: hum, ttf_days: +(0.9 * app + 8 + noise()).toFixed(1) });
}
// humid regime: humidity 84..96, TTF ~ 12 regardless of APP  (collapse)
for (const hum of [84, 90, 96]) for (const app of [20, 28, 34, 40]) {
  experiments.push({ id: `E${++id}`, app_pct: app, humidity_pct: hum, ttf_days: +(12 + noise()).toFixed(1) });
}
// inject one contradiction: same conditions as an existing dry point, divergent TTF
experiments.push({ id: 'E_anom', app_pct: 40, humidity_pct: 58, ttf_days: 21.0 });

const r = detectKnowledgeGaps(experiments, {
  xKey: 'app_pct', yKey: 'ttf_days', features: ['humidity_pct', 'app_pct'],
  neighborhood: { app_pct: 2, humidity_pct: 2 },
});

console.log('=== K — known law, established on its largest self-consistent region ===');
console.log(`  ${r.law.describe()}    (domain: ${r.inliers.length} consistent experiments; tolerance ±${r.tol.toFixed(1)} days, noise σ≈${r.noiseStd.toFixed(1)})\n`);

console.log('=== C — check vs evidence ===');
console.log(`  ✓ explained:   ${r.explained.length}/${r.scored.length}`);
console.log(`  ✗ unexplained: ${r.unexplained.length}/${r.scored.length}\n`);

console.log('=== B — structured breakdown (not noise)? ===');
if (r.breakdown) {
  console.log(`  🔥 BREAKDOWN at  ${r.breakdown.feature} ≥ ${r.breakdown.threshold}`);
  console.log(`     the law ${r.breakdown.direction}; bias ${r.breakdown.bias.toFixed(1)} days, sign-consistency ${(r.breakdown.consistency * 100).toFixed(0)}%`);
  console.log(`     failing experiments in region: ${r.breakdownCluster.map((e) => e.id).join(', ')}`);
} else console.log('  none — failures look like noise, not a boundary');
console.log();

console.log('=== ⚠ contradictions (near-identical conditions, divergent outcome) ===');
if (r.contradictions.length) r.contradictions.forEach((c) => console.log(`  ⚠ ${c.a} vs ${c.b} differ by ${Math.abs(c.dy)} days at ${c.at}`));
else console.log('  none');
console.log();

console.log('=== N — the single smallest deciding experiment ===');
if (r.deciding) {
  console.log(`  🧪 run:  humidity_pct=${r.deciding.humidity_pct}, app_pct=${r.deciding.app_pct}`);
  console.log(`     why: ${r.deciding.rationale}`);
} else console.log('  (no breakdown -> no boundary to resolve)');

console.log('\n=== so what? ===');
console.log('  The engine did not ask "was the expert right". It found that a KNOWN');
console.log('  mechanism (APP protects) STOPS explaining the evidence above a humidity');
console.log('  boundary it discovered on its own, flagged it as a structured breakdown,');
console.log('  and named the one experiment that confirms the new boundary. That is the');
console.log('  birth of a new law (N), reached only after a proven breakdown (B).');
