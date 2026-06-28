// Innovation 1 — Value of Information (Expected Knowledge Change).
//
// The real basis for knowledge-acquisition optimization is NOT "where is a gap"
// but "which evidence is expected to change the knowledge the most". We learn
// that from the transformation HISTORY: each kind of evidence event (open an
// asset, add the first measurement, add a 2nd product, …) has an empirical
// average Δconfidence. PROTEUS then predicts a candidate's Expected Knowledge
// Change before acquiring it — Value of Information, learned not assumed.

import { transformationType } from './transformation.mjs';

/** Learn average Δconfidence per evidence type from the transformation history. */
export function learnVoIPriors(transformations) {
  const buckets = new Map();
  for (const t of transformations) {
    const k = transformationType(t);
    const b = buckets.get(k) || { type: k, n: 0, sum: 0 };
    b.n += 1; b.sum += t.dConf; buckets.set(k, b);
  }
  const priors = {};
  for (const b of buckets.values()) priors[b.type] = { n: b.n, avgDConf: +(b.sum / b.n).toFixed(3) };
  return priors;
}

// which evidence event is AVAILABLE for an asset, given its current state
function applicableEvent(asset) {
  if (asset.measured === 0) return 'first-measured';        // biggest lever for an unmeasured asset
  if (asset.products < 2) return 'new-product-qualitative';
  return 'more-measured';
}

/**
 * Expected Knowledge Change for acquiring evidence on each asset — Value of
 * Information. Ranks assets by PREDICTED Δconfidence (learned), times how much
 * room is left to improve (1 - confidence). This is PROTEUS's true objective.
 */
export function expectedKnowledgeChange(assets, priors) {
  return assets.map((a) => {
    const event = applicableEvent(a);
    const prior = priors[event] || { avgDConf: 0.05, n: 0 };
    const headroom = 1 - a.confidence;
    const expected = +(prior.avgDConf * (0.5 + 0.5 * headroom * 2)).toFixed(3); // scale by remaining room
    return { asset: a.name, confidence: a.confidence, event,
      predictedDConf: prior.avgDConf, expectedKnowledgeChange: Math.max(0, expected),
      basis: `learned from ${prior.n} past "${event}" transformations`,
      need: a.frontier[0] || '(complete)', lookIn: a.externalKnowledge.slice(0, 2) };
  }).sort((x, y) => y.expectedKnowledgeChange - x.expectedKnowledgeChange);
}
