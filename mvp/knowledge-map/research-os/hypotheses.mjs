// INNOVATION 4 — HYPOTHESIS CANDIDATES.
//
// A research OS should surface what to INVESTIGATE, not declare what is true.
// From the episodes, MATRIYA spots co-variation between dimensions and proposes it
// as a TESTABLE HYPOTHESIS — explicitly UNVALIDATED, with the test that would
// confirm or kill it. It never promotes these to laws (that needs the full
// validation chain) — it only feeds the research agenda.

import { FIRE_EPISODES_PENDING } from '../schema/fire-episodes.mjs';

// monotonic co-variation check — aggregate replicates by x (mean y), then check
function monotonic(pairs) {
  const byX = new Map();
  for (const [x, y] of pairs) { const a = byX.get(x) || []; a.push(y); byX.set(x, a); }
  const s = [...byX.entries()].map(([x, ys]) => [x, ys.reduce((p, c) => p + c, 0) / ys.length]).sort((a, b) => a[0] - b[0]);
  let up = true, down = true;
  for (let i = 1; i < s.length; i++) { if (s[i][1] < s[i - 1][1]) up = false; if (s[i][1] > s[i - 1][1]) down = false; }
  return { trend: up ? 'increasing' : down ? 'decreasing' : 'none', levels: s };
}

export function hypothesisCandidates() {
  const out = [];

  // From the Fire episodes: DFT vs time-to-failure (Fresco samples only, replicates averaged)
  const fire = FIRE_EPISODES_PENDING.filter((e) => e.origin === 'fresco')
    .map((e) => [e.measurement.dft, e.measurement.timeToFailure]);
  const m = monotonic(fire);
  if (m.trend === 'increasing')
    out.push({ id: 'H-FIRE-DFT', asset: 'Fire Resistance',
      hypothesis: 'time-to-failure increases with DFT (dry film thickness)',
      evidence: `Fresco fire episodes (mean per DFT): ${m.levels.map((p) => `${p[0]}µm→${Math.round(p[1])}min`).join(', ')}`,
      status: 'CANDIDATE — UNVALIDATED',
      test: 'measure ≥3 DFT levels on ≥2 formulations; confirm monotonicity + fit before any law' });

  // Known unresolved finding from the MPZ data (a standing research question)
  out.push({ id: 'H-MP10', asset: 'Compression Strength',
    hypothesis: 'MP10 formulation under-performs its grade target even at 50 days',
    evidence: 'measured MP10 5.11 MPa at 50d < target 10 MPa (Drive MPZ report)',
    status: 'OPEN — needs formulation re-examination (cement/lime ratio, water, fillers)',
    test: 're-formulate MP10 and re-measure 7/28/50/90-day strength' });

  return { candidates: out,
    note: 'these are hypotheses to TEST, not laws. The system proposes the research; it never concludes for you.' };
}
