// Innovation 1 — Decision Ledger + Knowledge-ROI backtest.
//
// Closes the loop in the OTHER direction: did acquired (or missing) knowledge
// actually change DECISIONS and OUTCOMES? A ledger records each real decision,
// the knowledge asset it used, its mode, and the realized business outcome. From
// it we backtest the realized ROI of each Knowledge Asset — and the REGRET of a
// missing one. This is how MATRIYA measures whether knowledge mattered, not just
// whether it existed.
//
// Real decisions are taken from the PRODUCT_STORY reconstructions; outcome/regret
// rows marked (illustrative) await real outcome telemetry (returns, QC, sales).

export const DECISION_LEDGER = [
  { id: 'DEC-1', decision: 'TLV approved to bag', asset: 'Adhesion', mode: 'qualitative',
    outcome: 'success', businessValue: 0.80, note: 'cured 3d, no cracks — adhesion knowledge confirmed the call' },
  { id: 'DEC-2', decision: 'MPZ Dec-2025 set as production reference', asset: 'Compression Strength', mode: 'measured',
    outcome: 'success', businessValue: 0.85, note: 'measured strength + process control drove the decision' },
  { id: 'DEC-3', decision: 'PROTECH A1 productized + 400kg scale-up', asset: 'Fire Resistance', mode: 'measured',
    outcome: 'success', businessValue: 0.90, note: 'Class A1 certificate gated market entry' },
  { id: 'DEC-4', decision: 'GRANITAL per-shade tinting recipes released', asset: 'Color / Shade', mode: 'measured',
    outcome: 'success', businessValue: 0.75, note: 'ΔE color-match data approved the recipes' },
  // REGRET (illustrative): a decision that lacked the knowledge → bad outcome.
  { id: 'DEC-5', decision: 'shipped a render without pull-off data', asset: 'Adhesion', mode: 'MISSING',
    outcome: 'customer-returns', businessValue: -0.60, note: '(illustrative) field cracking returns — the GENERATE gap bit' },
];

/** Backtest realized knowledge ROI per asset, including regret from missing knowledge. */
export function backtestKnowledgeROI(ledger = DECISION_LEDGER) {
  const by = new Map();
  for (const d of ledger) {
    const b = by.get(d.asset) || { asset: d.asset, decisions: 0, realized: 0, regret: 0, missing: 0 };
    b.decisions += 1; b.realized += d.businessValue;
    if (d.mode === 'MISSING') { b.missing += 1; b.regret += Math.min(0, d.businessValue); }
    by.set(d.asset, b);
  }
  return [...by.values()].map((b) => ({
    asset: b.asset, decisions: b.decisions,
    realizedValue: +b.realized.toFixed(2), regret: +b.regret.toFixed(2),
    verdict: b.regret < 0 ? 'knowledge GAP cost the business — acquiring it has proven value'
      : 'knowledge drove successful decisions',
  })).sort((a, b) => a.realizedValue - b.realizedValue);
}
