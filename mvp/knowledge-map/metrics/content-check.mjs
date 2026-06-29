// CONTENT CHECK — the second half of the validation fence.
//
//   Provenance Fence = is the SOURCE allowed in?   (origin: fresco/project)
//   Content Check     = is the CLAIM itself plausible?  (value vs asset baseline)
//
// The Sensitivity Harness left one gap open: a false "measured" claim with a
// bogus value passes provenance and still moves the metric. This closes it — but
// as a REVIEW GATE, never an auto-reject. A claim is normalized, compared to the
// asset's real baseline distribution, and CLASSIFIED:
//
//   ACCEPT               within the established range — let it in
//   REVIEW_OUTLIER       physically possible but far outside the baseline → hold
//   CONTRADICTS_EXISTING violates a physical/logical constraint → hold (strong flag)
//   INSUFFICIENT_BASELINE too little baseline to judge → hold for a human anyway
//
// HARD RULE: nothing is ever auto-rejected. The gate only ever routes to human
// REVIEW — consistent with MATRIYA's governance (recommend ≠ act; a person
// approves every intake). Honest limit: a plausible IN-RANGE false value cannot be
// caught here; that is why human approval remains, and why this is REVIEW not
// auto-accept. The check also only guards NUMERIC assets — a purely qualitative
// claim has no baseline and stays human-review-only.

// ── unit normalization → each asset's canonical unit ─────────────────────────
const TO_CANON = {
  // pressure → MPa
  'mpa': (v) => v, 'n/mm2': (v) => v, 'n/mm²': (v) => v, 'kpa': (v) => v / 1000, 'pa': (v) => v / 1e6, 'psi': (v) => v * 0.00689476,
  // density → g/cm³
  'g/cm3': (v) => v, 'g/cm³': (v) => v, 'kg/m3': (v) => v / 1000, 'kg/m³': (v) => v / 1000, 'kg/l': (v) => v,
  // colour difference (dimensionless), temperature (°C), length (µm) — identity
  'de': (v) => v, 'δe': (v) => v, 'dimensionless': (v) => v, '': (v) => v,
  '°c': (v) => v, 'c': (v) => v, 'µm': (v) => v, 'um': (v) => v,
};

// ── baselines from the REAL corpus (values that appear in docs/PRODUCT_STORY_*).
// hardMin/hardMax = physical/logical bounds for THIS material class (violating
// them = CONTRADICTS_EXISTING). values = the measured points actually on record.
export const BASELINE = {
  'Compression Strength': { unit: 'MPa', hardMin: 0, hardMax: 150,
    values: [1.0, 2.41, 2.84, 3.0, 3.69, 4.3, 4.91, 9.2, 11.7, 13.3, 15.1, 19.61, 20.1, 23.83, 26, 27, 36],
    note: 'cementitious renders + silicate-treated/field cubes' },
  'Density': { unit: 'g/cm³', hardMin: 0.02, hardMax: 3.0,
    values: [0.30, 0.35, 0.45, 0.55, 1.29, 1.327, 1.36, 1.41, 1.47],
    note: 'lightweight SFRM through silicate coatings' },
  'Color / Shade': { unit: 'ΔE', hardMin: 0, hardMax: 100,
    values: [0.01, 0.10, 0.22, 0.58, 0.70, 0.73, 0.85, 1.11, 1.67, 1.74, 1.78, 1.94, 2.06, 21.75],
    note: 'measured ΔE deck-matches + spectro DE2000' },
  'Fire Resistance': { unit: '°C', hardMin: 0, hardMax: 1200,
    values: [5.1], // ISO-1182 ΔT — the ONLY measured fire number → too few to judge
    note: 'a single ISO-1182 ΔT point (A1 cert) — deliberately insufficient' },
};

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const quantile = (xs, q) => { const s = [...xs].sort((a, b) => a - b); const p = (s.length - 1) * q; const lo = Math.floor(p); return s[lo] + (s[Math.ceil(p)] - s[lo]) * (p - lo); };

/** Normalize a {value, unit} to the asset's canonical unit. */
export function normalize(value, unit, asset) {
  const want = (BASELINE[asset]?.unit || '').toLowerCase();
  const u = (unit || '').trim().toLowerCase();
  const conv = TO_CANON[u];
  if (conv === undefined) return { ok: false, reason: `unknown unit "${unit}"` };
  // sanity: don't convert across dimensions (e.g. g/cm³ into MPa)
  const dimOf = (x) => /mpa|n\/mm|kpa|pa|psi/.test(x) ? 'pressure' : /cm3|cm³|kg\/m|kg\/l/.test(x) ? 'density' : /de|δe/.test(x) ? 'color' : /°c|^c$/.test(x) ? 'temp' : 'other';
  if (u && want && dimOf(u) !== 'other' && dimOf(want) !== 'other' && dimOf(u) !== dimOf(want))
    return { ok: false, reason: `unit "${unit}" is not commensurable with ${asset} (${BASELINE[asset].unit})` };
  return { ok: true, value: +conv(value).toFixed(4), unit: BASELINE[asset]?.unit || unit };
}

