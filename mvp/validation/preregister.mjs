// V1 Pre-registration — seal a test BEFORE running it.
//
// Blocks the three hindsight failures: choosing the boundary after the result,
// choosing the feature after the result, and ignoring failures. It does so by
// hashing the filled form and appending it to an append-only store. The runner
// (run-v1.mjs) refuses to grade anything whose hash doesn't match — so any
// post-hoc edit of the boundary/feature/criteria is detectable.
//
//   run:  node preregister.mjs <filled-form.json>
//
// Discipline that makes the seal a real timestamp (not just self-trust):
//   COMMIT & PUSH preregistrations.jsonl BEFORE you run the test. Git history
//   then proves the boundary was declared before the result existed.
//
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const REQUIRED = [
  'project', 'dataset_file', 'input_variable', 'target_variable', 'candidate_features',
  'hidden_boundary', 'who_knows_boundary', 'who_runs_blind',
  'success_criterion', 'p_threshold', 'permutation_count', 'held_out_rule', 'failure_reporting', 'decision',
];
const STORE = new URL('./preregistrations.jsonl', import.meta.url).pathname;

// stable stringify (sorted keys) so the hash is deterministic
function stable(o) {
  if (Array.isArray(o)) return '[' + o.map(stable).join(',') + ']';
  if (o && typeof o === 'object') return '{' + Object.keys(o).sort().map((k) => JSON.stringify(k) + ':' + stable(o[k])).join(',') + '}';
  return JSON.stringify(o);
}

const path = process.argv[2];
if (!path) { console.error('usage: node preregister.mjs <filled-form.json>'); process.exit(2); }
const form = JSON.parse(readFileSync(path, 'utf8'));

const missing = REQUIRED.filter((k) => form[k] === undefined || form[k] === null || form[k] === '');
if (missing.length) { console.error('REFUSED — missing required fields:\n  - ' + missing.join('\n  - ')); process.exit(1); }
if (!form.hidden_boundary.feature || form.hidden_boundary.threshold === undefined || form.hidden_boundary.tolerance === undefined)
  { console.error('REFUSED — hidden_boundary needs { feature, threshold, tolerance }'); process.exit(1); }
if (!form.candidate_features.includes(form.hidden_boundary.feature))
  { console.error('REFUSED — hidden_boundary.feature must be among candidate_features (no smuggling a feature in post-hoc)'); process.exit(1); }

const sealed_hash = createHash('sha256').update(stable(form)).digest('hex');
const pre_registration_id = 'V1-' + sealed_hash.slice(0, 10);
const sealed_at = new Date().toISOString();

// refuse duplicate registration of an identical form (idempotent), or id clash
if (existsSync(STORE)) {
  const lines = readFileSync(STORE, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  if (lines.some((r) => r.pre_registration_id === pre_registration_id)) {
    console.log(`already registered: ${pre_registration_id}`); process.exit(0);
  }
}
appendFileSync(STORE, JSON.stringify({ pre_registration_id, sealed_hash, sealed_at, form }) + '\n');

console.log(`SEALED ✓  pre_registration_id = ${pre_registration_id}`);
console.log(`  hidden boundary: ${form.hidden_boundary.feature} ≈ ${form.hidden_boundary.threshold} (±${form.hidden_boundary.tolerance})  [sealed; runner reads it from here, not from the data]`);
console.log(`  success: ${form.success_criterion}  | p < ${form.p_threshold} | permutations ${form.permutation_count}`);
console.log('\nNEXT (do this BEFORE running, so the seal is timestamped):');
console.log('  git add mvp/validation/preregistrations.jsonl && git commit -m "prereg ' + pre_registration_id + '" && git push');
console.log(`  then:  node run-v1.mjs ${pre_registration_id}`);
