// Knowledge Frontier — WHY each asset is incomplete.   run: node demo.mjs

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { replayTransformations } from '../transformations/transformation.mjs';
import { classifyFrontier, retrievalSaturated, lawStatement } from './frontier.mjs';

const assets = buildKnowledgeAssets(REAL_EPISODES);
const trans = replayTransformations(REAL_EPISODES);
const frontier = classifyFrontier(assets, trans);

console.log('═══ KNOWLEDGE FRONTIER — not "what is missing" but WHY ═══\n');
console.log('  asset                          conf  measured  FRONTIER TYPE        expected ΔK');
for (const f of frontier.sort((a, b) => a.frontierType.localeCompare(b.frontierType)))
  console.log(`  ${f.asset.padEnd(28)} ${f.confidence.toFixed(2)}    ${String(f.measured).padStart(2)}     ${f.frontierType.padEnd(18)} ${f.expectedDK}`);

console.log('\n═══ TWO FRONTIER CARDS (why retrieve vs why generate) ═══\n');
for (const name of ['Adhesion', 'Compression Strength']) {
  const f = frontier.find((x) => x.asset === name);
  console.log(`  Asset: ${f.asset}`);
  console.log(`    Status:            ${f.frontierType}`);
  console.log(`    Reason:            ${f.reason}`);
  console.log(`    Closing Action:    ${f.closingAction}`);
  console.log(`    Expected ΔK:       ${f.expectedDK}\n`);
}

console.log('═══ THE STRUCTURAL LAW (FSCTM breakpoint) ═══\n');
console.log('  ' + lawStatement.replace(/\. /g, '.\n  '));

console.log('\n  evidence for the breakpoint on Compression (retrieval saturated):');
const comp = assets.find((a) => a.name === 'Compression Strength');
console.log('   ', JSON.stringify(retrievalSaturated('Compression Strength', trans, comp.confidence)));

console.log('\n═══ PROTEUS now reports FRONTIER STATUS, not just "next event" ═══\n');
const counts = frontier.reduce((m, f) => ((m[f.frontierType] = (m[f.frontierType] || 0) + 1), m), {});
console.log('  ' + Object.entries(counts).map(([k, v]) => `${k}:${v}`).join('  '));
const generate = frontier.filter((f) => f.frontierType === 'GENERATE_REQUIRED').map((f) => f.asset);
const external = frontier.filter((f) => f.frontierType === 'EXTERNAL_ONLY').map((f) => f.asset);
const retrievable = frontier.filter((f) => f.frontierType === 'RETRIEVE_AVAILABLE').map((f) => f.asset);
console.log(`\n  → still RETRIEVABLE (corpus): ${retrievable.join(', ') || '—'}`);
console.log(`  → must be GENERATED (lab):    ${generate.join(', ')}`);
console.log(`  → EXTERNAL only (standards):  ${external.join(', ')}`);

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('The Frontier explains WHY the acquisition engine stops searching and starts');
console.log('generating: a structural boundary between the existing corpus and the research');
console.log('frontier. The last governance layer before Scientific Laws.');
