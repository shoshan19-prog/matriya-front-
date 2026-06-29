// HYPOTHESIS METRIC 1 — Information Potential (IP = ΔEntropy / Cost).
//
// Like a potential difference in physics: not all evidence is equal. Evidence
// that drops entropy 0.82→0.30 is worth far more than ten that drop 0.30→0.29.
// IP makes "which experiment" an optimization of ORDER CREATED per unit cost,
// not of data collected.
//
// ⚠ This is a HYPOTHESIS under test (see metrics/validate-tlv.mjs), not a law.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { assetEntropy } from '../evidence/entropy.mjs';
import { CANDIDATE_EVENTS } from '../events/learning-primitives.mjs';

const sim = (asset) => buildKnowledgeAssets([...REAL_EPISODES,
  { id: 'IP', product: '(sim)', domains: [{ domain: asset, signal: 'measured', note: 'sim' }], materials: [] }])
  .find((x) => x.name === asset);

/** Information Potential per candidate evidence: order created per ₪1,000. */
export function informationPotential(candidates = CANDIDATE_EVENTS, episodes = REAL_EPISODES) {
  const assets = Object.fromEntries(buildKnowledgeAssets(episodes).map((a) => [a.name, a]));
  return candidates.map((c) => {
    const a = assets[c.asset]; if (!a) return null;
    const before = assetEntropy(a);
    const after = assetEntropy(sim(c.asset));
    const dH = +(before - after).toFixed(2);
    return {
      event: c.name, asset: c.asset,
      entropyBefore: before, entropyAfter: after, dEntropy: dH,
      costK: +(((c.costILS || 1000) / 1000)).toFixed(2),
      IP: +(dH / ((c.costILS || 1000) / 1000)).toFixed(3),   // ΔEntropy per ₪1,000
      potential: before >= 0.6 ? 'high (much order to create)' : before >= 0.35 ? 'medium' : 'low (already ordered)',
    };
  }).filter(Boolean).sort((x, y) => y.IP - x.IP);
}
