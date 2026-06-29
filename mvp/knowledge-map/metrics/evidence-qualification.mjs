// EVIDENCE QUALIFICATION — the boundary between "what enters" and "what may
// affect the knowledge model".
//
//   Measured Claim → Units → Baseline → Physics → (decision) → REVIEW
//
// This is no longer just a "content check". It QUALIFIES a claim — determines its
// fitness to become evidence at all — before any human review, before any Event,
// before any ΔK. Three filters, and the point is that each speaks with a DIFFERENT
// AUTHORITY, not merely runs a different function:
//
//   filter    question                           source of authority
//   ───────   ────────────────────────────────   ──────────────────────────────────
//   Units     is the claim INTELLIGIBLE?          the unit & type system
//   Baseline  is it ANOMALOUS vs measured-so-far? the Fresco corpus
//   Physics   is it POSSIBLE at all?              general physical/chemical law
//
// So the three are three LEVELS of knowledge — representation, local knowledge,
// the world — and when they disagree the system can explain WHY a claim was held:
//   "Water absorption = 130%  →  units PASS, baseline INSUFFICIENT, physics VIOLATION
//    ⇒ the claim is intelligible; we have no history for this asset; but it
//      contradicts a physical law."  (a stronger reason than a bare verdict.)
//
// The three filter results are stored SEPARATELY in the record so they can be
// analysed independently (how many reviews came from units vs corpus vs physics?)
// and each filter improved without touching the others.
//
// HARD RULE: never auto-reject. The decision is only ever ACCEPT or REVIEW.

// ── the three authorities (used in the human-readable reasoning) ─────────────
export const AUTHORITY = {
  units:    'the unit & type system (is the claim intelligible?)',
  baseline: 'the Fresco corpus (is it anomalous vs what we have measured?)',
  physics:  'general physical/chemical law (is it possible at all?)',
};

// ── filter 1 source: units → each asset's canonical unit ─────────────────────
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

// ── filter 2 source: baseline — empirical measured values from the Fresco corpus ─
export const BASELINE = {
  'Compression Strength': { unit: 'MPa',   values: [1.0, 2.41, 2.84, 3.0, 3.69, 4.3, 4.91, 9.2, 11.7, 13.3, 15.1, 19.61, 20.1, 23.83, 26, 27, 36], note: 'cementitious renders + treated/field cubes' },
  'Density':              { unit: 'g/cm³', values: [0.30, 0.35, 0.45, 0.55, 1.29, 1.327, 1.36, 1.41, 1.47], note: 'lightweight SFRM through silicate coatings' },
  'Color / Shade':        { unit: 'ΔE',    values: [0.01, 0.10, 0.22, 0.58, 0.70, 0.73, 0.85, 1.11, 1.67, 1.74, 1.78, 1.94, 2.06, 21.75], note: 'measured ΔE / DE2000' },
  'Fire Resistance':      { unit: '°C',    values: [5.1], note: 'a single ISO-1182 ΔT — deliberately insufficient' },
  'Water Resistance / Moisture': { unit: '%', values: [], note: 'no measured absorption % on record — baseline insufficient, physics still applies' },
};

// ── filter 3 source: physics — universal physical/logical LAWS of each asset ──
export const PHYSICS = {
  'Compression Strength':        { min: 0,     max: 250,   unit: 'MPa',   law: 'strength is ≥ 0 and below the UHPC ceiling for cementitious materials' },
  'Density':                     { min: 0.001, max: 22.6,  unit: 'g/cm³', law: 'mass/volume is strictly positive and below the densest solid (osmium 22.6)' },
  'Color / Shade':               { min: 0,     max: 150,   unit: 'ΔE',    law: 'a colour difference is ≥ 0 and bounded in CIELAB space' },
  'Fire Resistance':             { min: 0,     max: 1500,  unit: '°C',    law: 'an ISO-1182 ΔT rise is ≥ 0' },
  'Water Resistance / Moisture': { min: 0,     max: 100,   unit: '%',     law: 'absorption is a mass fraction — cannot be < 0 or > 100%' },
};

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const quantile = (xs, q) => { const s = [...xs].sort((a, b) => a - b); const p = (s.length - 1) * q; const lo = Math.floor(p); return s[lo] + (s[Math.ceil(p)] - s[lo]) * (p - lo); };

/** filter 1 (authority: units) — PASS or UNINTELLIGIBLE. */
export function checkUnits(value, unit, asset) {
  const want = (BASELINE[asset]?.unit || PHYSICS[asset]?.unit || '').toLowerCase();
  const u = (unit || '').trim().toLowerCase();
  const conv = TO_CANON[u];
  if (conv === undefined) return { status: 'UNINTELLIGIBLE', authority: AUTHORITY.units, reason: `unknown unit "${unit}"` };
  if (u && want && dimOf(u) !== 'other' && dimOf(want) !== 'other' && dimOf(u) !== dimOf(want))
    return { status: 'UNINTELLIGIBLE', authority: AUTHORITY.units, reason: `unit "${unit}" is not commensurable with ${asset} (${want})` };
  return { status: 'PASS', authority: AUTHORITY.units, value: +conv(value).toFixed(4), unit: BASELINE[asset]?.unit || PHYSICS[asset]?.unit || unit };
}

