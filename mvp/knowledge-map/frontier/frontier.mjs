// Knowledge Frontier — the WHY of a gap, the last governance layer before Laws.
//
// "Missing knowledge" is not "missing documents". After a broad corpus scan, an
// asset can stop gaining confidence not because we failed to find a document, but
// because the CORPUS IS EXHAUSTED — the knowledge space is closed for retrieval.
// Each asset therefore needs a FRONTIER: the reason it is incomplete and how to
// close it:
//   RETRIEVE_AVAILABLE  — more evidence exists in the corpus → fetch it
//   RETRIEVE_COMPLETE   — corpus exhausted, marginal gain low → stop retrieving
//   GENERATE_REQUIRED   — no observation exists anywhere → run an experiment
//   EXTERNAL_ONLY       — never tested internally → external standard / literature
//   CLOSED              — well-grounded and nothing actionable remains
//
// This explains WHY the acquisition engine stops searching and starts generating —
// a clear structural boundary between the existing corpus and the research frontier.

import { replayTransformations, transformationType } from '../transformations/transformation.mjs';

export const FRONTIER = ['RETRIEVE_AVAILABLE', 'RETRIEVE_COMPLETE', 'GENERATE_REQUIRED', 'EXTERNAL_ONLY', 'CLOSED'];

// Real per-asset verdicts from the ROI / retrieve scouts (what the corpus contains).
const VERDICT = {
  'Adhesion':                    { kind: 'GENERATE_REQUIRED', reason: '0 measured pull-off; corpus scanned, none exists', action: 'Run first Pull-Off experiment' },
  'Set / Cure':                  { kind: 'GENERATE_REQUIRED', reason: '0 measured set-time/Vicat; corpus scanned, none exists', action: 'Run first Vicat / set-time test' },
  'Fire Resistance':             { kind: 'EXTERNAL_ONLY', reason: 'only a 2-min internal burner screen; no standardized rating', action: 'EN 13381-4 / ASTM via external lab' },
  'Water Resistance / Moisture': { kind: 'EXTERNAL_ONLY', reason: 'no w-value / salt-spray measured internally', action: 'EN 1062-3 / salt-spray via external lab' },
  'Color / Shade':               { kind: 'RETRIEVE_AVAILABLE', reason: 'untapped depth remains — spectro DE2000 layer (440 records) + finer per-product breakdown', action: 'Retrieve remaining ΔE / DE2000 records' },
  'Granulometry / Fractions':    { kind: 'RETRIEVE_COMPLETE', reason: 'all corpus sieve tables captured (raw-material QC, 3 suppliers + 7 materials); finished-product PSD was never measured', action: 'No further retrieval — finished-product PSD would require GENERATE' },
};

const EXPECTED_DK = { GENERATE_REQUIRED: 'high', EXTERNAL_ONLY: 'high (costly)', RETRIEVE_AVAILABLE: 'medium', RETRIEVE_COMPLETE: 'low', CLOSED: 'none' };

/**
 * The structural LAW: when adding evidence stops changing an asset's knowledge,
 * the frontier shifts from retrieval to generating new evidence.
 * Validity: corpus broadly scanned, and the LAST measured additions for the asset
 * drove a consistent decline in ΔKnowledge. Reset: a new unscanned source appears,
 * or a new TYPE of evidence (a measurement/experiment) changes the state.
 */
export function retrievalSaturated(assetName, transformations, confidence) {
  // Headroom = 1 - confidence bounds ANY further gain. Very high confidence ⇒ the
  // most a retrieval could add is tiny ⇒ saturated regardless of the last jump.
  const headroom = +(1 - confidence).toFixed(2);
  if (confidence >= 0.9) return { saturated: true, evidence: `confidence ${confidence}, headroom only ${headroom} → marginal gain from more reports is low` };
  const ms = transformations.filter((t) => t.asset === assetName && t.dMeasured > 0);
  if (ms.length < 2) return { saturated: false, evidence: 'too few measured additions to judge' };
  const lastDK = ms[ms.length - 1].dConf;
  const declining = ms[ms.length - 1].dConf <= ms[ms.length - 2].dConf;
  const saturated = lastDK < 0.1 && declining && confidence >= 0.8;
  return { saturated, evidence: `last measured ΔK ${lastDK >= 0 ? '+' : ''}${lastDK}, ${declining ? 'declining' : 'rising'}, confidence ${confidence}, headroom ${headroom}` };
}

