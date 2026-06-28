// Identity Calibration Harness — makes the Knowledge Identity Engine MEASURABLE.
//   run:  node harness.mjs   (writes nothing to the graph)
import { writeFileSync } from 'node:fs';
import { LABELED } from './labeled-set.mjs';
import { normalize } from '../normalizer.mjs';
import { classify } from '../classifier.mjs';
import { link } from '../linker.mjs';
import { DEFAULT_AUTHORITY } from '../authority.mjs';
import { attribute, updateAuthority } from '../feedback.mjs';
import { confusion, calibration, selectiveThreshold } from './metrics.mjs';
import { fitCalibrator } from './calibrator.mjs';

const meta = { system: 'test', site: 'fixture', collector: 'harness', fetched_at: '2026-06-26' };

function predict(item, authority = DEFAULT_AUTHORITY) {
  let d = classify(normalize({ source_id: item.id, name: item.signals.name, path: item.signals.path }, meta));
  d = link(d, { content: item.signals.content, metadata: item.signals.metadata }, undefined, authority);
  const chain = d.identity?.resolved?.chain || [];
  let product = d.product?.name || null, confidence = 0;
  if (product) confidence = d.product.score != null ? d.product.score : (d.product.confidence === 'VERIFIED' ? 0.95 : 0.75);
  return { id: item.id, gold: item.gold, pred: { product, confidence: +confidence.toFixed(3) }, chain };
}

const raw = LABELED.map((it) => predict(it));
console.log('============ KNOWLEDGE IDENTITY ENGINE — CALIBRATION ============');
console.log(`labeled: ${LABELED.length} (adversarial ${LABELED.filter((i) => i.id.startsWith('A')).length}, true orphans ${LABELED.filter((i) => !i.gold.product).length})\n`);

const m0 = confusion(raw);
console.log('— with Authority + Evidence-Chain + Margin —');
console.log(`  precision ${m0.precision}  recall ${m0.recall}  false-link ${m0.false_link_rate}  (TP ${m0.TP} FP ${m0.FP} FN ${m0.FN} TN ${m0.TN})`);
const c0 = calibration(raw); console.log(`  calibration ECE ${c0.ece}`);

// recalibration (#1)
const cal = fitCalibrator(raw);
const recal = raw.map((p) => ({ ...p, pred: { ...p.pred, confidence: cal(p.pred.confidence) } }));
console.log(`  recalibrated ECE ${calibration(recal).ece}`);

// feedback learning (#4) → updated authority
const attribution = attribute(raw.map((p) => ({ chain: p.chain, predProduct: p.pred.product, goldProduct: p.gold.product })));
const { authority: learned, changes } = updateAuthority(DEFAULT_AUTHORITY, attribution);
console.log('\n— feedback attribution (which entity helped / misled) —');
changes.sort((a, b) => b.misled - a.misled || b.correct - a.correct).forEach((c) =>
  console.log(`  ${c.type.padEnd(13)} helped ${c.correct}  misled ${c.misled}  → authority ${c.before} → ${c.after}`));
const after = LABELED.map((it) => predict(it, learned));
const m1 = confusion(after);
console.log(`  after learning: precision ${m0.precision}→${m1.precision}  false-link ${m0.false_link_rate}→${m1.false_link_rate}`);

// risk-budget threshold (innov #1)
const sel = selectiveThreshold(recal, 0.95);
console.log(`\n— risk-budgeted auto-link (target precision 0.95) —`);
console.log(`  threshold ≥ ${sel.threshold} → precision ${sel.precision_at}, coverage ${sel.coverage}`);

// adversarial (innov #2)
const adv = after.filter((p) => p.id.startsWith('A'));
console.log('\n— adversarial (mention-in-passing) —');
adv.forEach((p) => console.log(`  ${p.id}: gold=${p.gold.product || 'orphan'} pred=${p.pred.product || 'orphan/review'} ${p.pred.product === p.gold.product ? '✓' : '✗'}`));
console.log(`  adversarial false-link: ${confusion(adv).false_link_rate}`);

writeFileSync(new URL('./_results.local.json', import.meta.url).pathname, JSON.stringify({ raw, learned, changes, sel }, null, 2));
console.log('\nVERDICT: measured. No graph writes until real 30–50 human labels replace the fixture.');
