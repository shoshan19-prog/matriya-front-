// Knowledge Intake — the NORMALIZED document (source-agnostic, zero deps).
//
//   SharePoint ┐
//   Drive      ├─► Collector(adapter) ─► Normalizer ─► Classifier ─► MATRIYA Graph ─► PROTEUS
//   Dropbox …  ┘
//
// Every source produces the SAME NormalizedDocument, so MATRIYA never depends on
// the source. The unit carries PROVENANCE + content_hash so idempotency and
// MATRIYA's calibration/audit discipline extend all the way back to intake.

import { createHash } from 'node:crypto';

export const FIELD_FLAGS = ['composition', 'percentages', 'psd', 'water_powder', 'process', 'strength', 'dates'];

/** Stable id from (source_system, source_id) — same file across re-runs => same id. */
export const docId = (system, sourceId) => 'doc_' + createHash('sha256').update(`${system}:${sourceId}`).digest('hex').slice(0, 16);

/**
 * A normalized document:
 * {
 *   doc_id, source:{system, site, path, source_id, web_url}, name, mime_type, size_bytes,
 *   doc_type, fields_present:{...flags}, versions:[], product:{name,code,confidence,evidence},
 *   provenance:{ fetched_at, content_hash, collector }, raw_ref
 * }
 */
export function emptyDoc() {
  return {
    doc_id: null,
    source: { system: null, site: null, path: null, source_id: null, web_url: null },
    name: null, mime_type: null, size_bytes: null,
    doc_type: 'unknown',
    fields_present: Object.fromEntries(FIELD_FLAGS.map((f) => [f, false])),
    versions: [],
    product: { name: null, code: null, confidence: 'UNVERIFIED', evidence: null },
    provenance: { fetched_at: null, content_hash: null, collector: null },
    raw_ref: null,
  };
}

export function validate(d) {
  const e = [];
  if (!d.doc_id) e.push('doc_id missing');
  if (!d.source?.system) e.push('source.system missing');
  if (!d.source?.source_id) e.push('source.source_id missing');
  if (!d.name) e.push('name missing');
  if (!d.provenance?.content_hash) e.push('provenance.content_hash missing (no idempotency)');
  if (!['VERIFIED', 'PARTIAL', 'UNVERIFIED'].includes(d.product?.confidence)) e.push('product.confidence invalid');
  return { ok: e.length === 0, errors: e };
}
