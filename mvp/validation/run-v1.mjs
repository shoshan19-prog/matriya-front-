// Run a V1 test — ONLY against a sealed pre-registration.
//
// Enforces the DoD:
//   * cannot run without a valid pre_registration_id
//   * verifies the seal (tamper-evident: post-hoc edits are rejected)
//   * the hidden boundary/feature/criteria come from the SEALED form, never re-chosen
//   * each run is appended to an append-only ledger; pass/fail is LOCKED
//   * a pre_registration_id can be run ONCE (no "run until it passes")
//   * failures are recorded and counted in attempts
//
//   run:  node run-v1.mjs <pre_registration_id>
//
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { detectKnowledgeGaps } from '../knowledge-gap/engine.mjs';

const PREREG = new URL('./preregistrations.jsonl', import.meta.url).pathname;
const LEDGER = new URL('./v1-ledger.jsonl', import.meta.url).pathname;

function stable(o){ if(Array.isArray(o))return '['+o.map(stable).join(',')+']'; if(o&&typeof o==='object')return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+stable(o[k])).join(',')+'}'; return JSON.stringify(o); }
function mulberry32(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const shuffle=(arr,rnd)=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const readJsonl=(p)=>existsSync(p)?readFileSync(p,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse):[];

const id = process.argv[2];
if (!id) { console.error('usage: node run-v1.mjs <pre_registration_id>'); process.exit(2); }

// 1) load + verify the sealed pre-registration
const rec = readJsonl(PREREG).find((r) => r.pre_registration_id === id);
if (!rec) { console.error(`REFUSED — no pre-registration with id ${id}. Register first (preregister.mjs).`); process.exit(1); }
const rehash = createHash('sha256').update(stable(rec.form)).digest('hex');
if (rehash !== rec.sealed_hash) { console.error('REFUSED — seal broken: the pre-registration was edited after sealing. This run is invalid.'); process.exit(1); }

// 2) one-run lock
if (readJsonl(LEDGER).some((e) => e.pre_registration_id === id)) {
  console.error(`REFUSED — ${id} has already been run and is LOCKED. A pre-registration is single-use (no run-until-pass).`); process.exit(1);
}

const f = rec.form;
// 3) load the dataset — which must NOT contain the boundary (operator stays blind to it)
const ds = JSON.parse(readFileSync(new URL('./' + f.dataset_file, import.meta.url).pathname, 'utf8'));
const experiments = Array.isArray(ds) ? ds : ds.experiments;
const cfg = { xKey: f.input_variable, yKey: f.target_variable, features: f.candidate_features, neighborhood: Object.fromEntries(f.candidate_features.map((x) => [x, 2])) };

// 4) detect (uses ONLY the pre-registered feature set; the boundary is never read from data)
const r = detectKnowledgeGaps(experiments, cfg);
let p = null, found = null;
if (r.breakdown) {
  const K = f.permutation_count, rnd = mulberry32(7); let ge = 0;
  for (let k = 0; k < K; k++) {
    const ys = shuffle(experiments.map((e) => e[f.target_variable]), rnd);
    const rk = detectKnowledgeGaps(experiments.map((e, i) => ({ ...e, [f.target_variable]: ys[i] })), cfg);
    if (rk.breakdown && rk.breakdown.bias >= r.breakdown.bias) ge++;
  }
  p = (1 + ge) / (K + 1);
  found = { feature: r.breakdown.feature, threshold: r.breakdown.threshold, bias: r.breakdown.bias, consistency: r.breakdown.consistency, p };
}

// 5) grade STRICTLY against the sealed criteria
const hb = f.hidden_boundary;
const featureOk = !!found && found.feature === hb.feature;
const thresholdOk = !!found && Math.abs(found.threshold - hb.threshold) <= hb.tolerance;
const pOk = !!found && p < f.p_threshold;
const result = (featureOk && thresholdOk && pOk) ? 'PASS' : 'FAIL';

// 6) append to the locked, append-only ledger (failures included)
const entry = {
  pre_registration_id: id, project: f.project, run_at: new Date().toISOString(),
  result, found, hidden: hb,
  checks: { featureOk, thresholdOk, pOk }, locked: true, sealed_hash: rec.sealed_hash,
};
appendFileSync(LEDGER, JSON.stringify(entry) + '\n');

// 7) report + V1 status (≥2 distinct projects passed)
console.log(`\n# V1 run — ${id}   project: ${f.project}   (N=${experiments.length})`);
console.log(`law: ${r.law.describe()}   established on ${r.inliers.length}`);
console.log(found ? `breakdown: ${found.feature} ≥ ${found.threshold}  bias ${found.bias}  consistency ${(found.consistency*100).toFixed(0)}%  permutation p=${p.toFixed(4)}`
                  : 'no structured breakdown found');
console.log(`graded vs sealed boundary ${hb.feature} ≈ ${hb.threshold} (±${hb.tolerance}):  feature ${featureOk?'✓':'✗'}  threshold ${thresholdOk?'✓':'✗'}  p<${f.p_threshold} ${pOk?'✓':'✗'}`);
console.log(`RESULT: ${result}   (LOCKED in ledger)`);

const led = readJsonl(LEDGER);
const passedProjects = new Set(led.filter((e) => e.result === 'PASS').map((e) => e.project));
console.log(`\nV1 status: attempts=${led.length}  passes=${led.filter(e=>e.result==='PASS').length}  failures=${led.filter(e=>e.result==='FAIL').length}  distinct projects passed=${passedProjects.size}`);
console.log(passedProjects.size >= 2 ? 'V1 CLEARED ✓ (>=2 independent projects) — VDI candidate may advance to V2.' : `V1 needs >=2 distinct projects passed (have ${passedProjects.size}).`);
process.exit(result === 'PASS' ? 0 : 0); // a FAIL is a valid, recorded scientific outcome, not an error