/** Classify each asset's frontier (combines real verdicts with the saturation law). */
export function classifyFrontier(assets, transformations) {
  return assets.map((a) => {
    const v = VERDICT[a.name];
    const sat = retrievalSaturated(a.name, transformations, a.confidence);
    let kind, reason, action;
    if (v && (v.kind === 'GENERATE_REQUIRED' || v.kind === 'EXTERNAL_ONLY' || v.kind === 'RETRIEVE_COMPLETE')) {
      ({ kind, reason, action } = v);
    } else if (v && v.kind === 'RETRIEVE_AVAILABLE' && !sat.saturated) {
      ({ kind, reason, action } = v);
    } else if (a.confidence >= 0.9 && sat.saturated) {
      kind = 'RETRIEVE_COMPLETE';
      reason = `${a.products} measured families, confidence ${a.confidence}, headroom ${(1 - a.confidence).toFixed(2)} → marginal gain from more reports is low`;
      action = 'No further retrieval — remaining frontier is external durability tests';
    } else if (sat.saturated) {
      kind = 'RETRIEVE_COMPLETE'; reason = `corpus exhausted; ${sat.evidence}`; action = 'No further retrieval';
    } else {
      kind = 'RETRIEVE_AVAILABLE'; reason = `not yet saturated; ${sat.evidence}`; action = 'Retrieve more existing evidence';
    }
    return { asset: a.name, confidence: a.confidence, measured: a.measured,
      frontierType: kind, reason, closingAction: action, expectedDK: EXPECTED_DK[kind] };
  });
}

/** PROTEUS frontier status — explains WHY it recommends retrieve vs generate. */
export function frontierStatus(episodes) {
  // lazy import to avoid cycle at module top
  return import('../assets/knowledge-asset.mjs').then(({ buildKnowledgeAssets }) => {
    const assets = buildKnowledgeAssets(episodes);
    const trans = replayTransformations(episodes);
    return classifyFrontier(assets, trans);
  });
}

/**
 * Knowledge Phase — the RETRIEVE→GENERATE shift is a PHASE TRANSITION of the
 * knowledge space, not an engineering choice. The cave metaphor, made measurable:
 *   • rooms still to light  = RETRIEVE_AVAILABLE (search still pays)
 *   • rooms fully lit       = RETRIEVE_COMPLETE  (explored, nothing left to find)
 *   • passages to carve     = GENERATE_REQUIRED + EXTERNAL_ONLY (must be built)
 * phaseIndex = explorable / (explorable + to-build): 1 = pure RETRIEVE, 0 = pure GENERATE.
 */
export function knowledgePhase(frontier) {
  const n = (k) => frontier.filter((f) => f.frontierType === k).length;
  const explorable = n('RETRIEVE_AVAILABLE');
  const explored = n('RETRIEVE_COMPLETE');
  const toBuild = n('GENERATE_REQUIRED') + n('EXTERNAL_ONLY');
  const phaseIndex = +(explorable / Math.max(1, explorable + toBuild)).toFixed(2);
  const phase = phaseIndex >= 0.66 ? 'RETRIEVE' : phaseIndex >= 0.2 ? 'TRANSITION' : 'GENERATE';
  return {
    phase, phaseIndex, explorable, explored, toBuild,
    rooms_to_light: frontier.filter((f) => f.frontierType === 'RETRIEVE_AVAILABLE').map((f) => f.asset),
    passages_to_carve: frontier.filter((f) => f.frontierType === 'GENERATE_REQUIRED' || f.frontierType === 'EXTERNAL_ONLY').map((f) => f.asset),
    note: phase === 'GENERATE'
      ? 'the cave is lit — missing answers now require carving new passages (generate/external)'
      : phase === 'TRANSITION'
        ? 'at the phase boundary — a few rooms left to light, but most new knowledge must now be built'
        : 'still exploring — searching the corpus still yields new rooms',
  };
}

export const lawStatement =
  'When additional evidence no longer changes an asset\'s knowledge state, the knowledge ' +
  'frontier shifts from RETRIEVAL to GENERATION of new evidence. ' +
  'Validity: the corpus has been broadly scanned AND the last evidence additions for that ' +
  'category drove a consistent decline in ΔKnowledge. ' +
  'Reset: a new unscanned source appears, OR a new type of evidence (measurement/experiment) changes the state.';
