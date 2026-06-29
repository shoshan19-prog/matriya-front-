// HYPOTHESIS METRIC 3 — Evidence Conservation / Decision Traceability.
//
// In labs, knowledge "leaks": a worker leaves, an email is deleted, a decision
// goes unrecorded. In an event-sourced system we can demand a principle: every
// decision must be RECONSTRUCTABLE from a chain of evidence. If you can't get
// from a decision back to the evidence that supported it, that is a knowledge
// leak. The KPI is not "how many decisions" but "how many are still explainable".
//
//   Decision Traceability = decisions with a complete evidence chain / all decisions
//
// ⚠ HYPOTHESIS under test, not a law.

// Tel Aviv plaster decisions, from the reconstruction (docs/PRODUCT_STORY_TEL_AVIV_PLASTER).
// chain: 'complete' = evidence on record · 'partial' = key evidence missing · 'missing'.
export const TLV_DECISIONS = [
  { id: 'D1', decision: 'reject cracking field pilot → rework chemistry', asset: 'Adhesion',
    chain: 'complete', evidence: 'field observation "cracks outdoors" (R&D report 20.12.22)' },
  { id: 'D2', decision: 'drop vermiculite; COMBIZELL + UFAPORE TCO', asset: 'Adhesion',
    chain: 'complete', evidence: 'mix-19 adhesion/texture observations vs ME15000 branch' },
  { id: 'D3', decision: 'invent the PRE-MIX for trace ingredients', asset: 'Workability / Flow',
    chain: 'complete', evidence: 'dispersion/uniformity reasoning (R&D report)' },
  { id: 'D4', decision: 'raise NHL 3.5 → 5.0 MPa "to improve strength"', asset: 'Compression Strength',
    chain: 'partial', evidence: 'reason recorded, but NO measured 28-day strength exists → cannot verify the decision' },
  { id: 'D5', decision: 'switch lime supplier צמיתות → כפר גלעדי', asset: 'Granulometry / Fractions',
    chain: 'complete', evidence: 'sieve/COA fraction-inconsistency data' },
  { id: 'D6', decision: '+1 kg TCO (wetting fix) → codified in PR00049', asset: 'Adhesion',
    chain: 'complete', evidence: 'spatula-slide observation + post-TCO wetting note' },
  { id: 'D7', decision: 'approve 14.12.2022-002 to bag', asset: 'Adhesion',
    chain: 'partial', evidence: 'adhesion confirmed (no cracks, 3-day cure) BUT strength target unverified — chain incomplete on the load-bearing claim' },
];

export function traceability(decisions = TLV_DECISIONS) {
  const complete = decisions.filter((d) => d.chain === 'complete').length;
  const partial = decisions.filter((d) => d.chain === 'partial');
  const missing = decisions.filter((d) => d.chain === 'missing');
  return {
    total: decisions.length, complete,
    traceability: +(complete / decisions.length).toFixed(2),
    leaks: [...partial, ...missing].map((d) => ({ id: d.id, decision: d.decision, why: d.evidence })),
    note: 'a decision you cannot trace back to evidence is a knowledge leak',
  };
}
