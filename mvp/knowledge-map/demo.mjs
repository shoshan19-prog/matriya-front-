// Knowledge Source Map + Trust Engine — calibrated on the REAL טיח תל אביב corpus.
// run: node demo.mjs
//
// The point: don't declare trust with stars — LEARN it from what each source
// actually delivered during the Tel Aviv reconstruction. One finding proves the
// whole thesis: lab sheets are the textbook ★★★★★ source for MEASUREMENT, but in
// Fresco's real corpus those fields are EMPTY — so calibrated trust collapses,
// and PROTEUS learns not to send anyone there for a strength number.

import { KTYPE, SOURCE_MAP } from './sources.mjs';
import { makeTrustEngine } from './trust.mjs';
import { whereToLook, coverTarget, EPISODE_FLOW } from './router.mjs';

const eng = makeTrustEngine();

// ── Real observations from the Tel Aviv reconstruction (docs/PRODUCT_STORY_…) ──
// Each line = "when we consulted this source for this knowledge, did it deliver?"
const seed = [
  // The R&D report + weekly logs carried the WHY again and again → successes.
  ['rd_report', KTYPE.REASON, [1,1,1,1,1,1]],     // ~13 decisions explained
  ['rd_report', KTYPE.DECISION, [1,1,1,1,1]],
  ['rd_report', KTYPE.DEAD_END, [1,1,1]],
  ['rd_report', KTYPE.SUPPLIER, [1,1]],
  ['weekly_report', KTYPE.DECISION, [1,1,1,1]],
  ['weekly_report', KTYPE.REASON, [1,1,1,1]],
  ['weekly_report', KTYPE.DEAD_END, [1,1,1,1,1]], // thermal failure chain, dated
  ['weekly_report', KTYPE.SUPPLIER, [1,1,1]],     // Tzmitut→Kfar Giladi, AGITAN→BAXSN
  // Formula sheets delivered the inputs cleanly.
  ['formula_sheet', KTYPE.INPUT, [1,1,1,1,1,1]],
  // THE KILLER FINDING: lab sheets are SUPPOSED to hold measurements, but every
  // strength / specific-weight / shade field was present-but-EMPTY → failures.
  ['lab_sheet', KTYPE.MEASUREMENT, [0,0,0,0,0,0]],
  ['lab_sheet', KTYPE.INPUT, [1,1]],              // they did carry inputs
  // Images existed but only as application/finish photos (visual state).
  ['image', KTYPE.VISUAL, [1,1]],
  // priority / email / hand_notes: NOT read / NOT in Drive → zero observations
  //   → they stay at the expert prior and are flagged UNCALIBRATED below.
];
for (const [src, k, outcomes] of seed) for (const o of outcomes) eng.observe(src, k, !!o);

// ── 1. Knowledge Source Map ──────────────────────────────────────────────────
console.log('═══ 1. KNOWLEDGE SOURCE MAP (what each source TYPE knows) ═══\n');
for (const s of SOURCE_MAP)
  console.log(`  ${s.label.padEnd(22)} knows: ${s.knows.padEnd(26)} +${s.strength} / -${s.weakness}`);

// ── 2. Calibrated Trust matrix (learned, not declared) ───────────────────────
console.log('\n═══ 2. KNOWLEDGE TRUST ENGINE — trust(source × knowledge), LEARNED ═══');
console.log('   (★ = calibrated trust · prior = expert guess · Δ = real evidence moved it)\n');
const KS = [KTYPE.REASON, KTYPE.DECISION, KTYPE.MEASUREMENT, KTYPE.INPUT, KTYPE.DEAD_END, KTYPE.BATCH];
for (const s of SOURCE_MAP) {
  const cells = KS.map((k) => {
    const t = eng.trust(s.id, k);
    if (t.prior_stars === 0 && t.observed === 0) return null;
    const star = '★'.repeat(t.stars) + '☆'.repeat(5 - t.stars);
    const flag = t.surprise ? ' Δ' : t.calibrated ? '' : '?';
    return `${k.slice(0,4)} ${star}${flag}`;
  }).filter(Boolean);
  if (cells.length) console.log(`  ${s.label.padEnd(22)} ${cells.join('   ')}`);
}
console.log('\n   Δ = trust DRIFTED from the prior on real evidence;  ? = UNCALIBRATED (still a guess)');

// Spotlight the collapse.
const lab = eng.trust('lab_sheet', KTYPE.MEASUREMENT);
console.log(`\n   ▶ Spotlight — lab_sheet × MEASUREMENT:`);
console.log(`     expert prior said ★${lab.prior_stars} (textbook source for measurements).`);
console.log(`     calibrated on real corpus → ★${lab.stars}  (${lab.observed} obs, all present-but-EMPTY).`);
console.log(`     MATRIYA LEARNED Fresco's reality: the strength numbers were never recorded.`);

