// Benchmark 0 — METHODS validation of the breakdown detector.
//
// This does NOT prove MATRIYA can discover real Fresco knowledge. It measures
// the *instrument*: when there is NO boundary, does the detector stay silent
// (false-positive / false-discovery rate)? And when a boundary exists, how
// strong and how dense must it be before the detector finds it (sensitivity /
// power)? Those two numbers decide whether any "discovery" on real data can be
// believed at all.
//
//   run:  node benchmark0.mjs
//
import { detectKnowledgeGaps } from '../knowledge-gap/engine.mjs';

function mulberry32(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const pick = (rnd, lo, hi) => lo + rnd() * (hi - lo);
const gauss = (rnd, sd) => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

// NULL: one linear regime in x, plus pure-noise covariate(s). No boundary.
function genNull(N, sigma, nNoiseFeatures, seed) {
  const rnd = mulberry32(seed); const exps = [];
  for (let i = 0; i < N; i++) {
    const x = pick(rnd, 20, 40);
    const e = { id: `n${i}`, x: +x.toFixed(1), y: +(0.9 * x + 8 + gauss(rnd, sigma)).toFixed(2) };
    for (let f = 0; f < nNoiseFeatures; f++) e[`z${f}`] = +pick(rnd, 40, 96).toFixed(1);
    exps.push(e);
  }
  return exps;
}
// POSITIVE: a real boundary on z at z0; above it the law collapses toward `collapseTo`.
function genPositive(N, sigma, collapseTo, z0, seed) {
  const rnd = mulberry32(seed); const exps = [];
  for (let i = 0; i < N; i++) {
    const x = pick(rnd, 20, 40);
    const below = i < N / 2;
    const z = below ? pick(rnd, 40, z0 - 1) : pick(rnd, z0 + 1, 96);
    const y = below ? 0.9 * x + 8 + gauss(rnd, sigma) : collapseTo + gauss(rnd, sigma);
    exps.push({ id: `p${i}`, x: +x.toFixed(1), z: +z.toFixed(1), y: +y.toFixed(2) });
  }
  return exps;
}

const cfg = (features) => ({ xKey: 'x', yKey: 'y', features, neighborhood: Object.fromEntries(features.map((f) => [f, 2])) });
const TRIALS = 120;

console.log('================  NULL CONTROLS  (no boundary -> detector must stay silent)  ================');
console.log('  a false positive here means the engine INVENTS boundaries. Want ~0.\n');
console.log('  N    sigma  noiseFeatures   false-positive rate');
for (const N of [24, 48]) for (const sigma of [1, 2, 4]) for (const nf of [1, 2]) {
  let fp = 0;
  for (let t = 0; t < TRIALS; t++) {
    const exps = genNull(N, sigma, nf, 1000 + t);
    const feats = ['x', ...Array.from({ length: nf }, (_, k) => `z${k}`)];
    const r = detectKnowledgeGaps(exps, cfg(feats));
    if (r.breakdown) fp++;
  }
  console.log(`  ${String(N).padEnd(4)} ${String(sigma).padEnd(6)} ${String(nf).padEnd(15)} ${(fp / TRIALS * 100).toFixed(1)}%`);
}

console.log('\n================  POSITIVE CONTROLS  (real boundary at z=80 -> measure power)  ================');
console.log('  detection rate = found a z-boundary within ±6 of truth. localization = |found-80|.\n');
console.log('  N    sigma  collapseTo  effect@x=40   detection rate   median |thr-80|');
for (const N of [24, 48]) for (const sigma of [2]) for (const collapseTo of [12, 25, 32, 38]) {
  let hit = 0; const locs = [];
  for (let t = 0; t < TRIALS; t++) {
    const exps = genPositive(N, sigma, collapseTo, 80, 5000 + t);
    const r = detectKnowledgeGaps(exps, cfg(['z', 'x']));
    if (r.breakdown && r.breakdown.feature === 'z' && Math.abs(r.breakdown.threshold - 80) <= 6) { hit++; locs.push(Math.abs(r.breakdown.threshold - 80)); }
  }
  const effect = (0.9 * 40 + 8) - collapseTo; // predicted-minus-collapse at strongest x
  const medLoc = locs.length ? locs.sort((a, b) => a - b)[Math.floor(locs.length / 2)] : NaN;
  console.log(`  ${String(N).padEnd(4)} ${String(sigma).padEnd(6)} ${String(collapseTo).padEnd(11)} ${String(effect.toFixed(0)).padEnd(13)} ${(hit / TRIALS * 100).toFixed(1).padEnd(16)} ${isNaN(medLoc) ? '—' : medLoc.toFixed(1)}`);
}

console.log('\n================  INTERPRETATION  ================');
console.log('  - If NULL false-positive ≈ 0 across the grid, the guards (sign-consistency,');
console.log('    3σ bias, low-side-explained) are doing their job: the engine does not');
console.log('    hallucinate boundaries. That is the precondition for trusting ANY hit.');
console.log('  - The POSITIVE grid is the engine\'s RESOLUTION: the smallest effect and');
console.log('    lowest density at which a true boundary is reliably found. Below that line,');
console.log('    a real Fresco boundary would be MISSED — a known blind spot, stated up front.');
console.log('  - This validates the instrument. It does NOT validate discovery on real data.');
