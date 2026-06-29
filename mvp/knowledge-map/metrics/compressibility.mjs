// HYPOTHESIS METRIC 4 — Decision Compressibility.
//
//   Compressibility = Minimum Evidence Set / Total Evidence
//
// Not "can we trace the decision?" but "how FEW pieces of evidence are actually
// needed to explain it?". Early in research you need almost all the evidence to
// justify a decision; once the lab truly understands the problem, a few key
// pieces reconstruct the logic. A low ratio = deep understanding. Deeper than
// entropy because it measures EXPLANATORY power, not just order.
//
// INNOVATION (mine) — the Understanding Curve: compressibility over the decision
// timeline. Its slope is the RATE at which the lab is truly understanding (not
// just collecting). A flat/incomplete curve = data piling up without insight.
//
// ⚠ HYPOTHESIS under test.

// Tel Aviv decisions: total evidence available vs the minimal set that explains
// it. minimal=null → cannot be explained from evidence at all (a missing-evidence
// leak, not just "needs many"). From docs/PRODUCT_STORY_TEL_AVIV_PLASTER.
export const TLV_DEC_EVIDENCE = [
  { id: 'D1', date: '2022-04', decision: 'reject cracking pilot', total: 4, minimal: 1 },     // the cracks
  { id: 'D2', date: '2022-05', decision: 'drop vermiculite', total: 8, minimal: 2 },          // fail + mix-19 success
  { id: 'D3', date: '2022-06', decision: 'invent the pre-mix', total: 5, minimal: 1 },         // dispersion reasoning
  { id: 'D4', date: '2022-08', decision: 'NHL 3.5→5.0 for strength', total: 3, minimal: null },// strength never measured
  { id: 'D5', date: '2022-10', decision: 'supplier צמיתות→כפר גלעדי', total: 6, minimal: 2 },  // sieve + COA
  { id: 'D6', date: '2022-12', decision: '+1 kg TCO wetting fix', total: 5, minimal: 2 },       // slide + post-fix
  { id: 'D7', date: '2022-12', decision: 'approve to bag', total: 12, minimal: null },          // strength unverified
];

export function compressibility(decisions = TLV_DEC_EVIDENCE) {
  const rows = decisions.map((d) => ({ ...d,
    ratio: d.minimal == null ? null : +(d.minimal / d.total).toFixed(2),
    explainable: d.minimal != null }));
  const complete = rows.filter((r) => r.explainable);
  const avg = complete.length ? +(complete.reduce((s, r) => s + r.ratio, 0) / complete.length).toFixed(2) : null;
  return { rows, explainable: complete.length, total: rows.length,
    avgCompressibility: avg, incompressible: rows.filter((r) => !r.explainable).map((r) => r.id),
    note: 'low ratio = few key pieces explain the decision = deep understanding; null = cannot be explained (leak)' };
}

/** Understanding Curve — compressibility along the project timeline + its slope. */
export function understandingCurve(decisions = TLV_DEC_EVIDENCE) {
  const pts = decisions.filter((d) => d.minimal != null)
    .map((d) => ({ date: d.date, ratio: +(d.minimal / d.total).toFixed(2) }));
  // slope: does the ratio FALL over time (understanding) or not?
  const n = pts.length;
  const xs = pts.map((_, i) => i), ys = pts.map((p) => p.ratio);
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  const slope = +(xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) /
    (xs.reduce((s, x) => s + (x - mx) ** 2, 0) || 1)).toFixed(3);
  return { points: pts, slope,
    reading: slope < -0.02 ? 'understanding deepening (fewer key pieces over time)'
      : slope > 0.02 ? 'understanding NOT deepening (later decisions need more evidence)'
      : 'flat — no clear deepening', incompleteLate: decisions.slice(-2).some((d) => d.minimal == null) };
}
