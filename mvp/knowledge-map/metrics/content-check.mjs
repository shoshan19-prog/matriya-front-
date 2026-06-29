// CONTENT CHECK — a validator of CLAIMS (not documents, not events).
//
//   Measured Claim → Units → Baseline → Physical Constraints → REVIEW
//
// Single responsibility, on purpose. This module answers ONE question: "is this
// measured claim self-consistent and consistent with what the asset already
// knows?" It does NOT decide whether the source is allowed (Provenance Fence),
// whether the claim becomes accepted evidence (Human Review), or whether evidence
// becomes an Event / changes ΔK (downstream engines). Keeping it to claims means
// a REVIEW_OUTLIER is never confused with a Knowledge Event — they are different
// things at different layers.
//
// Three independent filters, each with its own job:
//   1. Units    — normalize to the asset's canonical unit; refuse cross-dimension.
//   2. Baseline — is the value statistically consistent with the measured corpus?
//   3. Physics  — does the value violate a known physical/logical LAW of the asset?
// Physics is independent of baseline by design: a value can sit inside a WRONG
// table's range yet still be physically impossible (e.g. water absorption 130%),
// so the physics filter can stop a claim the baseline would have waved through.
//
// Output classes:  ACCEPT · REVIEW_OUTLIER · CONTRADICTS_EXISTING · INSUFFICIENT_BASELINE
// HARD RULE: never auto-reject. Every non-ACCEPT only ever routes to HUMAN REVIEW.
// Honest limit: an in-range, physically-possible false value still needs a human —
// which is the whole point of classifying uncertainty instead of hiding it.

// ── filter 1: units → each asset's canonical unit ────────────────────────────
const TO_CANON = {
  'mpa': (v) => v, 'n/mm2': (v) => v, 'n/mm²': (v) => v, 'kpa': (v) => v / 1000, 'pa': (v) => v / 1e6, 'psi': (v) => v * 0.00689476,
  'g/cm3': (v) => v, 'g/cm³': (v) => v, 'kg/m3': (v) => v / 1000, 'kg/m³': (v) => v / 1000, 'kg/l': (v) => v,
  'de': (v) => v, 'δe': (v) => v, 'dimensionless': (v) => v, '': (v) => v,
  '°c': (v) => v, 'c': (v) => v, 'µm': (v) => v, 'um': (v) => v, '%': (v) => v,
};
const dimOf = (x) => /mpa|n\/mm|kpa|^pa$|psi/.test(x) ? 'pressure'
  : /cm3|cm³|kg\/m|kg\/l/.test(x) ? 'density'
  : /de|δe/.test(x) ? 'color'
  : /°c|^c$/.test(x) ? 'temp'
  : /%/.test(x) ? 'fraction' : 'other';

// ── filter 2: baseline — empirical measured values from the corpus (NOT bounds) ─
export const BASELINE = {
  'Compression Strength': { unit: 'MPa',   values: [1.0, 2.41, 2.84, 3.0, 3.69, 4.3, 4.91, 9.2, 11.7, 13.3, 15.1, 19.61, 20.1, 23.83, 26, 27, 36], note: 'cementitious renders + treated/field cubes' },
  'Density':              { unit: 'g/cm³', values: [0.30, 0.35, 0.45, 0.55, 1.29, 1.327, 1.36, 1.41, 1.47], note: 'lightweight SFRM through silicate coatings' },
  'Color / Shade':        { unit: 'ΔE',    values: [0.01, 0.10, 0.22, 0.58, 0.70, 0.73, 0.85, 1.11, 1.67, 1.74, 1.78, 1.94, 2.06, 21.75], note: 'measured ΔE / DE2000' },
  'Fire Resistance':      { unit: '°C',    values: [5.1], note: 'a single ISO-1182 ΔT — deliberately insufficient' },
  'Water Resistance / Moisture': { unit: '%', values: [], note: 'no measured absorption % on record — baseline insufficient, physics still applies' },
};

