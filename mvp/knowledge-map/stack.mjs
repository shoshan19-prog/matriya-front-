// THE KNOWLEDGE STACK — the epistemic layers, with Representation as a first-class
// guard between Episode and Knowledge.
//
//   Reality → Evidence → Episode → Representation → Human Review → Knowledge → Decision
//
//   Evidence       a measured FACT (units/baseline/physics sound?)
//   Episode        the full CONTEXT of that fact (who, when, which standard, what conditions)
//   Representation  does the system have a MODEL to describe this KIND of knowledge?
//   Human Review   do we accept it?
//   Knowledge      the meaning derived AFTER the event is accepted
//   Decision       what we do about it
//
// The point of the new layer: every new measurement type — Fire, Smoke Toxicity,
// Weathering, UV Aging, anything — follows the SAME path. The system can take in a
// new KIND of knowledge without changing its philosophy; it only extends the
// representation model after review, and never writes new knowledge silently.

import { validateRecord, recognize, ASSET_SCHEMA } from './schema/asset-schema.mjs';

export const LAYERS = [
  { layer: 'Reality',        question: 'what happened in the world' },
  { layer: 'Evidence',       question: 'a measured fact — sound?',           guard: 'Evidence Qualification (units · baseline · physics)' },
  { layer: 'Episode',        question: 'the full context (who · when · standard · conditions)' },
  { layer: 'Representation', question: 'do we have a MODEL for this kind of knowledge?', guard: 'schema recognize()' },
  { layer: 'Human Review',   question: 'do we accept it?' },
  { layer: 'Knowledge',      question: 'the meaning derived once accepted' },
  { layer: 'Decision',       question: 'what we do about it' },
];

/** Route ONE measurement up the stack. Returns where it stopped and why. It never
 *  reaches Knowledge on its own — the most it can do is hand a recognized, sound,
 *  context-wrapped episode to Human Review. Uniform for every measurement type. */
export function routeMeasurement(asset, measurement, context = {}) {
  const trace = [];
  const stop = (layer, status, note) => { trace.push({ layer, status, note }); return { asset, stoppedAt: layer, status, trace, episode }; };

  // Reality → (assumed: something was measured)
  trace.push({ layer: 'Reality', status: 'observed', note: context.source || 'a measurement exists' });

  // Evidence — are the measured values structurally sound (physics)?
  const v = validateRecord(asset, measurement);
  const badPhysics = v.fields.filter((f) => f.modeled && f.withinPhysics === false);
  if (badPhysics.length)
    { const episode = null; return stop('Evidence', 'REVIEW', `physics violation: ${badPhysics.map((f) => `${f.dim}=${f.value}`).join(', ')}`); }
  trace.push({ layer: 'Evidence', status: 'sound', note: 'measured values within physical bounds' });

  // Episode — wrap the fact in its full context (this is the knowledge UNIT)
  const episode = { asset, measurement, sample: context.sample || null, date: context.date || null,
    standard: measurement.standard || null, status: 'CANDIDATE' };
  trace.push({ layer: 'Episode', status: 'formed', note: `unit: ${context.sample || 'sample?'} @ ${measurement.standard || 'standard?'}` });

  // Representation — does a MODEL exist for every dimension of this knowledge?
  const r = recognize(asset, measurement);
  if (!r.recognized) return stop('Representation', 'REVIEW', r.reason);
  trace.push({ layer: 'Representation', status: 'recognized', note: `model v${r.modelVersion} covers all dimensions` });

  // Human Review — the wall. Nothing crosses it automatically.
  return stop('Human Review', 'PENDING', 'a recognized, sound episode — awaiting human approval (no auto-write, no law)');
}

/** A short demo set proving the SAME path serves new measurement types. */
export const STACK_DEMO = [
  { label: 'Fire test 043 @ 2000µm (modeled)', asset: 'Fire Resistance',
    measurement: { standard: 'DIN 4102-8', failureTemp: 500, dft: 2000, timeToFailure: 123, charExpansion: 5.8, certified: false },
    context: { sample: '043', date: '2023-11', source: 'Clariant lab' } },
  { label: 'Smoke Toxicity (NEW kind — unmodeled)', asset: 'Fire Resistance',
    measurement: { standard: 'EN 13501-1', smokeToxicity: 'low', smokeDensity: 250 },
    context: { sample: '044', source: 'future test' } },
  { label: 'UV Aging (NEW asset — no model yet)', asset: 'Weathering / UV',
    measurement: { hours: 1000, deltaE: 2.1, gloss: 80 }, context: { source: 'future test' } },
  { label: 'Compression 30.71 MPa @ 50d (modeled)', asset: 'Compression Strength',
    measurement: { strength: 30.71, age: 50, grade: 'MP20' }, context: { sample: 'MP20', date: '2025-12' } },
];

export function knownAssets() { return Object.keys(ASSET_SCHEMA); }