/** filter 3 (authority: physics) — PASS, VIOLATION, or NA. */
export function checkPhysics(v, asset) {
  const p = PHYSICS[asset];
  if (!p) return { status: 'NA', authority: AUTHORITY.physics };
  if (v < p.min || v > p.max) return { status: 'VIOLATION', authority: AUTHORITY.physics, reason: `${v} ${p.unit} violates ${p.law} (allowed [${p.min}, ${p.max}])` };
  return { status: 'PASS', authority: AUTHORITY.physics };
}

/** filter 2 (authority: Fresco corpus) — WITHIN, OUTLIER, or INSUFFICIENT. */
export function checkBaseline(v, asset) {
  const b = BASELINE[asset];
  if (!b || b.values.length < 3) return { status: 'INSUFFICIENT', authority: AUTHORITY.baseline, reason: `only ${b?.values.length || 0} baseline point(s) for ${asset}` };
  const q1 = quantile(b.values, 0.25), q3 = quantile(b.values, 0.75), iqr = q3 - q1;
  const lo = +(q1 - 3 * iqr).toFixed(2), hi = +(q3 + 3 * iqr).toFixed(2);
  if (v < lo || v > hi) return { status: 'OUTLIER', authority: AUTHORITY.baseline, reason: `${v} ${b.unit} is outside the corpus fence [${lo}, ${hi}] (median ${median(b.values)})`, lo, hi };
  return { status: 'WITHIN', authority: AUTHORITY.baseline, reason: `${v} ${b.unit} is within the corpus range (median ${median(b.values)}, fence [${lo}, ${hi}])`, lo, hi };
}

// reasoning that names all three authorities (stronger than a bare verdict)
function narrate(u, b, p) {
  if (u.status !== 'PASS') return `not intelligible — ${u.reason} (authority: units)`;
  const parts = ['intelligible (units ✓)'];
  parts.push(b.status === 'WITHIN' ? 'consistent with the Fresco corpus'
    : b.status === 'OUTLIER' ? `anomalous vs the corpus — ${b.reason}`
    : 'no corpus history yet for this asset');
  parts.push(p.status === 'VIOLATION' ? `but it contradicts a physical law — ${p.reason}`
    : p.status === 'PASS' ? 'and physically possible'
    : 'no physical law on file');
  return parts.join('; ');
}

/** QUALIFY a measured claim. Returns the three filter results SEPARATELY plus a
 *  decision. Never rejects — decision ∈ {ACCEPT, REVIEW}. */
export function qualifyEvidence({ asset, value, unit }) {
  const u = checkUnits(value, unit, asset);
  if (u.status !== 'PASS') {
    return { asset, claim: { value, unit }, units: 'UNINTELLIGIBLE', baseline: 'NA', physics: 'NA',
      decision: 'REVIEW', cause: 'units', classification: 'UNINTELLIGIBLE',
      reason: narrate(u, {}, {}), authorities: { units: u.authority }, autoReject: false,
      action: 'route to human review (unit/type problem)' };
  }
  const v = u.value;
  const p = checkPhysics(v, asset);
  const b = checkBaseline(v, asset);

  // dominant cause (precedence: physics > baseline-outlier > baseline-insufficient)
  let cause = null, classification = 'ACCEPT', decision = 'ACCEPT';
  if (p.status === 'VIOLATION') { cause = 'physics'; classification = 'CONTRADICTS_EXISTING'; decision = 'REVIEW'; }
  else if (b.status === 'OUTLIER') { cause = 'baseline-outlier'; classification = 'REVIEW_OUTLIER'; decision = 'REVIEW'; }
  else if (b.status === 'INSUFFICIENT') { cause = 'baseline-insufficient'; classification = 'INSUFFICIENT_BASELINE'; decision = 'REVIEW'; }

  return {
    asset, claim: { value, unit }, normalized: v,
    units: u.status, baseline: b.status, physics: p.status,   // ← stored SEPARATELY
    decision, cause, classification,
    reason: narrate(u, b, p),
    authorities: { units: AUTHORITY.units, baseline: AUTHORITY.baseline, physics: AUTHORITY.physics },
    autoReject: false,
    action: decision === 'ACCEPT'
      ? 'accept as a candidate measured claim (still needs human sign-off to become evidence)'
      : `route to human review (${cause})`,
  };
}

// backward-compatible alias — the content check is the core of qualification
export const classifyClaim = qualifyEvidence;