/** Classify a measured claim against the asset baseline. Returns a REVIEW verdict,
 *  never a rejection. */
export function classifyClaim({ asset, value, unit }) {
  const b = BASELINE[asset];
  const base = { asset, claim: { value, unit } };
  if (!b) return { ...base, classification: 'INSUFFICIENT_BASELINE', reason: `no numeric baseline for ${asset} (qualitative asset → human-review-only)`, action: 'route to human review', autoReject: false };

  const norm = normalize(value, unit, asset);
  if (!norm.ok) return { ...base, classification: 'REVIEW_OUTLIER', reason: norm.reason, action: 'route to human review (unit problem)', autoReject: false };
  const v = norm.value;

  if (b.values.length < 3)
    return { ...base, normalized: v, classification: 'INSUFFICIENT_BASELINE', reason: `only ${b.values.length} baseline point(s) for ${asset} — cannot judge an outlier`, action: 'route to human review', autoReject: false };

  // physical/logical constraint → CONTRADICTS_EXISTING
  if (v < b.hardMin || v > b.hardMax)
    return { ...base, normalized: v, classification: 'CONTRADICTS_EXISTING',
      reason: `${v} ${b.unit} violates the physical bound [${b.hardMin}, ${b.hardMax}] for ${asset}`,
      action: 'route to human review (strong flag — likely bad data)', autoReject: false };

  // statistical outlier within physical range → REVIEW_OUTLIER (robust IQR fence)
  const q1 = quantile(b.values, 0.25), q3 = quantile(b.values, 0.75), iqr = q3 - q1;
  const lo = q1 - 3 * iqr, hi = q3 + 3 * iqr;
  if (v < lo || v > hi)
    return { ...base, normalized: v, classification: 'REVIEW_OUTLIER',
      reason: `${v} ${b.unit} is outside the baseline fence [${+lo.toFixed(2)}, ${+hi.toFixed(2)}] (median ${median(b.values)})`,
      action: 'route to human review', autoReject: false };

  return { ...base, normalized: v, classification: 'ACCEPT',
    reason: `${v} ${b.unit} is within the established range (median ${median(b.values)}, fence [${+lo.toFixed(2)}, ${+hi.toFixed(2)}])`,
    action: 'accept into the asset (still logged for audit)', autoReject: false };
}

// ── adversarial test set: the false claim MUST be stopped (as REVIEW, not reject) ─
export const CONTENT_TESTS = [
  { label: 'real plausible (Dec-2025 MPZ20)',   claim: { asset: 'Compression Strength', value: 23.83, unit: 'MPa' }, expect: 'ACCEPT' },
  { label: 'FALSE absurd strength',             claim: { asset: 'Compression Strength', value: 500,   unit: 'MPa' }, expect: 'CONTRADICTS_EXISTING' },
  { label: 'FALSE negative strength',           claim: { asset: 'Compression Strength', value: -5,    unit: 'MPa' }, expect: 'CONTRADICTS_EXISTING' },
  { label: 'FALSE in-bounds but off-baseline',  claim: { asset: 'Compression Strength', value: 80,    unit: 'MPa' }, expect: 'REVIEW_OUTLIER' },
  { label: 'unit auto-normalized (kPa→MPa)',    claim: { asset: 'Compression Strength', value: 20000, unit: 'kPa' }, expect: 'ACCEPT' },
  { label: 'wrong dimension (g/cm³ as strength)', claim: { asset: 'Compression Strength', value: 1.4, unit: 'g/cm³' }, expect: 'REVIEW_OUTLIER' },
  { label: 'real plausible ΔE',                 claim: { asset: 'Color / Shade',         value: 1.2,   unit: 'ΔE' },  expect: 'ACCEPT' },
  { label: 'FALSE absurd ΔE',                   claim: { asset: 'Color / Shade',         value: 250,   unit: 'ΔE' },  expect: 'CONTRADICTS_EXISTING' },
  { label: 'single-point baseline (Fire)',      claim: { asset: 'Fire Resistance',       value: 5.1,   unit: '°C' },  expect: 'INSUFFICIENT_BASELINE' },
  { label: 'qualitative asset (Adhesion)',      claim: { asset: 'Adhesion',              value: 1,     unit: '' },    expect: 'INSUFFICIENT_BASELINE' },
];

export function runContentTests() {
  return CONTENT_TESTS.map((t) => {
    const r = classifyClaim(t.claim);
    return { ...t, got: r.classification, pass: r.classification === t.expect, reason: r.reason, autoReject: r.autoReject };
  });
}

/** Did the false claims get stopped (anything other than ACCEPT)? And was the rule
 *  "no auto-reject" honoured everywhere? */
export function contentGateSummary() {
  const rows = runContentTests();
  const falses = rows.filter((r) => r.label.startsWith('FALSE'));
  return {
    rows,
    falseStopped: falses.every((r) => r.got !== 'ACCEPT'),
    noAutoReject: rows.every((r) => r.autoReject === false),
    classified: rows.filter((r) => r.pass).length, total: rows.length,
  };
}
