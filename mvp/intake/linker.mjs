// Knowledge Linker — orchestrates identity resolution for a NormalizedDocument,
// now carrying the evidence chain and honoring the margin (abstain → review).

import { extractEntities } from './entities.mjs';
import { resolve, confidenceTag, renderChain } from './identityResolver.mjs';
import { REGISTRY } from './registry.mjs';
import { DEFAULT_AUTHORITY } from './authority.mjs';

export function link(doc, { content = null, metadata = null } = {}, registry = REGISTRY, authority = DEFAULT_AUTHORITY) {
  const signals = { name: doc.name, path: doc.source?.path, content, metadata };
  const entities = extractEntities(signals);
  const res = resolve(entities, registry, authority);

  doc.identity = {
    entities: entities.map((e) => ({ type: e.type, value: e.value, signal: e.signal })),
    resolved: {
      product: res.product, confidence: res.confidence, support: res.support,
      chain: res.chain, chain_text: renderChain(res.chain),
      abstain: res.abstain, ambiguous_between: res.ambiguous_between,
      version: res.version, experiment: res.experiment, batch: res.batch, operator: res.operator, date: res.date,
    },
  };

  if (!doc.product?.name && res.product && res.confidence > 0) {
    doc.product = { name: res.product, code: null, confidence: confidenceTag(res.confidence), score: res.confidence, evidence: `identity: ${doc.identity.resolved.chain_text}` };
  } else if (!doc.product?.name && res.abstain) {
    // ambiguous → route to review, do NOT pick (this is the margin rule preventing a false link)
    doc.product = { name: null, code: null, confidence: 'REVIEW', score: res.confidence, evidence: `ambiguous between ${res.ambiguous_between?.join(' / ')}` };
  }
  return doc;
}
