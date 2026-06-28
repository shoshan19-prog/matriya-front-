// Identity Resolver — turns extracted entities into a confidence-scored identity.
//
// Asks "which entities are in this file, and which known product/version do they
// corroborate?" — not "what does the filename say". Confidence is a noisy-OR over
// the weighted signals that independently support the same product, so multiple
// weak signals (folder + date + operator) can add up, and a single registry-
// confirmed id (experiment_id, batch date) dominates.

import { SIGNAL_WEIGHT } from './entities.mjs';
import { productForEntity, REGISTRY } from './registry.mjs';

const noisyOR = (ws) => 1 - ws.reduce((a, w) => a * (1 - w), 1);

export function resolve(entities, registry = REGISTRY) {
  const cand = new Map(); // product -> [{via, weight}]
  for (const e of entities) {
    const p = productForEntity(e.type, e.value, registry);
    if (!p) continue;
    // registry-confirmed evidence: take the stronger of the signal weight and the relationship weight
    const weight = Math.max(e.weight, SIGNAL_WEIGHT.relationship);
    const arr = cand.get(p.name) || []; arr.push({ via: `${e.type}=${e.value} (${e.signal}+relationship)`, weight }); cand.set(p.name, arr);
  }

  const scored = [...cand.entries()].map(([name, ev]) => {
    // dedupe identical evidence, cap each signal once
    const uniq = [...new Map(ev.map((x) => [x.via, x])).values()];
    return { product: name, confidence: +noisyOR(uniq.map((x) => x.weight)).toFixed(3), evidence: uniq };
  }).sort((a, b) => b.confidence - a.confidence);

  const best = scored[0] || null;
  const pick = (t) => entities.filter((e) => e.type === t).sort((a, b) => b.weight - a.weight)[0]?.value || null;
  return {
    product: best?.product || null,
    confidence: best?.confidence || 0,
    evidence: best ? best.evidence.map((x) => x.via) : [],
    version: pick('version'),
    experiment: pick('experiment_id'),
    operator: pick('operator'),
    date: pick('date'),
    candidates: scored,
  };
}

/** Map a numeric confidence to the project's confidence vocabulary. */
export function confidenceTag(score) {
  return score >= 0.85 ? 'VERIFIED' : score >= 0.6 ? 'PARTIAL' : 'UNVERIFIED';
}
