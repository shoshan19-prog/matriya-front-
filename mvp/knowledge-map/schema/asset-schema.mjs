// ASSET SCHEMA — an asset is a MODEL, not a flat field.
//
// The Drive fire tests proved the deepest point yet: the chain must protect the
// MODEL, not just the document. When a new KIND of measurement arrives, a mature
// system must be able to say "I do not yet know how to represent this" — not
// silently coerce a `time-to-500°C (min)` into a `temperature_delta (°C)`.
//
// So each asset is a MODEL of named measurement dimensions. A record is RECOGNIZED
// only if every one of its dimensions exists in the model; an unmodeled dimension
// routes to REVIEW so a human can extend the model. This protects the model the
// way Units/Baseline/Physics protect the evidence.
//
// NOTE: this only RECOGNISES and VALIDATES structure. It computes no laws, ranks
// nothing, scores nothing — those belong to a later stage, after the schema is
// approved.

export const ASSET_SCHEMA = {
  // Fire Resistance — extended from v1 (a single ISO-1182 ΔT) to a real model,
  // driven by the Clariant intumescent fire tests (time-to-failure vs DFT).
  'Fire Resistance': {
    version: 2,
    dimensions: {
      timeToFailure:  { unit: 'min',    kind: 'measure',   physics: [0, 600],   note: 'time until the steel reaches the failure temperature' },
      failureTemp:    { unit: '°C',     kind: 'condition', physics: [0, 1500],  note: 'steel temperature defining failure (e.g. 500°C)' },
      steelTempCurve: { unit: '°C/min', kind: 'series',                          note: 'cold-side temperature vs time (optional curve)' },
      dft:            { unit: 'µm',     kind: 'condition', physics: [0, 10000], note: 'dry film thickness — fire performance depends on it' },
      charExpansion:  { unit: 'cm',     kind: 'measure',   physics: [0, 50],    note: 'intumescent foam/char expansion' },
      standard:       { kind: 'label',  enum: ['DIN 4102-8', 'EN 13381-8', 'BS 476-20/22', 'ASTM E119', 'ISO 1182', 'ISO 1716'], note: 'test standard' },
      testGeometry:   { kind: 'label',                                          note: 'substrate geometry / section factor (e.g. vertical steel panel)' },
      furnaceProfile: { kind: 'label',  enum: ['cellulosic', 'hydrocarbon', 'custom'], note: 'fire curve' },
      certified:      { kind: 'flag',                                           note: 'is this an official certified report, or intermediate?' },
    },
    legacy: ['temperature_delta'],   // v1 ISO-1182 ΔT stays recognized
  },
  // Compression Strength — its model (already structured in the corpus).
  'Compression Strength': {
    version: 1,
    dimensions: {
      strength: { unit: 'MPa',  kind: 'measure',   physics: [0, 250] },
      age:      { unit: 'days', kind: 'condition', physics: [0, 400], note: 'specimen age — strength develops over time' },
      grade:    { kind: 'label', note: 'product grade (e.g. MP20)' },
      mold:     { kind: 'label', note: 'mold / release agent (metal vs standard, oil vs none)' },
    },
  },
};

/** Does the asset's MODEL recognize every dimension of this record? Recognition is
 *  about representation, not truth — an unmodeled dimension is a REVIEW (extend the
 *  model), never a silent ACCEPT and never a rejection. */
export function recognize(asset, record) {
  const model = ASSET_SCHEMA[asset];
  if (!model) return { asset, recognized: false, decision: 'REVIEW', reason: `no schema model for ${asset}`, unmodeled: Object.keys(record) };
  const known = new Set([...Object.keys(model.dimensions), ...(model.legacy || [])]);
  const dims = Object.keys(record);
  const unmodeled = dims.filter((k) => !known.has(k));
  return {
    asset, modelVersion: model.version,
    modeled: dims.filter((k) => known.has(k)),
    unmodeled,
    recognized: unmodeled.length === 0,
    decision: unmodeled.length === 0 ? 'RECOGNIZED' : 'REVIEW',
    reason: unmodeled.length === 0
      ? 'every dimension is in the model'
      : `unmodeled dimension(s): ${unmodeled.join(', ')} — extend the ${asset} model before ingest`,
  };
}

/** Per-dimension structural validation (recognized? within physical range?).
 *  Still only REVIEW/RECOGNIZED — no value judgement, no law. */
export function validateRecord(asset, record) {
  const model = ASSET_SCHEMA[asset];
  const rec = recognize(asset, record);
  const fields = Object.entries(record).map(([k, v]) => {
    const d = model?.dimensions?.[k];
    const inRange = d?.physics ? (v >= d.physics[0] && v <= d.physics[1]) : null;
    return { dim: k, value: v, modeled: !!d || (model?.legacy || []).includes(k),
      unit: d?.unit || null, withinPhysics: inRange };
  });
  return { ...rec, fields };
}
