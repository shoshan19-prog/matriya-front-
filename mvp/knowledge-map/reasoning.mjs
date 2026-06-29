// REASONING QUALIFICATION — the fourth authority, now ACTIVE.
//
// Evidence Qualification judged the CLAIM. This judges the INFERENCE built on top
// of it — a different question, a different court. Even when Units, Baseline and
// Physics all PASS, the conclusion drawn from the evidence can still be invalid:
//
//   measurement: Pull-off = 2.8 MPa     (Units ✓ Baseline ✓ Physics ✓)
//   conclusion:  "therefore fire resistance improved"
//                 ↑ adhesion says NOTHING about fire — a non-sequitur.
//
// So this authority asks ONLY: "does the conclusion follow from the evidence?".
// It never re-judges the evidence value (that would be authority leakage). It
// rules SUPPORTED / NON_SEQUITUR / UNSUPPORTED, and like every other court it only
// ever routes to REVIEW — it never auto-rejects.

// Which evidence domains can legitimately support a conclusion ABOUT a domain.
// Direct (same asset) or a DOCUMENTED causal link from the reconstructions. Links
// that are themselves hypotheses are flagged, not treated as proven.
export const CAUSAL_LINKS = {
  'Compression Strength':        { supports: ['Compression Strength', 'Set / Cure'], hypothesis: ['Set / Cure'], note: 'MPZ: water/curing process drove measured strength' },
  'Set / Cure':                  { supports: ['Set / Cure', 'Water Resistance / Moisture'], hypothesis: [] },
  'Adhesion':                    { supports: ['Adhesion', 'Workability / Flow'], hypothesis: ['Workability / Flow'], note: 'TLV: wetting/workability affected adhesion' },
  'Fire Resistance':             { supports: ['Fire Resistance', 'Density'], hypothesis: ['Density'], note: 'SFRM density-match is a HYPOTHESIS for fire, not proven' },
  'Color / Shade':               { supports: ['Color / Shade'], hypothesis: [] },
  'Water Resistance / Moisture': { supports: ['Water Resistance / Moisture', 'Set / Cure'], hypothesis: [] },
  'Workability / Flow':          { supports: ['Workability / Flow'], hypothesis: [] },
  'Density':                     { supports: ['Density'], hypothesis: [] },
};

/** Qualify an inference: does {evidenceAssets} support a conclusion about
 *  {conclusionAsset}? Returns SUPPORTED / NON_SEQUITUR / UNSUPPORTED + a decision. */
export function qualifyInference({ evidenceAssets = [], conclusionAsset, claim = '' }) {
  const base = { conclusionAsset, claim, evidenceAssets, autoReject: false };
  if (!evidenceAssets.length)
    return { ...base, verdict: 'UNSUPPORTED', decision: 'REVIEW', reason: 'no evidence at all underlies the conclusion', action: 'route to human review (unsupported)' };

  const link = CAUSAL_LINKS[conclusionAsset] || { supports: [conclusionAsset], hypothesis: [] };
  const direct = evidenceAssets.includes(conclusionAsset);
  const viaLink = evidenceAssets.filter((a) => link.supports.includes(a) && a !== conclusionAsset);

  if (direct)
    return { ...base, verdict: 'SUPPORTED', via: 'direct', decision: 'ACCEPT', reason: `the conclusion is about ${conclusionAsset} and the evidence measures ${conclusionAsset}`, action: 'inference accepted (still a human signs the Law)' };
  if (viaLink.length) {
    const hypothetical = viaLink.some((a) => link.hypothesis.includes(a));
    return { ...base, verdict: 'SUPPORTED', via: hypothetical ? 'hypothesised link' : 'documented link', decision: 'REVIEW',
      reason: `linked through ${viaLink.join(', ')}${link.note ? ` (${link.note})` : ''}${hypothetical ? ' — the link is a HYPOTHESIS, not proven' : ''}`,
      action: 'route to human review (link-based inference)' };
  }
  return { ...base, verdict: 'NON_SEQUITUR', decision: 'REVIEW',
    reason: `evidence is about ${evidenceAssets.join(', ')} — none of which supports a conclusion about ${conclusionAsset}`,
    action: 'route to human review (non-sequitur)' };
}

// ── test set: real inferences from the corpus, good and bad ──────────────────
export const REASONING_TESTS = [
  { label: 'Pull-off → "fire improved"',          inf: { evidenceAssets: ['Adhesion'], conclusionAsset: 'Fire Resistance', claim: 'adhesion good ⇒ fire better' }, expect: 'NON_SEQUITUR' },
  { label: 'measured strength → strength claim',  inf: { evidenceAssets: ['Compression Strength'], conclusionAsset: 'Compression Strength' }, expect: 'SUPPORTED' },
  { label: 'MPZ process → strength gain',         inf: { evidenceAssets: ['Set / Cure', 'Compression Strength'], conclusionAsset: 'Compression Strength' }, expect: 'SUPPORTED' },
  { label: 'TLV NHL bump → strength (no data)',   inf: { evidenceAssets: [], conclusionAsset: 'Compression Strength', claim: 'raised NHL ⇒ stronger' }, expect: 'UNSUPPORTED' },
  { label: 'SFRM density → fire (hypothesis)',    inf: { evidenceAssets: ['Density'], conclusionAsset: 'Fire Resistance' }, expect: 'SUPPORTED' },
  { label: 'workability → adhesion (linked)',     inf: { evidenceAssets: ['Workability / Flow'], conclusionAsset: 'Adhesion' }, expect: 'SUPPORTED' },
  { label: 'color → strength (non-sequitur)',     inf: { evidenceAssets: ['Color / Shade'], conclusionAsset: 'Compression Strength' }, expect: 'NON_SEQUITUR' },
];

export function runReasoningTests() {
  return REASONING_TESTS.map((t) => {
    const r = qualifyInference(t.inf);
    return { label: t.label, expect: t.expect, got: r.verdict, pass: r.verdict === t.expect, via: r.via, reason: r.reason };
  });
}

export function reasoningSummary() {
  const rows = runReasoningTests();
  return { rows, passed: rows.filter((r) => r.pass).length, total: rows.length,
    nonSequitursCaught: rows.filter((r) => r.got === 'NON_SEQUITUR').length,
    noAutoReject: REASONING_TESTS.every((t) => qualifyInference(t.inf).autoReject === false) };
}
