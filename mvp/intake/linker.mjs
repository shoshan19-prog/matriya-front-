// Knowledge Linker — orchestrates identity resolution for a NormalizedDocument.
//
// Pipeline position:  Normalizer → [Identity Resolver → Knowledge Linker] → MATRIYA
// 1) name/path product match (cheap, high-precision) — handled by classifier.
// 2) if still orphan, EXTRACT entities from name+path+content+metadata and RESOLVE
//    identity via the registry (existing relationships). Orphans become
//    confidence-scored links with evidence — never a hard guess.

import { extractEntities } from './entities.mjs';
import { resolve, confidenceTag } from './identityResolver.mjs';
import { REGISTRY } from './registry.mjs';

/**
 * doc: a NormalizedDocument (already classified). signals.content / signals.metadata
 * are optional parsed text (xlsx text, PDF text, OCR of an image). Without them the
 * resolver still tries name+path, and honestly reports low/zero confidence.
 */
export function link(doc, { content = null, metadata = null } = {}, registry = REGISTRY, typeReliability = {}) {
  const signals = { name: doc.name, path: doc.source?.path, content, metadata };
  const entities = extractEntities(signals);
  const res = resolve(entities, registry, typeReliability);

  doc.identity = {
    entities: entities.map((e) => ({ type: e.type, value: e.value, signal: e.signal })),
    resolved: { product: res.product, confidence: res.confidence, version: res.version, experiment: res.experiment, operator: res.operator, date: res.date, evidence: res.evidence },
  };

  // Only fill product if the classifier left it orphan AND identity gives signal.
  if (!doc.product?.name && res.product && res.confidence > 0) {
    doc.product = {
      name: res.product, code: null,
      confidence: confidenceTag(res.confidence),
      score: res.confidence,
      evidence: `identity: ${res.evidence.join(' + ')}`,
    };
  }
  return doc;
}
