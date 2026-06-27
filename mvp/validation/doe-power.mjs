// DOE power analysis — is 15 cubes (5 levels × 3 independent batches) enough?
//
// Simulates the pre-registered DOE design under the sealed analysis parameters
// and measures: (a) detection rate vs the size of the true strength jump and
// the batch-to-batch noise, and (b) the false-positive rate when there is no
// jump. This tells us, BEFORE casting anything, what effect the experiment can
// and cannot resolve.
//
//   run:  node doe-power.mjs
//
import { improvement, permutationP, bootstrapT } from './segmented.mjs';

// V4 design: 5 levels × 4 independent batches (2 cubes/batch averaged → batch-mean σ),
// predicted window 11–13%, permutation p<0.025, jump model.
const P = { range: { lo: 9, hi: 15 }, window: { lo: 11, hi: 13 }, minPer: 4, improvement: 0.30, permP: 0.025, bootMaxWidth: 4, permN: 300, bootN: 300 };
const LEVELS = [8, 10, 12, 14, 16], NPER = 4, TRUE_T = 11; // jump above 11% (break between 10 and 12)

function mulberry32(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const gauss = (rnd, sd) => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

function simulate(jump, sigma, seed) {
  const rnd = mulberry32(seed); const x = [], y = [];
  for (const cem of LEVELS) for (let b = 0; b < NPER; b++) {
    const base = 4 + 0.3 * cem;            // mild linear trend
    const s = base + (cem > TRUE_T ? jump : 0) + gauss(rnd, sigma);
    x.push(cem); y.push(s);
  }
  return { x, y };
}
function decide(x, y) {
  const imp = improvement(x, y, P.range, P.minPer);
  if (!imp.seg) return false;
  const perm = permutationP(x, y, P.range, P.minPer, P.permN);
  const boot = bootstrapT(x, y, P.range, P.minPer, P.bootN);
  const inWindow = imp.seg.T >= P.window.lo && imp.seg.T <= P.window.hi;
  const ciOverlap = !(boot.hi < P.window.lo || boot.lo > P.window.hi);
  return imp.improvement >= P.improvement && perm.p < P.permP && boot.width <= P.bootMaxWidth && inWindow && ciOverlap;
}

const TRIALS = 100;
console.log('DOE V4: 5 levels (8/10/12/14/16%) × 4 independent batches = 20 batch means; true break above 11%;\n  PASS = improvement + permutation(p<0.025) + bootstrap-stable + breakpoint in 11–13% window\n');
console.log('  detection rate (PASS of breakpoint+improvement+permutation+bootstrap), by jump size × batch noise σ:\n');
console.log('  jump(MPa)   σ=1.0     σ=2.0     σ=3.0');
for (const jump of [3, 5, 8, 12]) {
  const cells = [1.0, 2.0, 3.0].map((sigma) => {
    let hit = 0; for (let t = 0; t < TRIALS; t++) if (decide(...Object.values(simulate(jump, sigma, 1000 + t)))) hit++;
    return (hit / TRIALS * 100).toFixed(0).padStart(5) + '%';
  });
  console.log(`  ${String(jump).padEnd(11)} ${cells.join('    ')}`);
}
let fp = 0; for (let t = 0; t < TRIALS; t++) if (decide(...Object.values(simulate(0, 2.0, 7000 + t)))) fp++;
console.log(`\n  NULL (jump=0, σ=2.0): false-positive rate ${ (fp / TRIALS * 100).toFixed(1) }%   (want ~p_threshold = 5%)`);
console.log('\n  Reading: find your expected jump size and batch σ. If detection < ~80%, add batches');
console.log('  per level or replicate cubes (averaged) to cut σ — BEFORE committing the run.');