// ── 3. PROTEUS: "where should I look?" instead of "I'm missing info" ─────────
console.log('\n═══ 3. PROTEUS ROUTER — "where is the answer most likely?" ═══');

// query A: WHY did a version fail? (REASON) — corpus presence per source
const presA = { weekly_report: 'delivered', rd_report: 'delivered', email: 'absent',
                hand_notes: 'absent', sharepoint: 'unknown' };
const a = whereToLook(eng, KTYPE.REASON, { presence: presA });
console.log(`\n  MISSING: "why did a version fail?"  (knowledge type: REASON)`);
a.recommendation.forEach((r) => console.log(`    ${r.rank}. ${r.source.padEnd(24)} ${r.stars}  [${r.presence}]${r.calibrated ? '' : '  ?uncalibrated'}`));
a.notes.forEach((n) => console.log(`    ⓘ ${n}`));

// query B: the 28-day strength NUMBER (MEASUREMENT) — presence is per-knowledge-type:
// the lab sheet is the ONLY natural home for a strength number, and it is empty;
// every other source simply does not carry this measurement at all.
const presB = { lab_sheet: 'empty', supplier_doc: 'unknown', formula_sheet: 'absent',
                image: 'absent', weekly_report: 'absent', rd_report: 'absent', hand_notes: 'absent' };
const b = whereToLook(eng, KTYPE.MEASUREMENT, { presence: presB });
console.log(`\n  MISSING: "what was the 28-day compressive strength?"  (knowledge type: MEASUREMENT)`);
b.recommendation.forEach((r) => console.log(`    ${r.rank}. ${r.source.padEnd(24)} ${r.stars}  [${r.presence}]${r.calibrated ? '' : '  ?uncalibrated'}`));
b.notes.forEach((n) => console.log(`    ⓘ ${n}`));

// query C: what is actually produced today? (BATCH) — Priority, never read here
const presC = { priority: 'absent', formula_sheet: 'delivered' };
const c = whereToLook(eng, KTYPE.BATCH, { presence: presC });
console.log(`\n  MISSING: "which batch is in production now?"  (knowledge type: BATCH)`);
c.recommendation.forEach((r) => console.log(`    ${r.rank}. ${r.source.padEnd(24)} ${r.stars}  [${r.presence}]${r.calibrated ? '' : '  ?uncalibrated'}`));
c.notes.forEach((n) => console.log(`    ⓘ ${n}`));

// ── 4. Knowledge Flow: sources → EPISODE fields (not source → graph) ─────────
console.log('\n═══ 4. KNOWLEDGE FLOW — sources feed EPISODE fields (ranked by trust) ═══\n');
for (const [field, ktypes] of Object.entries(EPISODE_FLOW)) {
  const best = ktypes.flatMap((k) => eng.rank(k)).sort((x, y) => y.score - x.score)[0];
  console.log(`  episode.${field.padEnd(11)} ← ${ktypes.join('/').padEnd(22)} best source: ${best ? best.label : '—'}`);
}

// ── 5. Complementary sources to reconstruct a FULL product story ─────────────
console.log('\n═══ 5. WHICH SOURCES COMPLETE EACH OTHER (full product story) ═══\n');
const presStory = { formula_sheet:'delivered', lab_sheet:'empty', weekly_report:'delivered',
                    rd_report:'delivered', priority:'absent', email:'absent', image:'delivered' };
const need = [KTYPE.INPUT, KTYPE.DECISION, KTYPE.REASON, KTYPE.DEAD_END, KTYPE.MEASUREMENT, KTYPE.BATCH];
const cover = coverTarget(eng, need, { presence: presStory });
cover.plan.forEach((p) => console.log(`  ${p.ktype.padEnd(12)} → ${(p.source||'—').padEnd(24)} ${p.reachable ? '✓ reachable' : '✗ NOT reachable in corpus'}`));
console.log(`\n  COVERED: ${cover.covered.join(', ')}`);
console.log(`  GAPS   : ${cover.gaps.join(', ')}   ← these need new sources (Priority for BATCH, lab data for MEASUREMENT)`);

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('MATRIYA no longer just centralizes knowledge — it understands Fresco\'s');
console.log('KNOWLEDGE ECOLOGY: which source holds which knowledge, how reliable each is,');
console.log('and where to look FIRST before running a new experiment. New sources (Teams,');
console.log('Slack, a service desk) plug in as one Source-Map row + adapter — engines unchanged.');
