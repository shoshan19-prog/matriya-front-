// Validated Judgment — MVP engine (zero dependencies, runnable with `node`).
//
// The atomic unit is NOT an experiment. It is a *Validated Judgment*:
//   an expert decision under uncertainty, with its rejected alternatives and a
//   FALSIFIABLE prediction, that reality grades over time.
//
// This file is the minimum useful + testable core:
//   1. a schema + validator that REFUSES a judgment with no falsifiable prediction
//   2. a closure scheduler (what follow-up is due, and when)
//   3. a grader (observed value -> matched / partial / missed)
//   4. a confidence metric (Brier score: was the expert's confidence honest?)
//
// Persistence is a plain JSON file so the MVP is inspectable and needs no DB.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// ---------------------------------------------------------------------------
// 1. SCHEMA + VALIDATION
// ---------------------------------------------------------------------------
// A prediction is the heart of the unit. It must be falsifiable: a metric, a
// way to check it, and a horizon at which reality will answer. We support two
// kinds — numeric (e.g. wall moisture %) and qualitative ordered severity
// (e.g. delamination: none < minimal < moderate < severe).

const SEVERITY = ['none', 'minimal', 'moderate', 'severe'];

export function validateJudgment(j) {
  const errors = [];
  const req = (path, v) => { if (v === undefined || v === null || v === '') errors.push(`missing: ${path}`); };

  req('domain', j.domain);
  req('decided_by', j.decided_by);
  req('decided_at', j.decided_at);
  req('context.substrate', j.context?.substrate);
  req('context.conditions', j.context?.conditions);
  req('problem', j.problem);
  req('decision', j.decision);
  req('rationale', j.rationale);

  if (!(j.confidence > 0 && j.confidence <= 1)) errors.push('confidence must be in (0, 1]');

  if (!Array.isArray(j.alternatives_considered) || j.alternatives_considered.length === 0)
    errors.push('alternatives_considered: at least one rejected option is required (the why-not is the asset)');
  else j.alternatives_considered.forEach((a, i) => {
    if (!a.option) errors.push(`alternatives_considered[${i}].option missing`);
    if (!a.why_rejected) errors.push(`alternatives_considered[${i}].why_rejected missing`);
  });

  // The rule that keeps the corpus ungameable: NO falsifiable prediction => REJECT.
  if (!Array.isArray(j.predictions) || j.predictions.length === 0) {
    errors.push('predictions: at least one FALSIFIABLE prediction is required — a judgment with no testable prediction is rejected at capture');
  } else {
    j.predictions.forEach((p, i) => {
      req(`predictions[${i}].metric`, p.metric);
      if (!(p.horizon_days > 0)) errors.push(`predictions[${i}].horizon_days must be > 0 (when will reality answer?)`);
      if (p.kind === 'numeric') {
        if (!['<', '<=', '>', '>=', '=='].includes(p.comparator)) errors.push(`predictions[${i}].comparator invalid`);
        if (typeof p.target !== 'number') errors.push(`predictions[${i}].target must be a number`);
      } else if (p.kind === 'qualitative') {
        if (!SEVERITY.includes(p.expected_max)) errors.push(`predictions[${i}].expected_max must be one of ${SEVERITY.join('|')}`);
      } else {
        errors.push(`predictions[${i}].kind must be 'numeric' or 'qualitative'`);
      }
    });
  }
  return { ok: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// 2. CLOSURE SCHEDULER — what follow-up is due, and when
// ---------------------------------------------------------------------------
const DAY = 86_400_000;

export function dueFollowups(j, asOfISO) {
  const decided = Date.parse(j.decided_at);
  const asOf = Date.parse(asOfISO);
  return j.predictions
    .map((p, idx) => ({ idx, p, dueAt: new Date(decided + p.horizon_days * DAY).toISOString().slice(0, 10) }))
    .filter(({ idx, dueAt }) => Date.parse(dueAt) <= asOf && !(j.observations || []).some(o => o.prediction_idx === idx));
}

// ---------------------------------------------------------------------------
// 3. GRADER — observed value -> matched / partial / missed
// ---------------------------------------------------------------------------
const GRADE_VALUE = { matched: 1, partial: 0.5, missed: 0 };

export function gradePrediction(p, observed) {
  if (p.kind === 'numeric') {
    const v = observed.value, t = p.target;
    const sat = { '<': v < t, '<=': v <= t, '>': v > t, '>=': v >= t, '==': v === t }[p.comparator];
    if (sat) return 'matched';
    const band = p.partial_band ?? Math.max(Math.abs(t) * 0.2, 1);
    const near = (p.comparator === '<' || p.comparator === '<=') ? v <= t + band
               : (p.comparator === '>' || p.comparator === '>=') ? v >= t - band
               : Math.abs(v - t) <= band;
    return near ? 'partial' : 'missed';
  }
  // qualitative ordered severity: matched if no worse than expected_max
  const oi = SEVERITY.indexOf(observed.value), ei = SEVERITY.indexOf(p.expected_max);
  if (oi <= ei) return 'matched';
  if (oi === ei + 1) return 'partial';
  return 'missed';
}

// ---------------------------------------------------------------------------
// 4. CONFIDENCE METRIC — was the expert's stated confidence honest?
// ---------------------------------------------------------------------------
// Brier score per prediction: (confidence - outcome)^2, averaged. Lower is
// better-calibrated. This is how, across many judgments, you learn whether an
// expert (or a model) is over- or under-confident — the sellable asset.

export function scoreJudgment(j) {
  const graded = (j.observations || []).map(o => {
    const p = j.predictions[o.prediction_idx];
    const grade = gradePrediction(p, o);
    return { metric: p.metric, horizon_days: p.horizon_days, observed: o.value, expected: p.kind === 'numeric' ? `${p.comparator} ${p.target}` : `<= ${p.expected_max}`, grade, value: GRADE_VALUE[grade] };
  });
  const n = graded.length;
  const outcome = n ? graded.reduce((s, g) => s + g.value, 0) / n : null;       // 0..1 how right the judgment was
  const brier = n ? graded.reduce((s, g) => s + (j.confidence - g.value) ** 2, 0) / n : null; // 0..1 calibration error
  const verdict = outcome === null ? 'open' : outcome >= 0.8 ? 'CORRECT' : outcome >= 0.5 ? 'PARTIALLY CORRECT' : 'INCORRECT';
  const calibration = brier === null ? 'n/a'
    : brier <= 0.1 ? 'well-calibrated'
    : (outcome < j.confidence ? 'OVER-confident' : 'UNDER-confident');
  return { closed: n, total: j.predictions.length, outcome, brier, verdict, calibration, graded };
}

// ---------------------------------------------------------------------------
// store helpers (plain JSON file)
// ---------------------------------------------------------------------------
export function load(path) { return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { judgments: [] }; }
export function save(path, store) { writeFileSync(path, JSON.stringify(store, null, 2)); }

export function addJudgment(store, j) {
  const { ok, errors } = validateJudgment(j);
  if (!ok) throw new Error('REJECTED at capture:\n  - ' + errors.join('\n  - '));
  store.judgments.push(j);
  return j;
}

export function recordObservation(j, prediction_idx, value, observed_at, evidence = []) {
  j.observations = j.observations || [];
  j.observations.push({ prediction_idx, value, observed_at, evidence });
  j.status = (j.observations.length >= j.predictions.length) ? 'closed' : 'open';
}
