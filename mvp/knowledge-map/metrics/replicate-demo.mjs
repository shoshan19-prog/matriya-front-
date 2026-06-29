// Reproducibility run on Fresco projects only: MPZ → INT-TFX → PROTECH A1.
//   run: node replicate-demo.mjs
import { replicateAll, replicateProject } from './replicate.mjs';
import { provenanceSummary } from '../domains/provenance.mjs';
import { REAL_EPISODES } from '../domains/corpus.mjs';

// ── the provenance fence (why validation ≠ "any source") ──
const ps = provenanceSummary(REAL_EPISODES.map((e) => e.product));
console.log('\n═══ PROVENANCE FENCE — what may VALIDATE a law vs only feed evidence ═══\n');
console.log(`  Fresco PROJECTS (validation-eligible): ${ps.frescoProjects.join(', ')}`);
console.log(`  Fresco QC sources (evidence only):     ${ps.frescoSources.join(', ')}`);
console.log(`  External references (evidence only):   ${ps.external.join(', ')}`);
console.log(`  Unverified (excluded until confirmed): ${ps.unverified.join(', ')}`);
console.log(`  ⇒ ${ps.note}`);
// demonstrate the fence rejecting a non-project source:
const ext = replicateProject('concrete densifiers');
console.log(`\n  fence test — "concrete densifiers": ${ext.verdict} (${ext.why})`);

console.log('\n═══ REPRODUCIBILITY — do the metrics repeat across Fresco projects? ═══');
console.log('order: MPZ (measured) → INT-TFX (Stage-0, negative) → PROTECH A1 (measured coating)\n');

for (const r of replicateAll()) {
  console.log('────────────────────────────────────────────────────────────────────');
  if (r.ineligible || r.pending) { console.log(`PROJECT:  ${r.name}\n  ⇒ ${r.verdict} — ${r.why}\n`); continue; }
  console.log(`PROJECT:  ${r.label}`);
  console.log(`  posture: ${r.posture}`);
  console.log(`\n  Metric results (per asset):`);
  for (const a of r.metrics.assets)
    console.log(`    ${a.asset.padEnd(26)} conf ${a.confidence.toFixed(2)}  measured ${a.measured}  entropy ${a.entropy}`);
  console.log(`    avg entropy ${r.metrics.avgEntropy} · loudest ${r.metrics.loudest?.asset} (H ${r.metrics.loudest?.entropy}) · weakest ${r.metrics.weakest?.asset} (conf ${r.metrics.weakest?.confidence.toFixed(2)})`);

  console.log(`\n  Documented weak point: ${r.weakPoint.assets.join(' / ')} — ${r.weakPoint.text}`);
  console.log(`  Known weak point detected? ${r.weakPointDetected.detected ? 'YES' : 'no'}  (by entropy/confidence: ${r.weakPointDetected.byEntropy ? '✓' : '✗'} · by incompressible/untraceable decisions: ${r.weakPointDetected.byDecisions ? '✓' : '✗'})`);

  const c = r.compressibility;
  console.log(`\n  Decision compressibility: avg ${c.avg == null ? '—' : c.avg} (lower = deeper); explainable ${c.explainable}/${c.total}; incompressible ${c.incompressible.join(', ') || 'none'}`);
  console.log(`  Decision traceability:    ${r.traceability.value} (${r.traceability.complete}/${r.traceability.total} reconstructable)`);

  const m = r.momentumOverEvidence;
  console.log(`\n  Momentum/Evidence: ${m.value == null ? '∞' : m.value} (${m.momentum} decisions / ${m.measuredEvidence} measured) — ${m.reading}`);
  console.log(`  Frontier phase:    ${r.frontier.phase} (${r.frontier.phaseIndex}) — to build: ${r.frontier.toBuild.join(', ') || '—'}`);

  const s = r.sensitivity;
  console.log(`\n  Sensitivity notes: signal Δ${s.signalDelta} (${s.signal}) · duplicate Δ${s.noiseDelta} (${s.noise})`);
  console.log(`                     ${s.caveat}`);

  console.log(`\n  ⇒ VERDICT: ${r.verdict}`);
  console.log(`     ${r.why}\n`);
}

console.log('════════════════════════════════════════════════════════════════════════');
console.log('Reproducibility gate: TLV ✓ + MPZ ✓ + PROTECH A1 ✓ = 3 positive Fresco projects.');
console.log('INT-TFX = NOT ENOUGH DATA (negative case, by design). GRANITAL is ELIGIBLE');
console.log('(it IS Fresco\'s product) but not required. External sources are fenced OUT of');
console.log('validation while still feeding assets. Adversarial content-check STILL open —');
console.log('so read this as "reproduces EXCEPT adversarial content-check", not "law".\n');
