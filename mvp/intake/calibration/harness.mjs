// Identity Calibration Harness — makes the Identity Resolver MEASURABLE.
//   run:  node harness.mjs
//
// Turns "looks right" into precision / recall / false-link / calibration, then
// applies: recalibration (#1), per-type reweighting (#2), risk-budget threshold
// (innov #1), adversarial false-link (innov #2). Writes nothing to the graph.
import { writeFileSync } from 'node:fs';
import { LABELED } from './labeled-set.mjs';
import { normalize } from '../normalizer.mjs';
import { classify } from '../classifier.mjs';
import { link } from '../linker.mjs';
import { confusion, calibration, selectiveThreshold, perTypeReliability } from './metrics.mjs';
import { fitCalibrator } from './calibrator.mjs';

const meta = { system: 'test', site: 'fixture', collector: 'harness', fetched_at: '2026-06-26' };

// Run one labeled item -> { id, gold, pred:{product,confidence}, evidenceTypes }
function predict(item, typeReliability = {}) {
  let d = classify(normalize({ source_id: item.id, name: item.signals.name, path: item.signals.path }, meta));
  d = link(d, { content: item.signals.content, metadata: item.signals.metadata }, undefined, typeReliability);
  let product = d.product?.name || null, confidence = 0, evidenceTypes = [];
  if (product) {
    if (d.product.score != null) { confidence = d.product.score; evidenceTypes = (d.identity?.resolved?.evidence || []).map((e) => e.split('=')[0]); }
    else { confidence = d.product.confidence === 'VERIFIED' ? 0.95 : 0.75; evidenceTypes = [d.product.confidence === 'VERIFIED' ? 'name' : 'path']; }
  }
  return { id: item.id, gold: item.gold, pred: { product, confidence: +confidence.toFixed(3) }, evidenceTypes };
}

const raw = LABELED.map((it) => predict(it));

console.log('================ IDENTITY CALIBRATION HARNESS ================');
console.log(`labeled items: ${LABELED.length} (incl. ${LABELED.filter((i) => i.id.startsWith('A')).length} adversarial, ${LABELED.filter((i) => !i.gold.product).length} true orphans)\n`);

const m0 = confusion(raw);
console.log('— RAW —');
console.log(`  precision ${m0.precision}  recall ${m0.recall}  false-link ${m0.false_link_rate}   (TP ${m0.TP} FP ${m0.FP} FN ${m0.FN} TN ${m0.TN})`);
const cal0 = calibration(raw);
console.log('  calibration (linked):'); cal0.rows.forEach((r) => r.n && console.log(`    conf ${r.band}: n=${r.n} mean_conf=${r.mean_conf} ACTUAL acc=${r.accuracy}`));
console.log(`  ECE (calibration error) = ${cal0.ece}   ${cal0.ece > 0.1 ? '← high: raw scores are NOT trustworthy probabilities' : ''}\n`);

// --- improvement #1: recalibrate raw confidence -> empirical probability ---
const calibrate = fitCalibrator(raw);
const recal = raw.map((p) => ({ ...p, pred: { ...p.pred, confidence: calibrate(p.pred.confidence) } }));
const cal1 = calibration(recal);
console.log('— #1 RECALIBRATED —');
console.log(`  ECE ${cal0.ece} → ${cal1.ece}  (lower = calibrated; "0.9" now means ~90%)`);

// --- improvement #2: learn per-entity-type reliability, reweight, re-run ---
const typeRel = perTypeReliability(raw);
console.log('\n— #2 PER-ENTITY-TYPE RELIABILITY (learned) —');
console.log('  ' + Object.entries(typeRel).map(([t, r]) => `${t}:${r}`).join('  '));
const reweighted = LABELED.map((it) => predict(it, typeRel));
const m2 = confusion(reweighted);
console.log(`  precision ${m0.precision} → ${m2.precision}   false-link ${m0.false_link_rate} → ${m2.false_link_rate}  (down-weighting unreliable types)`);

// --- innovation #1: risk-budgeted auto-link threshold (target precision) ---
const target = 0.95;
const sel = selectiveThreshold(recal, target);
console.log(`\n— innov #1 RISK-BUDGETED THRESHOLD (target precision ${target}) —`);
console.log(`  auto-link at calibrated confidence ≥ ${sel.threshold}  →  precision ${sel.precision_at}, coverage ${sel.coverage}`);

// --- innovation #2: adversarial false-link rate ---
const adv = reweighted.filter((p) => p.id.startsWith('A'));
const advM = confusion(adv);
console.log(`\n— innov #2 ADVERSARIAL ("mention-in-passing") —`);
adv.forEach((p) => console.log(`  ${p.id}: gold=${p.gold.product || 'orphan'}  pred=${p.pred.product || 'orphan'}  ${p.pred.product === p.gold.product ? '✓' : '✗ FALSE-LINK'}`));
console.log(`  adversarial false-link rate: ${advM.false_link_rate}`);

// --- routing per the agreed thresholds (on calibrated confidence) ---
const bucket = (c) => (c >= 0.95 ? 'auto' : c >= 0.70 ? 'review' : 'orphan');
const route = { auto: [], review: [], orphan: [] };
for (const p of recal) route[p.pred.product ? bucket(p.pred.confidence) : 'orphan'].push(p);
console.log('\n— ROUTING (≥0.95 auto · 0.70–0.95 review · <0.70 orphan) —');
for (const k of ['auto', 'review', 'orphan']) {
  const b = route[k]; const correct = b.filter((p) => p.pred.product === p.gold.product).length;
  console.log(`  ${k.padEnd(7)} ${b.length} item(s)  accuracy ${b.length ? (correct / b.length).toFixed(2) : '—'}`);
}

writeFileSync(new URL('./_results.local.json', import.meta.url).pathname, JSON.stringify({ raw, recal, typeRel, sel, m0, m2 }, null, 2));
console.log('\n(detailed per-item results written locally to _results.local.json — not committed)');
console.log('\nVERDICT: identity links are now MEASURED. Do NOT write to the graph until');
console.log('the real 30–50 human-labeled set replaces the fixture and ECE + precision hold.');
