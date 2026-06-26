// Validation Layer (V) — the ladder + the Validated Discovery Index (VDI).
//
// V sits ABOVE K->C->B->N->L. A law that reaches L is only a CANDIDATE; it must
// climb the ladder. The point of this file: make VDI a number that is COMPUTED
// from an auditable, append-only ledger of rungs — never asserted. A discovery
// counts toward VDI only at V4+ (prospective), and VDI is always reported with
// its denominator (attempts) so it cannot become a vanity metric.
//
//   run:  node validation-ladder.mjs

export const RUNGS = [
  { id: 'V0', name: 'Synthetic sanity',           needs: 'null false-positives controlled + planted boundary rediscovered + beats permutation null (synthetic only)' },
  { id: 'V1', name: 'Rediscovery (held-out,real)', needs: '>=2 real projects: correct feature+threshold within tol, permutation p<0.05, boundary pre-registered as held-out' },
  { id: 'V2', name: 'Independent, frozen protocol', needs: '>=5 projects, ONE frozen param set (no per-project tuning), family-wise false-discovery control' },
  { id: 'V3', name: 'Blind evaluation',            needs: 'operator running the engine does not know the boundary location (sealed by a third party)' },
  { id: 'V4', name: 'Prospective prediction',      needs: 'predict a boundary in an UNcharacterised region BEFORE the experiment exists; new experiment confirms it' },
  { id: 'V5', name: 'External replication',        needs: 'replicate on data NOT produced by Fresco (pragmatic substitute: strict unseen site/time hold-out)' },
];
const IDX = Object.fromEntries(RUNGS.map((r, i) => [r.id, i]));

// A discovery's level = number of LEADING passed rungs (monotonic; a rung can't
// count if any lower rung is unpassed).
export function currentLevel(d) {
  let lvl = -1;
  for (const r of RUNGS) { if (d.rungs?.[r.id]?.status === 'passed') lvl++; else break; }
  return lvl; // -1 = nothing passed; 0 = V0; ...; 5 = V5
}
export function levelLabel(lvl) { return lvl < 0 ? '—' : RUNGS[lvl].id; }

// Monotonicity / integrity check: no rung marked passed above an unpassed one.
export function auditDiscovery(d) {
  const problems = [];
  let sawUnpassed = false;
  for (const r of RUNGS) {
    const st = d.rungs?.[r.id]?.status || 'pending';
    if (st !== 'passed') sawUnpassed = true;
    else if (sawUnpassed) problems.push(`${r.id} marked passed while a lower rung is not passed`);
    if (st === 'passed' && r.id !== 'V0' && !(d.rungs[r.id].evidence)) problems.push(`${r.id} passed without recorded evidence`);
  }
  return { ok: problems.length === 0, problems };
}

// The KPI — computed, never asserted; always carries its denominator.
export function computeVDI(ledger) {
  const attempts = ledger.length;
  const levels = ledger.map(currentLevel);
  const perRung = Object.fromEntries(RUNGS.map((r, i) => [r.id, levels.filter((l) => l >= i).length]));
  const vdi = levels.filter((l) => l >= IDX.V4).length;            // V4+ only
  const failures = ledger.filter((d) => Object.values(d.rungs || {}).some((x) => x.status === 'failed')).length;
  const preReg = ledger.filter((d) => d.pre_registered).length;
  return {
    VDI: vdi,
    attempts,
    failures,
    pre_registration_ratio: attempts ? +(preReg / attempts).toFixed(2) : 0,
    reached_at_least: perRung,                                     // how many candidates reached each rung
  };
}

// ---------------------------------------------------------------------------
// DEMO — the HONEST current state of the program.
// Only V0 is passed (on synthetic data, in benchmark0/run-on-real). Everything
// on real data is pending. So the true VDI today is 0 — which is exactly the
// point: by this KPI the project has zero validated discoveries yet.
// ---------------------------------------------------------------------------
const ledger = [
  {
    id: 'D1', title: 'humidity boundary on TTF (APP additive collapses)', project: 'synthetic-template',
    pre_registered: true,
    rungs: {
      V0: { status: 'passed', evidence: 'benchmark0.mjs: FP~0 at moderate noise; run-on-real rediscovered planted boundary, permutation p=0.0033', date: '2026-06-26' },
      V1: { status: 'pending' }, V2: { status: 'pending' }, V3: { status: 'pending' },
      V4: { status: 'pending' }, V5: { status: 'pending' },
    },
  },
  {
    // an example FAILED attempt, recorded on purpose: the denominator must include misses.
    id: 'D0', title: '(example) spurious boundary in high-noise pilot', project: 'pilot-noise',
    pre_registered: true,
    rungs: { V0: { status: 'failed', evidence: 'did not beat permutation null (p=0.21)', date: '2026-06-26' } },
  },
];

console.log('VALIDATION LADDER (V sits above K->C->B->N->L)\n');
for (const r of RUNGS) console.log(`  ${r.id}  ${r.name.padEnd(30)} — ${r.needs}`);

console.log('\nLEDGER (append-only; includes failures):');
for (const d of ledger) {
  const a = auditDiscovery(d);
  console.log(`  ${d.id}  level=${levelLabel(currentLevel(d)).padEnd(3)}  ${a.ok ? 'integrity ✓' : 'INTEGRITY ✗ ' + a.problems.join('; ')}  | ${d.title}`);
}

const k = computeVDI(ledger);
console.log('\nPRIMARY KPI:');
console.log(`  VDI (discoveries at V4+):  ${k.VDI}`);
console.log(`  attempts (denominator):    ${k.attempts}   failures: ${k.failures}   pre-registration ratio: ${k.pre_registration_ratio}`);
console.log(`  reached at least:          ${RUNGS.map((r) => `${r.id}:${k.reached_at_least[r.id]}`).join('  ')}`);

console.log('\nHONEST READING:');
console.log('  VDI = 0. By the metric that actually matters, the project has ZERO validated');
console.log('  discoveries yet — only a sanity-checked instrument (V0) and pending real-data');
console.log('  tests. That is the correct baseline, and it reframes "many modules / endpoints"');
console.log('  as not-yet-the-point. The number to grow is VDI, with its denominator in view.');

if (computeVDI(ledger).VDI !== 0) process.exit(1);