// ── filter 3: physics — hard physical/logical LAWS of each asset (not plausibility) ─
// These are universal invariants, independent of the corpus: violating one means
// the value is impossible, not merely unusual. Material-class plausibility lives
// in the baseline fence, NOT here.
export const PHYSICS = {
  'Compression Strength':        { min: 0,     max: 250,   unit: 'MPa',   law: 'strength is ≥ 0 and below the UHPC ceiling for cementitious materials' },
  'Density':                     { min: 0.001, max: 22.6,  unit: 'g/cm³', law: 'mass/volume is strictly positive and below the densest solid (osmium 22.6)' },
  'Color / Shade':               { min: 0,     max: 150,   unit: 'ΔE',    law: 'a colour difference is ≥ 0 and bounded in CIELAB space' },
  'Fire Resistance':             { min: 0,     max: 1500,  unit: '°C',    law: 'an ISO-1182 ΔT rise is ≥ 0' },
  'Water Resistance / Moisture': { min: 0,     max: 100,   unit: '%',     law: 'absorption is a mass fraction — cannot be < 0 or > 100%' },
};

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const quantile = (xs, q) => { const s = [...xs].sort((a, b) => a - b); const p = (s.length - 1) * q; const lo = Math.floor(p); return s[lo] + (s[Math.ceil(p)] - s[lo]) * (p - lo); };

/** filter 1 — normalize {value, unit} to the asset's canonical unit. */
export function checkUnits(value, unit, asset) {
  const want = (BASELINE[asset]?.unit || PHYSICS[asset]?.unit || '').toLowerCase();
  const u = (unit || '').trim().toLowerCase();
  const conv = TO_CANON[u];
  if (conv === undefined) return { ok: false, reason: `unknown unit "${unit}"` };
  if (u && want && dimOf(u) !== 'other' && dimOf(want) !== 'other' && dimOf(u) !== dimOf(want))
    return { ok: false, reason: `unit "${unit}" is not commensurable with ${asset} (${want})` };
  return { ok: true, value: +conv(value).toFixed(4), unit: BASELINE[asset]?.unit || PHYSICS[asset]?.unit || unit };
}

/** filter 3 — does the (normalized) value violate a physical LAW? */
export function checkPhysics(v, asset) {
  const p = PHYSICS[asset];
  if (!p) return { ok: true, applicable: false };
  if (v < p.min || v > p.max) return { ok: false, applicable: true, reason: `${v} ${p.unit} violates physics: ${p.law} (allowed [${p.min}, ${p.max}])` };
  return { ok: true, applicable: true };
}

/** filter 2 — is the (normalized) value statistically consistent with the corpus? */
export function checkBaseline(v, asset) {
  const b = BASELINE[asset];
  if (!b || b.values.length < 3) return { status: 'insufficient', reason: `only ${b?.values.length || 0} baseline point(s) for ${asset} — cannot judge an outlier` };
  const q1 = quantile(b.values, 0.25), q3 = quantile(b.values, 0.75), iqr = q3 - q1;
  const lo = +(q1 - 3 * iqr).toFixed(2), hi = +(q3 + 3 * iqr).toFixed(2);
  if (v < lo || v > hi) return { status: 'outlier', reason: `${v} ${b.unit} is outside the baseline fence [${lo}, ${hi}] (median ${median(b.values)})`, lo, hi };
  return { status: 'within', reason: `${v} ${b.unit} is within the established range (median ${median(b.values)}, fence [${lo}, ${hi}])`, lo, hi };
}

/** Compose the three filters into a REVIEW verdict. Never rejects.
 *  Precedence: a unit problem or a PHYSICS violation outranks a baseline outlier,
 *  because impossibility is a stronger signal than unusualness. */
export function classifyClaim({ asset, value, unit }) {
  const base = { asset, claim: { value, unit }, autoReject: false };

  const units = checkUnits(value, unit, asset);
  if (!units.ok) return { ...base, classification: 'REVIEW_OUTLIER', filters: { units: 'FAIL' }, reason: units.reason, action: 'route to human review (unit problem)' };
  const v = units.value;

  const physics = checkPhysics(v, asset);
  const baseline = checkBaseline(v, asset);
  const filters = { units: 'ok', physics: physics.applicable ? (physics.ok ? 'ok' : 'VIOLATION') : 'n/a', baseline: baseline.status, normalized: v };

  if (!physics.ok)
    return { ...base, normalized: v, classification: 'CONTRADICTS_EXISTING', filters, reason: physics.reason, action: 'route to human review (strong flag — physically impossible)' };
  if (baseline.status === 'outlier')
    return { ...base, normalized: v, classification: 'REVIEW_OUTLIER', filters, reason: baseline.reason, action: 'route to human review' };
  if (baseline.status === 'insufficient')
    return { ...base, normalized: v, classification: 'INSUFFICIENT_BASELINE', filters, reason: baseline.reason + (physics.applicable ? ' (physics passed)' : ''), action: 'route to human review' };
  return { ...base, normalized: v, classification: 'ACCEPT', filters, reason: baseline.reason, action: 'accept as a candidate measured claim (still logged; still needs human sign-off to become evidence)' };
}

