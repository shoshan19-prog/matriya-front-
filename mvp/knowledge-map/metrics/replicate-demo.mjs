// Reproducibility run: MPZ → INT-TFX (the order the validation plan calls for).
//   run: node replicate-demo.mjs
import { replicateAll } from './replicate.mjs';

console.log('\n═══ REPRODUCIBILITY — do the metrics repeat beyond Tel Aviv? ═══');
console.log('order: MPZ (measured, good test) → INT-TFX (Stage-0, negative case)\n');

for (const r of replicateAll()) {
  console.log('────────────────────────────────────────────────────────────────────');
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
console.log('Reproducibility gate so far: TLV ✓ + MPZ → counts toward the ≥3 bar.');
console.log('INT-TFX is the NEGATIVE case: too thin to test — and the metric says so');
console.log('rather than inventing a result. No metric promoted; adversarial gap still open.');
console.log('Read every result as "reproduces EXCEPT adversarial content-check".\n');
