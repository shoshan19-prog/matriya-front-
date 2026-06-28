// Knowledge Transformation Layer (Phase 5.5) — physics of knowledge.  run: node demo.mjs
// Replays the real 8-product acquisition and shows how knowledge CHANGED.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { replayTransformations, impactRanking, rdRoi, revisions, lawCandidates, transformationType } from './transformation.mjs';
import { learnVoIPriors, expectedKnowledgeChange } from './voi.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';

const T = replayTransformations(REAL_EPISODES);

console.log('═══ KNOWLEDGE TRANSFORMATIONS — State(t0) → Evidence → State(t1) ═══\n');
console.log('  step  product            asset                     conf      Δconf  surprise');
for (const t of T)
  console.log(`   ${t.step}    ${t.product.padEnd(18)} ${t.asset.padEnd(24)} ${t.conf_before.toFixed(2)}→${t.conf_after.toFixed(2)}  ${(t.dConf>=0?'+':'')}${t.dConf.toFixed(2)}    ${t.surprise}`);

console.log('\n═══ ONE TRANSFORMATION, in full (the Adhesion-style story you asked for) ═══\n');
const ad = T.filter((t) => t.asset === 'Adhesion');
for (const t of ad)
  console.log(`  step ${t.step} [${t.product}]  Adhesion  conf ${t.conf_before.toFixed(2)} → ${t.conf_after.toFixed(2)}  (Δ${t.dConf}), measured ${t.dMeasured>=0?'+':''}${t.dMeasured}, type=${transformationType(t)}`);
console.log('  → still 0 measured after every step → confidence stuck low. Pull-off evidence would transform it.');

console.log('\n═══ Which evidence MOVED knowledge / which was REDUNDANT ═══\n');
const imp = impactRanking(T);
console.log('  biggest confidence gains:');
for (const t of imp.biggest)
  console.log(`    +${t.dConf.toFixed(2)}  ${t.asset.padEnd(24)} via ${t.product} (${transformationType(t)})`);
console.log(`  redundant evidence (Δconf≈0, no knowledge added): ${imp.redundant.length} transformation(s)` +
  (imp.redundant.length ? ' — ' + imp.redundant.map((t) => `${t.asset}/${t.product}`).join(', ') : ''));

console.log('\n═══ R&D ROI per product (Σ Δconfidence it produced) ═══\n');
for (const r of rdRoi(T))
  console.log(`  ${r.dConfTotal.toFixed(2)}  ${r.product.padEnd(20)} touched ${r.assetsTouched} assets, ${r.surprises} surprise(s)`);

console.log('\n═══ INNOVATION 2 — SURPRISE / KNOWLEDGE REVISIONS (where real learning happened) ═══\n');
for (const t of revisions(T).slice(0, 6))
  console.log(`  surprise ${t.surprise}  ${t.asset.padEnd(24)} via ${t.product}  ${t.created ? '(opened asset)' : t.introducedMeasured ? '(first measurement)' : t.dConf < 0 ? `(conf DROPPED ${t.dConf} — diluted grounding)` : ''}`);

console.log('\n═══ INNOVATION 1 — VALUE OF INFORMATION (expected knowledge change, learned) ═══\n');
const priors = learnVoIPriors(T);
console.log('  learned priors (avg Δconfidence per evidence type):');
for (const [k, v] of Object.entries(priors)) console.log(`    ${k.padEnd(26)} ${v.avgDConf >= 0 ? '+' : ''}${v.avgDConf}  (n=${v.n})`);
const assetsNow = buildKnowledgeAssets(REAL_EPISODES);
const ekc = expectedKnowledgeChange(assetsNow, priors);
console.log('\n  PROTEUS — ranked by EXPECTED knowledge change (not gap size):');
for (const e of ekc.slice(0, 5))
  console.log(`    ΔK≈${e.expectedKnowledgeChange.toFixed(3)}  acquire ${e.asset.padEnd(24)} via "${e.event}"  need "${e.need}"`);
const top = ekc[0];
console.log(`\n  ▶ HIGHEST VALUE OF INFORMATION: ${top.asset} — "${top.event}" evidence, expected ΔK ≈ ${top.expectedKnowledgeChange.toFixed(3)}`);
console.log(`    ${top.basis};  look in: ${top.lookIn.join(', ')}  — PENDING HUMAN APPROVAL`);

console.log('\n═══ PHASE 6 BRIDGE — LAW CANDIDATES (emerge from converged transformations) ═══\n');
const laws = lawCandidates(T);
if (!laws.length) console.log('  (no asset has converged enough yet)');
for (const l of laws) console.log(`  ✔ ${l.asset}: ${l.reason} (conf ${l.confidence}, ${l.transformations} transformations)`);
console.log('\n  Laws are NOT hand-written. They emerge when an asset\'s transformations stop revising it.');

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Phase 5.5: knowledge is no longer a snapshot but a trajectory. We can now ask');
console.log('which measurement changed our knowledge and by how much — the true KPI of R&D.');
