// Learning Pattern Engine — meta-learning over Episodes.   run: node demo.mjs
//
// TWO runs, on purpose:
//   A) an ILLUSTRATIVE set of labeled change-cycles (NOT extracted from the
//      corpus) — enough volume to show the engine actually MINE patterns.
//   B) the REAL טיח תל אביב episodes — only a handful, so the engine HONESTLY
//      reports "insufficient support / HYPOTHESIS". That honesty is the point:
//      the engine is evidence-based; the patterns wait for real Episode volume.

import { STAGE, extractStages, classifyOutcome, renderPath } from './process.mjs';
import { metaInsights, stageOutcomeContrast, minePaths, pairContrast, trialsToFreeze } from './patterns.mjs';
import { buildEpisodes } from '../../episodes/episode.mjs';

const S = STAGE;
const ALL = Object.values(STAGE);

// ─────────────────────────────────────────────────────────────────────────────
// A)  ILLUSTRATIVE labeled cycles — to exercise the miner. NOT corpus-derived.
//     Encodes three candidate patterns we want the engine to (dis)confirm:
//       • a canonical change path, • skip-SEM → more re-trials,
//       • field-feedback + lab-measurement together → higher success.
// ─────────────────────────────────────────────────────────────────────────────
const canon = [S.FIELD_REPORT, S.MEETING, S.SUPPLIER_CHANGE, S.LAB_TRIAL, S.MEASURE_COMPRESSION, S.DECISION, S.PRODUCTION];
const ill = [
  // succeeded WITH SEM + field + compression
  { id:'c1', stages:[S.FIELD_REPORT,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.MEASURE_SEM,S.DECISION,S.PRODUCTION], outcome:'accepted' },
  { id:'c2', stages:[S.FIELD_REPORT,S.MEETING,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.MEASURE_SEM,S.DECISION,S.PRODUCTION], outcome:'accepted' },
  { id:'c3', stages:[S.SUPPLIER_CHANGE,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.MEASURE_SEM,S.DECISION,S.PRODUCTION], outcome:'accepted' },
  { id:'c4', stages:[S.FIELD_REPORT,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.MEASURE_SEM,S.DECISION], outcome:'accepted' },
  { id:'c5', stages:[S.FIELD_REPORT,S.MEETING,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.MEASURE_SEM,S.DECISION,S.PRODUCTION], outcome:'accepted' },
  // re-trials WITHOUT SEM
  { id:'c6', stages:[S.LAB_TRIAL,S.MEASURE_VISCOSITY,S.DECISION], outcome:'retrial' },
  { id:'c7', stages:[S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.DECISION], outcome:'retrial' },
  { id:'c8', stages:[S.SUPPLIER_CHANGE,S.LAB_TRIAL,S.MEASURE_VISCOSITY,S.DECISION], outcome:'retrial' },
  { id:'c9', stages:[S.LAB_TRIAL,S.MEASURE_VISCOSITY,S.DECISION], outcome:'retrial' },
  { id:'c10', stages:[S.LAB_TRIAL,S.DECISION], outcome:'rejected' },
  // mixed: field+compression but no SEM — succeeds sometimes
  { id:'c11', stages:[S.FIELD_REPORT,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.DECISION,S.PRODUCTION], outcome:'accepted' },
  { id:'c12', stages:[S.FIELD_REPORT,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.DECISION], outcome:'accepted' },
  // viscosity-only decisions → re-trial
  { id:'c13', stages:[S.LAB_TRIAL,S.MEASURE_VISCOSITY,S.DECISION], outcome:'retrial' },
  { id:'c14', stages:[S.LAB_TRIAL,S.MEASURE_VISCOSITY,S.DECISION], outcome:'retrial' },
];
// a few illustrative threads (cycles chained to a frozen formula)
const illThreads = [
  { path: renderPath(canon), sequence: canon, frozen:true, trials:4 },
  { path: renderPath(canon), sequence: canon, frozen:true, trials:5 },
  { path: renderPath(canon), sequence: canon, frozen:true, trials:6 },
  { path: renderPath([S.SUPPLIER_CHANGE,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.DECISION,S.PRODUCTION]),
    sequence:[S.SUPPLIER_CHANGE,S.LAB_TRIAL,S.MEASURE_COMPRESSION,S.DECISION,S.PRODUCTION], frozen:true, trials:5 },
  { path: renderPath(canon), sequence: canon, frozen:true, trials:5 },
];

