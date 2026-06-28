// Knowledge Assets — the primary unit of MATRIYA.   run: node demo.mjs
// Built from the real 8-product corpus. Internal numbers are real; frontier &
// external are honest gaps/pointers (never claimed as evidence we have).

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets, renderAssetCard, assetGaps, nextKnowledgeAsset } from './knowledge-asset.mjs';

const assets = buildKnowledgeAssets(REAL_EPISODES);

console.log('═══ KNOWLEDGE ASSETS — the scientific unit (product/episode/doc are below it) ═══\n');
console.log('  Asset                          Cat.            Evid  Meas  Prod  Conf  DeadE  OpenQ  ExpGain');
for (const a of assets)
  console.log(`  ${a.name.padEnd(28)} ${a.category.padEnd(15)} ${String(a.evidence).padStart(4)} ${String(a.measured).padStart(5)} ${String(a.products).padStart(5)}  ${a.confidence.toFixed(2)}   ${String(a.deadEnds).padStart(3)}   ${String(a.openQuestions).padStart(4)}   ${a.expectedGain}`);

console.log('\n═══ ONE ASSET CARD (the unit, in full) ═══\n');
const comp = assets.find((a) => a.name === 'Compression Strength');
console.log(renderAssetCard(comp).split('\n').map((l) => '  ' + l).join('\n'));

console.log('\n═══ ROUTER — not "where is a document?" but "which asset is incomplete?" ═══\n');
for (const name of ['Compression Strength', 'Adhesion']) {
  const g = assetGaps(assets.find((a) => a.name === name));
  console.log(`  ${g.asset}  (confidence ${g.confidence.toFixed(2)})`);
  console.log(`    missing : ${g.missing.join(' · ')}`);
  console.log(`    look in : ${g.lookIn.join(', ')}  (SharePoint · Drive · Priority · Gmail · scanned binders · papers)`);
}

console.log('\n═══ PROTEUS — "Next Knowledge Asset", not "Next Product" ═══\n');
const ranked = nextKnowledgeAsset(assets);
for (const r of ranked.slice(0, 5))
  console.log(`  acquire ${r.asset.padEnd(28)} need "${r.need}"   expected gain ${r.expectedGain}  (conf ${r.confidence.toFixed(2)})`);
const top = ranked[0];
console.log(`\n  ▶ ACQUIRE: ${top.asset}  ↑  NEED: ${top.need}  ↑  EXPECTED GAIN: ${top.expectedGain}`);
console.log(`    look in: ${top.lookIn.join(', ')}   — PENDING HUMAN APPROVAL (governance: recommend, don't auto-extract)`);

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Raw Sources → Collectors → Normalizer → Identity → Episodes → KNOWLEDGE ASSETS');
console.log('→ Domains → Patterns → PROTEUS.  The product is no longer the center; the');
console.log('scientific asset is. Any new pipe (Gmail, SharePoint, BASF) just feeds evidence');
console.log('into the SAME assets — 500 products or 300,000 emails, the core is unchanged.');
