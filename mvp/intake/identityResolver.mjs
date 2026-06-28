// Identity Resolver — now authority-weighted, with an EVIDENCE CHAIN and a
// MARGIN rule. Asks "which entities are here, and how much do I believe each?"
//
//   #1 Authority: each corroborating entity contributes its TYPE authority.
//   #2 Evidence chain: the score is a chain of (entity, authority), not one number.
//   #3 Margin rule: if two products have comparable SUPPORT, abstain (→ review).

import { productForEntity, REGISTRY } from './registry.mjs';
import { DEFAULT_AUTHORITY, authorityOf } from './authority.mjs';

const noisyOR = (ws) => 1 - ws.reduce((a, w) => a * (1 - w), 1);

export function resolve(entities, registry = REGISTRY, authority = DEFAULT_AUTHORITY, { marginSupport = 0.5 } = {}) {
  const cand = new Map(); // product -> [{type, value, signal, authority}]
  for (const e of entities) {
    const p = productForEntity(e.type, e.value, registry);
    if (!p) continue;
    const arr = cand.get(p.name) || [];
    arr.push({ type: e.type, value: e.value, signal: e.signal, authority: authorityOf(e.type, authority) });
    cand.set(p.name, arr);
  }

  const candidates = [...cand.entries()].map(([product, links]) => {
    const chain = [...new Map(links.map((l) => [`${l.type}=${l.value}`, l])).values()].sort((a, b) => b.authority - a.authority);
    return { product, chain, support: +chain.reduce((s, l) => s + l.authority, 0).toFixed(3), confidence: +noisyOR(chain.map((l) => l.authority)).toFixed(3) };
  }).sort((a, b) => b.support - a.support);

  const top = candidates[0] || null, second = candidates[1] || null;
  // Margin rule on SUPPORT (depth of corroboration), not on the saturated noisy-OR.
  const abstain = !!(top && second && top.support - second.support < marginSupport);

  const pick = (t) => entities.filter((e) => e.type === t).sort((a, b) => b.authority - a.authority)[0]?.value || null;
  return {
    product: top && !abstain ? top.product : null,
    confidence: top ? top.confidence : 0,
    support: top ? top.support : 0,
    chain: top ? top.chain : [],
    abstain,
    ambiguous_between: abstain && top && second ? [top.product, second.product] : null,
    version: pick('version'), experiment: pick('experiment_id'), batch: pick('batch_id'), operator: pick('operator'), date: pick('date'),
    candidates,
  };
}

export const confidenceTag = (s) => (s >= 0.85 ? 'VERIFIED' : s >= 0.6 ? 'PARTIAL' : 'UNVERIFIED');

/** Human-readable evidence chain: "formula_id=f9(0.99) → experiment_id=…(0.98) → …" */
export const renderChain = (chain) => chain.map((l) => `${l.type}=${l.value}(${l.authority})`).join(' → ');
