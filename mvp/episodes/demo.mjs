// Knowledge Episodes demo — files become decision cycles.  run: node demo.mjs
import { buildEpisodes } from './episode.mjs';
import { buildDeadEndIndex, checkDeadEnd } from './deadends.mjs';
import { buildThreads } from './threads.mjs';

// Docs already through the Identity Engine: each carries an anchor (version/product).
// THREE different files share v043 -> they must collapse into ONE episode.
const TLV = 'טיח תל אביב';
const docs = [
  { id: 'd1', name: 'Compression_Test.xlsx', anchor: { version: 'v043', product: TLV }, content: 'איך להגדיל חוזק לחיצה? השערה: להגדיל Microsilica. v043. 34 MPa. החלטה: לא מספיק כי ירידה בעבידות. next: להעלות Superplasticizer.' },
  { id: 'd2', name: 'Brookfield.xlsx', anchor: { version: 'v043', product: TLV }, content: 'v043 צמיגות 4200 cps.' },
  { id: 'd3', name: 'SEM.jpg', anchor: { version: 'v043', product: TLV }, content: 'v043 SEM 50µm.' },
  { id: 'd4', name: 'mix_v044.xlsx', anchor: { version: 'v044', product: TLV }, content: 'השערה: להעלות Superplasticizer. v044. 38 MPa. החלטה: מספיק, אושר לייצור.' },
];

const { episodes, unassigned } = buildEpisodes(docs);
console.log(`built ${episodes.length} episodes from ${docs.length} files (${unassigned} unassigned)\n`);

const e = episodes[0];
console.log(`■ ${e.episode_id}  [${e.product} ${e.anchor.version}]  — unifies ${e.documents.length} files: ${e.doc_types.join(', ')}`);
console.log(`  Question     : ${e.question}`);
console.log(`  Hypothesis   : ${e.hypothesis}`);
console.log(`  Experiment   : ${e.experiment.id}`);
console.log(`  Results      : ${e.results.map((r) => `${r.value}${r.unit}(${r.source_name})`).join(', ')}`);
console.log(`  Decision     : ${e.decision.outcome.toUpperCase()}  (confidence ${e.decision.confidence})`);
console.log(`  Why          : ${e.why}`);
console.log(`  Next action  : ${e.next_action}`);
console.log(`  → the SAME experiment is Compression + Brookfield + SEM, not 3 orphan files.`);

console.log('\n— DECISION MEMORY (per episode) —');
for (const ep of episodes) console.log(`  ${ep.episode_id}: ${ep.decision.outcome}  because "${ep.decision.reason || '—'}"  evidence ${ep.decision.evidence.length} item(s)  conf ${ep.decision.confidence}`);

console.log('\n— INNOVATION A: DEAD-END MEMORY (what already failed) —');
const dead = buildDeadEndIndex(episodes);
dead.forEach((d) => console.log(`  ✗ ${d.episode_id}: tried "${d.tried}" → failed because "${d.failed_because}"  (measured ${d.measured.join(', ')})`));
const probe = checkDeadEnd(dead, 'בוא ננסה להגדיל Microsilica לשיפור חוזק');
console.log(`  PROTEUS guard — proposing "${probe.proposed}":`);
console.log(`    ${probe.warning ? '⚠ ALREADY TRIED & FAILED: ' + probe.prior_failures.map((f) => f.episode_id + ' (' + f.failed_because + ')').join('; ') : 'no prior failure on record'}`);

console.log('\n— INNOVATION B: CAUSAL THREADS (decision lineage) —');
const { edges, threads } = buildThreads(episodes);
edges.forEach((x) => console.log(`  ${x.from} → ${x.to}   via ${x.via}`));
threads.forEach((t) => console.log(`  THREAD: ${t.join(' → ')}   (the story of how the formula evolved)`));

console.log('\nMATRIYA now remembers "the experiment where we swapped the binder because APP collapsed at high temp" —');
console.log('not "Compression_2023_v4.xlsx". The unit of knowledge is the decision episode.');
