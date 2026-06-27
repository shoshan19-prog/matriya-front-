// Run the cement-threshold V1 against a sealed pre-registration.
//
//   node run-v1-segmented.mjs <prereg.json> <input-table.json> <strength.json>
//
// INVESTIGATOR-BLIND: <strength.json> is supplied by the data holder (Rachel)
// and is read ONLY by this process; the script prints aggregate statistics
// (PASS/FAIL, estimated threshold, CI, model comparison) and NEVER echoes raw
// strengths. The investigator authors the prereg + input table and does not
// open the strength file.
//
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { improvement, permutationP, bootstrapT, adjustForConfounders } from './segmented.mjs';

const LEDGER = new URL('./v1-ledger.jsonl', import.meta.url).pathname;
function stable(o){ if(Array.isArray(o))return '['+o.map(stable).join(',')+']'; if(o&&typeof o==='object')return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+stable(o[k])).join(',')+'}'; return JSON.stringify(o); }
const readJsonl=(p)=>existsSync(p)?readFileSync(p,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse):[];

const [pregPath, inputPath, strengthPath] = process.argv.slice(2);
if (!pregPath || !inputPath || !strengthPath) { console.error('usage: node run-v1-segmented.mjs <prereg.json> <input-table.json> <strength.json>'); process.exit(2); }

// 1) load + verify the sealed pre-registration
const preg = JSON.parse(readFileSync(pregPath, 'utf8'));
const { sealed_hash, sealed_at, pre_registration_id, ...content } = preg;
if (createHash('sha256').update(stable(content)).digest('hex') !== sealed_hash) {
  console.error('REFUSED — pre-registration seal broken (edited after sealing). Invalid run.'); process.exit(1);
}
const P = content.parameters;

// 2) load visible input table + held-out strengths; join by key
const rows = JSON.parse(readFileSync(inputPath, 'utf8')).rows || JSON.parse(readFileSync(inputPath, 'utf8'));
const strength = JSON.parse(readFileSync(strengthPath, 'utf8'));
const key = content.variables.join_key, xk = content.variables.input_feature, yk = content.variables.outcome;
const joined = rows.filter((r) => strength[r[key]] !== undefined);
const x = joined.map((r) => Number(r[xk]));
const y = joined.map((r) => Number(strength[r[key]]));

// 3) one-run lock (per prereg id + input-table hash)
const tableHash = createHash('sha256').update(stable(rows)).digest('hex').slice(0, 12);
if (readJsonl(LEDGER).some((e) => e.pre_registration_id === pre_registration_id && e.table_hash === tableHash)) {
  console.error(`REFUSED — ${pre_registration_id} already run on this table (LOCKED, single-use).`); process.exit(1);
}

// 4) primary analysis (estimated breakpoint, never hand-picked)
const range = P.breakpoint_search_range, minPer = P.min_points_per_segment;
const imp = improvement(x, y, range, minPer);
const perm = imp.seg ? permutationP(x, y, range, minPer, P.permutation.count) : { obs: 0, p: 1 };
const boot = imp.seg ? bootstrapT(x, y, range, minPer, P.bootstrap.count) : { width: Infinity, lo: NaN, hi: NaN };

// 5) confounder control: residualize on covariates, re-test
const r = adjustForConfounders(joined, y, P.confounders);
const permAdj = imp.seg ? permutationP(x, r, range, minPer, P.permutation.count) : { obs: 0, p: 1 };

// 6) five-criterion decision (all must hold)
const c = {
  breakpoint_detected: !!imp.seg,
  improvement_exceeds: imp.improvement >= P.improvement_threshold,
  permutation_significant: perm.p < P.permutation.p_threshold,
  bootstrap_stable: boot.width <= P.bootstrap.max_ci_width,
  persists_after_confounders: permAdj.p < P.permutation.p_threshold,
};
const result = Object.values(c).every(Boolean) ? 'PASS' : 'FAIL';

// 7) append to ledger (locked; failures counted) — NO raw strengths stored
const entry = {
  pre_registration_id, table_hash: tableHash, run_at: new Date().toISOString(), result,
  estimated_threshold: imp.seg ? +imp.seg.T.toFixed(2) : null,
  threshold_CI: imp.seg ? [+boot.lo?.toFixed?.(2), +boot.hi?.toFixed?.(2)] : null,
  improvement: +imp.improvement.toFixed(3), aic_lin: imp.aic_lin && +imp.aic_lin.toFixed(1), aic_seg: imp.aic_seg && +imp.aic_seg.toFixed(1),
  permutation_p: +perm.p.toFixed(4), permutation_p_adjusted: +permAdj.p.toFixed(4), criteria: c, n: x.length,
};
appendFileSync(LEDGER, JSON.stringify(entry) + '\n');

// 8) blind report (aggregates only)
console.log(`\n# Cement-threshold V1 — ${pre_registration_id}   (n=${x.length} batches)`);
console.log(`estimated breakpoint:   ${entry.estimated_threshold ?? '—'}% cement` + (imp.seg ? `   bootstrap 95% CI [${entry.threshold_CI[0]}, ${entry.threshold_CI[1]}] (width ${boot.width.toFixed(1)})` : ''));
console.log(`model comparison:       improvement ${entry.improvement}  | AIC linear ${entry.aic_lin} vs segmented ${entry.aic_seg}`);
console.log(`permutation:            p=${entry.permutation_p}   confounder-adjusted p=${entry.permutation_p_adjusted}`);
console.log('criteria:');
for (const [name, ok] of Object.entries(c)) console.log(`   ${ok ? '✓' : '✗'} ${name}`);
console.log(`\nRESULT: ${result}   (LOCKED in ledger; raw strengths never exposed)`);
process.exit(0);
