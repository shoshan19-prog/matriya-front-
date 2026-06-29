// Priority / ERP → telemetry emitter (Stage 2). RECORD ONLY, behind ingest().
//
// Approved scope: this emitter may record ONLY `experiment_generated` events,
// carrying REAL cost & duration from Priority/ERP when an experiment is ordered
// and finished. That turns the Acquisition Cost Vector from an ESTIMATE into a
// measured value.
//
// Boundaries (same as the Router emitter): append-only · no auto-extract · no
// auto-generate · no graph write · NO change to ERP · no secrets (the ERP doc id
// is HMAC-hashed, never stored raw). Recording a cost triggers no action.

import { appendEvent } from './telemetry.mjs';
import { anonymizeQuery as anonymize } from './router-telemetry.mjs';
import { CANDIDATE_EVENTS } from '../events/learning-primitives.mjs';
import { COST_VECTORS } from '../strategy/cost-vector.mjs';

const PRIORITY_EVENTS = ['experiment_generated'];

/** Privacy-safe event from an ERP order/finish record. Raw ERP doc id is hashed. */
export function experimentEvent({ event, asset, costILS, durationDays, phase = 'finished', erp_doc, ts }) {
  return {
    type: 'experiment_generated',
    ts: ts ?? Date.now(),
    event, asset, phase,                 // phase: 'ordered' | 'finished'
    costILS: costILS ?? null,            // REAL ₪ from Priority
    durationDays: durationDays ?? null,  // REAL days from Priority
    erp_ref: anonymize(erp_doc),         // hashed ERP document id — no secrets
  };
}

/** Record ERP order/finish records (pass-through: ERP is never modified). */
export function recordFromPriority(getLog, setLog, erpRecords = []) {
  for (const r of erpRecords) {
    const ev = experimentEvent(r);
    if (!PRIORITY_EVENTS.includes(ev.type)) continue;   // emitter restricted to experiment_generated
    setLog(appendEvent(getLog(), ev.type, ev));         // append-only
  }
  return getLog();
}

// ── Derived signal: REAL cost vector per event (from finished experiments) ────
export function realCostFromTelemetry(log) {
  const acc = {};
  for (const e of log) {
    if (e.type !== 'experiment_generated' || e.phase !== 'finished') continue;
    const a = acc[e.event] || { ils: 0, days: 0, n: 0 };
    a.ils += e.costILS || 0; a.days += e.durationDays || 0; a.n += 1; acc[e.event] = a;
  }
  const out = {};
  for (const [event, a] of Object.entries(acc))
    out[event] = { ils: Math.round(a.ils / a.n), days: +(a.days / a.n).toFixed(1), n: a.n };
  return out;
}

/** Override estimated costs with the real measured ones where available. */
export function mergedCostVectors(realCosts) {
  const out = {};
  for (const [k, v] of Object.entries(COST_VECTORS)) {
    const real = realCosts[k];
    out[k] = real ? { ...v, ils: real.ils, days: real.days, source: 'telemetry' } : { ...v, source: 'estimate' };
  }
  return out;
}

/** Candidate events with real costs applied (for ROI recompute). */
export function applyRealCosts(realCosts, candidates = CANDIDATE_EVENTS) {
  return candidates.map((c) => realCosts[c.name] ? { ...c, costILS: realCosts[c.name].ils, days: realCosts[c.name].days, costSource: 'telemetry' } : { ...c, costSource: 'estimate' });
}
