// Benchmark 0 on REAL data — the actual scientific test.
//
// Give it ONE real project's experiments. It (1) establishes the law, (2) looks
// for a structured breakdown, (3) runs a PERMUTATION NULL — shuffling the
// outcome to destroy any real relationship and re-running detection K times —
// so a "discovery" is only credible if it BEATS its own shuffled control
// (p < 0.05). If you supply a held-out true boundary, it scores hit/miss.
//
//   run:  node run-on-real.mjs <path-to.json>
//
// Input JSON:
//   {
//     "config": { "xKey":"app_pct", "yKey":"ttf_days", "features":["humidity_pct","app_pct"],
//                 "trueBoundary": { "feature":"humidity_pct", "threshold":80 } },   // optional, held-out
//     "experiments": [ { "id":"...", "app_pct":28, "humidity_pct":55, "ttf_days":33 }, ... ]
//   }
//
import { readFileSync } from 'node:fs';
import { detectKnowledgeGaps } from '../knowledge-gap/engine.mjs';

const path = process.argv[2];
if (!path) { console.error('usage: node run-on-real.mjs <path-to.json>'); process.exit(2); }
const { config, experiments } = JSON.parse(readFileSync(path, 'utf8'));
const { xKey, yKey, features, trueBoundary } = config;
const neighborhood = config.neighborhood || Object.fromEntries(features.map((f) => [f, 2]));
const cfg = { xKey, yKey, features, neighborhood };

function mulberry32(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const shuffle = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const r = detectKnowledgeGaps(experiments, cfg);
console.log(`\n# Benchmark 0 — ${path}   (N=${experiments.length})`);
console.log(`law: ${r.law.describe()}   tol ±${r.tol.toFixed(2)}  (established on ${r.inliers.length} consistent experiments)`);
console.log(`classification: ✓${r.explained.length} explained  ✗${r.unexplained.length} unexplained  ⚠${r.contradictions.length} contradictions`);

if (!r.breakdown) {
  console.log('\nRESULT: no structured breakdown found.');
  console.log('  -> Either the law holds across the sampled range, or any failure is noise/too');
  console.log('     sparse/too gradual to clear the guards. A NULL result is informative: it says');
  console.log('     "no boundary at the resolution this engine can see" — see benchmark0.mjs limits.');
  process.exit(0);
}

// permutation null: how often does shuffled outcome produce a breakdown this strong?
const K = 300; const rnd = mulberry32(7); let ge = 0;
for (let k = 0; k < K; k++) {
  const ys = shuffle(experiments.map((e) => e[yKey]), rnd);
  const shuffled = experiments.map((e, i) => ({ ...e, [yKey]: ys[i] }));
  const rk = detectKnowledgeGaps(shuffled, cfg);
  if (rk.breakdown && rk.breakdown.bias >= r.breakdown.bias) ge++;
}
const p = (1 + ge) / (K + 1);

console.log(`\n🔥 breakdown: ${r.breakdown.feature} ≥ ${r.breakdown.threshold}  (${r.breakdown.direction})`);
console.log(`   bias ${r.breakdown.bias}, sign-consistency ${(r.breakdown.consistency * 100).toFixed(0)}%`);
console.log(`   permutation null: p = ${p.toFixed(4)}  (${ge}/${K} shuffles matched it)  -> ${p < 0.05 ? 'SURVIVES the null ✓' : 'FAILS the null ✗ (likely an artifact)'}`);
if (r.deciding) console.log(`   🧪 decisive experiment: ${JSON.stringify(r.deciding.humidity_pct !== undefined ? r.deciding : r.deciding)}`);

if (trueBoundary) {
  const hit = r.breakdown.feature === trueBoundary.feature && Math.abs(r.breakdown.threshold - trueBoundary.threshold) <= 6;
  console.log(`\nHELD-OUT CHECK: true boundary = ${trueBoundary.feature} ≥ ${trueBoundary.threshold}`);
  console.log(`   -> ${hit ? `REDISCOVERED ✓ (off by ${Math.abs(r.breakdown.threshold - trueBoundary.threshold).toFixed(1)})` : 'MISSED / wrong feature ✗'}`);
  console.log(`\nVERDICT: ${hit && p < 0.05 ? 'Benchmark 0 PASSED — rediscovered a held-out boundary that beats its null.' : 'Benchmark 0 NOT passed — see above.'}`);
} else {
  console.log(`\nNOTE: no held-out boundary supplied — this is an exploratory hit, not a graded test.`);
  console.log(`      To grade it: hide a boundary you already trust, and see if it is rediscovered here.`);
}