// ── adversarial test set: false claims MUST be stopped (as REVIEW, not reject) ──
export const CONTENT_TESTS = [
  { label: 'real plausible (MPZ20)',            claim: { asset: 'Compression Strength', value: 23.83, unit: 'MPa' }, expect: 'ACCEPT' },
  { label: 'FALSE absurd strength (physics)',   claim: { asset: 'Compression Strength', value: 500,   unit: 'MPa' }, expect: 'CONTRADICTS_EXISTING' },
  { label: 'FALSE negative strength (physics)', claim: { asset: 'Compression Strength', value: -5,    unit: 'MPa' }, expect: 'CONTRADICTS_EXISTING' },
  { label: 'FALSE off-baseline (review)',       claim: { asset: 'Compression Strength', value: 80,    unit: 'MPa' }, expect: 'REVIEW_OUTLIER' },
  { label: 'unit auto-normalized (kPa→MPa)',    claim: { asset: 'Compression Strength', value: 20000, unit: 'kPa' }, expect: 'ACCEPT' },
  { label: 'wrong dimension (g/cm³ as MPa)',    claim: { asset: 'Compression Strength', value: 1.4,   unit: 'g/cm³' }, expect: 'REVIEW_OUTLIER' },
  { label: 'FALSE negative density (physics)',  claim: { asset: 'Density',               value: -3,    unit: 'g/cm³' }, expect: 'CONTRADICTS_EXISTING' },
  { label: 'implausible density (baseline)',    claim: { asset: 'Density',               value: 5,     unit: 'g/cm³' }, expect: 'REVIEW_OUTLIER' },
  { label: 'FALSE absorption 130% (physics)',   claim: { asset: 'Water Resistance / Moisture', value: 130, unit: '%' }, expect: 'CONTRADICTS_EXISTING' },
  { label: 'absorption no baseline but legal',  claim: { asset: 'Water Resistance / Moisture', value: 8,   unit: '%' }, expect: 'INSUFFICIENT_BASELINE' },
  { label: 'FALSE absurd ΔE (physics)',         claim: { asset: 'Color / Shade',         value: 250,   unit: 'ΔE' }, expect: 'CONTRADICTS_EXISTING' },
  { label: 'single-point baseline (Fire)',      claim: { asset: 'Fire Resistance',       value: 5.1,   unit: '°C' }, expect: 'INSUFFICIENT_BASELINE' },
  { label: 'qualitative asset (Adhesion)',      claim: { asset: 'Adhesion',              value: 1,     unit: '' }, expect: 'INSUFFICIENT_BASELINE' },
];

export function runContentTests() {
  return CONTENT_TESTS.map((t) => {
    const r = classifyClaim(t.claim);
    return { ...t, got: r.classification, pass: r.classification === t.expect, reason: r.reason, filters: r.filters, autoReject: r.autoReject };
  });
}

/** Did the false claims get stopped (≠ ACCEPT)? Was "no auto-reject" honoured?
 *  Did the PHYSICS filter catch what the baseline alone would have missed? */
export function contentGateSummary() {
  const rows = runContentTests();
  const falses = rows.filter((r) => r.label.startsWith('FALSE'));
  const physicsOnly = rows.filter((r) => r.filters?.physics === 'VIOLATION' && r.filters?.baseline !== 'outlier');
  return {
    rows,
    falseStopped: falses.every((r) => r.got !== 'ACCEPT'),
    noAutoReject: rows.every((r) => r.autoReject === false),
    physicsCaughtBeyondBaseline: physicsOnly.length, // e.g. absorption 130% with insufficient baseline
    classified: rows.filter((r) => r.pass).length, total: rows.length,
  };
}
