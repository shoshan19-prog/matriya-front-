// Evidence atom · Knowledge Compression · Knowledge Entropy (+3).  run: node demo.mjs

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { evidenceFromCorpus, eventsFromEvidence } from './evidence.mjs';
import { compress } from './compression.mjs';
import { assetEntropy, groupEntropy, silence, staleness, entropyGradient } from './entropy.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';

console.log('═══ IDEA 1 — EVIDENCE ATOM (the unit below the Knowledge Event) ═══\n');
const atoms = evidenceFromCorpus();
const events = eventsFromEvidence(atoms);
console.log(`  ${atoms.length} evidence atoms  →  ${events.length} knowledge events  (events are AGGREGATES of evidence)`);
console.log('  sample atoms:');
for (const a of atoms.slice(0, 4)) console.log(`    [${a.kind.padEnd(11)}] ${a.source} · ${a.asset || '—'} · "${(a.raw || '').slice(0, 46)}"`);
console.log('  every adapter (SharePoint/Drive/Gmail/lab/photo) just emits Evidence; the rest is assembled.');

console.log('\n═══ IDEA 2 — KNOWLEDGE COMPRESSION (the system summarizes its own memory) ═══\n');
const c = compress(atoms);
console.log(`  ${c.atoms} atoms → ${c.patterns.length} "Pattern Learned" events (originals retained):`);
for (const p of c.patterns) console.log(`    ✦ ${p.statement}  [support ${p.support}, conf ${p.confidence}]`);
console.log(`  compression: ${c.patterns.length} patterns stand in for ${Math.round(c.compressionRatio * 100)}% of the atoms.`);

console.log('\n═══ IDEA 3 — KNOWLEDGE ENTROPY (how ORDERED, not how much) ═══\n');
const assets = buildKnowledgeAssets(REAL_EPISODES);
console.log('  asset                          confidence  entropy');
for (const a of [...assets].sort((x, y) => assetEntropy(y) - assetEntropy(x)))
  console.log(`  ${a.name.padEnd(28)} ${a.confidence.toFixed(2)}        ${assetEntropy(a)}`);
const silicate = REAL_EPISODES.filter((e) => ['GRANITAL', 'BETONIZE', 'PROTECH A1', 'F.SILICATO', 'Sloxan/LASUR'].includes(e.product));
const tfx = REAL_EPISODES.filter((e) => e.product === 'INT-TFX');
console.log(`\n  two "projects":`);
console.log(`    silicate-coatings family : entropy ${groupEntropy(silicate).entropy}  (connected, measured, converged)`);
console.log(`    INT-TFX (Stage-0)        : entropy ${groupEntropy(tfx).entropy}  (unknowns, unverified, open)`);
console.log('    ⇒ "we don\'t lack information — we lack ORDER."');

console.log('\n═══ NEW IDEA A — SILENCE (negative evidence = the dark matter) ═══\n');
const s = silence();
console.log(`  ${s.totalAbsentRecords} expected measurements are systematically ABSENT.`);
for (const x of s.loudestSilence) console.log(`    🔇 ${x.asset}: ${x.silent} silent (expected-but-missing)`);
console.log(`  ⇒ ${s.note}`);

console.log('\n═══ NEW IDEA B — EVIDENCE HALF-LIFE (knowledge decays; entropy rises with age) ═══\n');
for (const x of staleness().stalest) console.log(`    ⏳ ${x.asset.padEnd(28)} freshness ${x.freshness}  (stale-entropy +${x.staleEntropy})`);
console.log(`  ⇒ ${staleness().note}`);

console.log('\n═══ NEW IDEA C — ENTROPY GRADIENT (which action ORDERS knowledge fastest) ═══\n');
console.log('  PROTEUS objective reframed: maximize entropy reduction per ₪.');
for (const g of entropyGradient().slice(0, 5))
  console.log(`    ${g.event.padEnd(22)} ${g.asset.padEnd(20)} entropy ${g.entropyBefore} · ΔH ${g.dEntropy} · gradient ${g.gradient}/₪1k`);

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Stack: Evidence → Knowledge Events → Compression → Entropy → Decision → Law.');
console.log('Maybe the goal of MATRIYA is not to "find laws" but to REDUCE the entropy of');
console.log('knowledge — an objective measure of how much the lab truly understands the problem.');