console.log('═══ A) ILLUSTRATIVE cycles (NOT corpus-derived) — does the engine mine patterns? ═══');
console.log(`   ${ill.length} labeled cycles, ${illThreads.length} threads.\n`);

const { insights, paths, t2f } = metaInsights(ill, ALL, illThreads);
console.log('  ── META-INSIGHTS (gated by evidence) ──');
for (const i of insights) console.log(`   ${i.tag.padEnd(13)} (n=${i.n})  ${i.text}`);

console.log('\n  ── canonical path ──');
console.log(`   ${paths.canonical.path}   (support ${paths.canonical.support})`);
console.log(`   trials-to-freeze: mean ${t2f.mean} (range ${t2f.min}–${t2f.max}, n=${t2f.n})  [${t2f.evidence}]`);

console.log('\n  ── targeted contrast: SEM present vs skipped ──');
const sem = stageOutcomeContrast(ill, [S.MEASURE_SEM])[0];
console.log(`   success with SEM ${(sem.p_with*100).toFixed(0)}% vs without ${(sem.p_without*100).toFixed(0)}%`);
console.log(`   re-trial with SEM ${(sem.retrial_with*100).toFixed(0)}% vs without ${(sem.retrial_without*100).toFixed(0)}%   [${sem.evidence}]`);

console.log('\n  ── targeted pair: FIELD_REPORT + MEASURE_COMPRESSION together ──');
const pc = pairContrast(ill, S.FIELD_REPORT, S.MEASURE_COMPRESSION);
console.log(`   success when BOTH present ${(pc.p_both*100).toFixed(0)}% vs otherwise ${(pc.p_rest*100).toFixed(0)}% (lift ${pc.lift===Infinity?'∞':pc.lift.toFixed(2)})  [${pc.evidence}]`);

// ─────────────────────────────────────────────────────────────────────────────
// B)  REAL טיח תל אביב episodes — small N → the engine must say so.
// ─────────────────────────────────────────────────────────────────────────────
const TLV = 'טיח תל אביב';
const tlvDocs = [
  { id:'f1', name:'פורמולציות.xlsx', anchor:{version:'v002',product:TLV}, content:'v002 NHL5 חול זכוכית, ספק כפר גלעדי. אושר לייצור, נדבק טוב בקיר.' },
  { id:'l1', name:'בדיקת לחיצה.xlsx', anchor:{version:'v002',product:TLV}, content:'v002 חוזק 28 יום: ___' },
  { id:'r2', name:'דוח-מופ.docx', anchor:{version:'v020',product:TLV}, content:'v020 נכשל: סדקים בקיר בחוץ כי לא שוחזר מהמעבדה.' },
  { id:'w1', name:'מעקב משימות.docx', anchor:{version:'v015',product:TLV}, content:'ישיבה עם אריק, החלפת ספק, פיילוט. צמיגות נמדדה.' },
];
const tlvEps = buildEpisodes(tlvDocs).episodes.map((ep) => ({
  id: ep.episode_id, stages: extractStages(ep, tlvDocs), outcome: classifyOutcome(ep), product: ep.product,
}));

console.log('\n═══ B) REAL טיח תל אביב episodes — honesty check ═══');
for (const e of tlvEps) console.log(`   ${e.id}: ${renderPath(e.stages)}  → ${e.outcome}`);
const real = metaInsights(tlvEps, ALL, []);
console.log('\n  ── what the engine will and will NOT claim ──');
if (!real.insights.length) console.log('   (no insight clears the support threshold)');
for (const i of real.insights) console.log(`   ${i.tag.padEnd(13)} (n=${i.n})  ${i.text}`);
console.log(`\n   ⓘ ${tlvEps.length} real episodes is below MIN_SUPPORT — every process pattern stays a`);
console.log('     HYPOTHESIS until enough decision cycles are extracted. The engine refuses to');
console.log('     turn a handful of cycles into a "law of how Fresco works". THAT is the discipline.');

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Meta-learning: not "what do we know about the material", but "how does Fresco');
console.log('produce good knowledge". Built on Episodes + evidence, gated by support — so it');
console.log('characterises the organisation\'s learning process without inventing it.');