// ── adversarial test set: false claims MUST be stopped (REVIEW, never reject) ──
export const QUALIFICATION_TESTS = [
  { label: 'real plausible (MPZ20)',            claim: { asset: 'Compression Strength', value: 23.83, unit: 'MPa' },   expect: { units: 'PASS', physics: 'PASS', baseline: 'WITHIN', decision: 'ACCEPT' } },
  { label: 'FALSE absurd strength (physics)',   claim: { asset: 'Compression Strength', value: 500,   unit: 'MPa' },   expect: { physics: 'VIOLATION', decision: 'REVIEW' } },
  { label: 'FALSE negative strength (physics)', claim: { asset: 'Compression Strength', value: -5,    unit: 'MPa' },   expect: { physics: 'VIOLATION', decision: 'REVIEW' } },
  { label: 'FALSE off-baseline (corpus)',       claim: { asset: 'Compression Strength', value: 80,    unit: 'MPa' },   expect: { physics: 'PASS', baseline: 'OUTLIER', decision: 'REVIEW' } },
  { label: 'unit auto-normalized (kPa→MPa)',    claim: { asset: 'Compression Strength', value: 20000, unit: 'kPa' },   expect: { units: 'PASS', decision: 'ACCEPT' } },
  { label: 'wrong dimension (g/cm³ as MPa)',    claim: { asset: 'Compression Strength', value: 1.4,   unit: 'g/cm³' }, expect: { units: 'UNINTELLIGIBLE', decision: 'REVIEW' } },
  { label: 'FALSE negative density (physics)',  claim: { asset: 'Density',               value: -3,    unit: 'g/cm³' }, expect: { physics: 'VIOLATION', decision: 'REVIEW' } },
  { label: 'implausible density (corpus)',      claim: { asset: 'Density',               value: 5,     unit: 'g/cm³' }, expect: { physics: 'PASS', baseline: 'OUTLIER', decision: 'REVIEW' } },
  { label: 'FALSE absorption 130% (physics)',   claim: { asset: 'Water Resistance / Moisture', value: 130, unit: '%' }, expect: { units: 'PASS', baseline: 'INSUFFICIENT', physics: 'VIOLATION', decision: 'REVIEW' } },
  { label: 'absorption 8% (legal, no corpus)',  claim: { asset: 'Water Resistance / Moisture', value: 8,   unit: '%' }, expect: { physics: 'PASS', baseline: 'INSUFFICIENT', decision: 'REVIEW' } },
  { label: 'FALSE absurd ΔE (physics)',         claim: { asset: 'Color / Shade',         value: 250,   unit: 'ΔE' },    expect: { physics: 'VIOLATION', decision: 'REVIEW' } },
  { label: 'single-point baseline (Fire)',      claim: { asset: 'Fire Resistance',       value: 5.1,   unit: '°C' },    expect: { baseline: 'INSUFFICIENT', decision: 'REVIEW' } },
  { label: 'qualitative asset (Adhesion)',      claim: { asset: 'Adhesion',              value: 1,     unit: '' },      expect: { baseline: 'INSUFFICIENT', decision: 'REVIEW' } },
];

const matches = (got, expect) => Object.entries(expect).every(([k, v]) => got[k] === v);

export function runQualificationTests() {
  return QUALIFICATION_TESTS.map((t) => {
    const r = qualifyEvidence(t.claim);
    return { ...t, record: { units: r.units, baseline: r.baseline, physics: r.physics, decision: r.decision }, pass: matches(r, t.expect), reason: r.reason, autoReject: r.autoReject };
  });
}

/** Statistics over a batch of qualification records — how many REVIEWs came from
 *  each authority. Each review is attributed to ONE dominant cause, so the counts
 *  partition cleanly and each filter can be improved on evidence. */
export function qualificationStats(records) {
  const rev = records.filter((r) => r.decision === 'REVIEW');
  const c = (cause) => rev.filter((r) => r.cause === cause).length;
  return {
    total: records.length, accepted: records.filter((r) => r.decision === 'ACCEPT').length, review: rev.length,
    byAuthority: { units: c('units'), physics: c('physics'), corpusOutlier: c('baseline-outlier'), corpusInsufficient: c('baseline-insufficient') },
  };
}

/** Gate summary for the adversarial test set (used by the Sensitivity Harness). */
export function qualificationGateSummary() {
  const rows = runQualificationTests();
  const recs = QUALIFICATION_TESTS.map((t) => qualifyEvidence(t.claim));
  const falses = rows.filter((r) => r.label.startsWith('FALSE'));
  const physicsBeyondCorpus = recs.filter((r) => r.physics === 'VIOLATION' && r.baseline !== 'OUTLIER').length;
  return {
    rows,
    falseStopped: falses.every((r) => r.record.decision === 'REVIEW'),
    noAutoReject: rows.every((r) => r.autoReject === false),
    physicsCaughtBeyondBaseline: physicsBeyondCorpus,
    classified: rows.filter((r) => r.pass).length, total: rows.length,
    stats: qualificationStats(recs),
  };
}

// backward-compatible alias
export const contentGateSummary = qualificationGateSummary;
