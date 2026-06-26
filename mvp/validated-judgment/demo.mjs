// Validated Judgment — MVP demo.
//
// Captures ONE real Fresco judgment (lime plaster vs cement on a damp stone
// wall), refuses it if it has no falsifiable prediction, then simulates the
// closure loop at 1 / 6 / 12 months and scores prediction-vs-reality.
//
//   run:  node demo.mjs
//
import { addJudgment, recordObservation, dueFollowups, scoreJudgment, validateJudgment, load, save } from './engine.mjs';

const STORE = new URL('./store.json', import.meta.url).pathname;
const store = { judgments: [] };

// --- THE CAPTURE FORM, filled for a real Fresco case -----------------------
// (These are exactly the minimum fields an expert fills at decision time.)
const judgment = {
  id: 'FRESCO-0001',
  domain: 'render/plaster — heritage masonry',
  decided_by: 'senior applicator (Fresco)',
  decided_at: '2026-03-01',
  context: {
    substrate: 'exterior stone wall, soft historic masonry',
    conditions: 'rising damp + sub-surface salts; previous cement render delaminating; Mediterranean exterior exposure',
  },
  problem: 'Existing cement render is peeling and trapping moisture; salts crystallising behind the film and spalling the masonry.',
  decision: 'Strip cement render; apply breathable lime (NHL) render, finish with mineral silicate paint.',
  rationale: 'High water-vapour permeability lets the wall dry outward; lime\'s low elastic modulus matches soft masonry and avoids stress cracking; evaporation pushes salt crystallisation to the surface (cleanable) instead of behind a film (destructive).',
  alternatives_considered: [
    { option: 'Cement render (re-do)', why_rejected: 'Low vapour permeability traps moisture; rigid, cracks on soft masonry; accelerates sub-surface salt damage.' },
    { option: 'Acrylic / film-forming paint', why_rejected: 'Forms a non-breathable film; blisters and peels under vapour pressure from a damp wall.' },
    { option: 'Gypsum plaster', why_rejected: 'Re-dissolves under persistent moisture; unsuitable for a wet exterior wall.' },
  ],
  confidence: 0.8, // the expert's honest prior — this is what reality will grade
  evidence_at_decision: ['moisture_map_2026-03-01.pdf', 'salts_test_2026-03-01.jpg', 'substrate_survey.pdf'],
  // --- the FALSIFIABLE predictions (required, or capture is refused) --------
  predictions: [
    { metric: 'wall_moisture_pct',  kind: 'numeric',     comparator: '<', target: 5, partial_band: 1.5, horizon_days: 180,
      note: 'Protimeter at 1m height drops from 9% baseline to <5% within 6 months.' },
    { metric: 'delamination',       kind: 'qualitative', expected_max: 'minimal', horizon_days: 365,
      note: 'No more than minimal peeling after one full wet/dry season.' },
    { metric: 'salt_efflorescence', kind: 'qualitative', expected_max: 'minimal', horizon_days: 180,
      note: 'Salts appear only as cleanable surface bloom, not sub-surface spalling.' },
  ],
  status: 'open',
  observations: [],
};

// 1) CAPTURE — show the gate working: a version with no prediction is refused.
console.log('=== 1. CAPTURE GATE ===');
const noPrediction = { ...judgment, predictions: [] };
console.log('Judgment with no falsifiable prediction ->', validateJudgment(noPrediction).ok ? 'accepted' : 'REFUSED ✓');
addJudgment(store, judgment);
console.log(`Judgment ${judgment.id} captured. ${judgment.predictions.length} predictions to close.\n`);

// 2) CLOSURE — what follow-up is due at each horizon?
console.log('=== 2. CLOSURE SCHEDULE ===');
for (const asOf of ['2026-06-01', '2026-09-01', '2027-04-01']) {
  const due = dueFollowups(judgment, asOf);
  console.log(`as of ${asOf}: ${due.length} follow-up(s) due -> ${due.map(d => d.p.metric).join(', ') || '—'}`);
}
console.log();

// 3) REALITY ANSWERS — record field observations at each horizon.
//    (In production these come from a site visit + protimeter + photos.)
recordObservation(judgment, 0, 6.0,        '2026-09-05', ['moisture_map_2026-09-05.pdf']); // 180d: 6.0% (target <5, band 1.5 -> partial)
recordObservation(judgment, 2, 'minimal',  '2026-09-05', ['salts_2026-09-05.jpg']);          // 180d: minimal salts -> matched
recordObservation(judgment, 1, 'none',     '2027-03-05', ['facade_2027-03-05.jpg']);          // 365d: no delamination -> matched

// 4) SCORE — prediction vs reality, and was the 0.8 confidence honest?
console.log('=== 3. PREDICTION vs REALITY ===');
const s = scoreJudgment(judgment);
for (const g of s.graded) {
  console.log(`  ${g.metric.padEnd(18)} expected ${String(g.expected).padEnd(12)} observed ${String(g.observed).padEnd(10)} -> ${g.grade.toUpperCase()}`);
}
console.log('\n=== 4. JUDGMENT SCORE ===');
console.log(`  closed:       ${s.closed}/${s.total} predictions`);
console.log(`  outcome:      ${(s.outcome * 100).toFixed(0)}%  -> verdict: ${s.verdict}`);
console.log(`  confidence:   ${judgment.confidence}  (expert's prior)`);
console.log(`  Brier score:  ${s.brier.toFixed(3)}  -> ${s.calibration}`);
console.log('\n  Interpretation: the wall dried slightly slower than predicted (partial on');
console.log('  moisture) but the core mechanism held — no delamination, salts stayed on the');
console.log('  surface. A near-correct, well-calibrated judgment. This single graded record');
console.log('  is now a reusable, falsifiable asset; 10,000 of them are the moat.');

save(STORE, store);
console.log(`\n(store written to ${STORE})`);
