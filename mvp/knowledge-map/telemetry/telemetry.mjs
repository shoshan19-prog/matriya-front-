// Telemetry — the missing REAL signals. RECORDER ONLY.
//
// Scope (hard boundaries, by design):
//   1. Read / append-only.            4. No auto-generate.
//   2. No change to existing decisions. 5. No writing to the evidence graph.
//   3. No auto-extract.                 6. Only logs the 7 allowed event types.
//
// This module RECORDS events and DERIVES two real signals from them:
//   • real Demand per asset      (from router_miss)        → was a proxy
//   • real Decision Ledger        (from outcome_recorded)   → was a model
// It NEVER acts: there is no extract(), no generate(), no graph write here.

export const ALLOWED_EVENTS = Object.freeze([
  'router_miss',           // user/system needed knowledge on an asset and it wasn't there
  'router_hit',            // needed it and found it
  'recommendation_shown',  // PROTEUS surfaced a recommendation
  'human_approved',        // a human approved an Intake/experiment
  'human_rejected',        // a human rejected one
  'experiment_generated',  // an approved experiment was actually run
  'outcome_recorded',      // a decision's real-world outcome was recorded
]);

/** Append one event (pure: returns a new log). Throws on any disallowed type —
 *  the recorder physically cannot do anything except record allowed events. */
export function appendEvent(log, type, payload = {}) {
  if (!ALLOWED_EVENTS.includes(type)) throw new Error(`telemetry: event "${type}" not allowed (recorder is append-only, 7 types)`);
  return [...log, { seq: log.length, type, ...payload }];
}

export const buildLog = (events) => events.reduce((l, e) => appendEvent(l, e.type, e), []);

// ── Derived signal 1: REAL demand per asset (count of router_miss) ───────────
export function demandFromTelemetry(log) {
  const miss = {}, hit = {};
  for (const e of log) {
    if (e.type === 'router_miss') miss[e.asset] = (miss[e.asset] || 0) + 1;
    if (e.type === 'router_hit') hit[e.asset] = (hit[e.asset] || 0) + 1;
  }
  const demand = {};
  for (const a of new Set([...Object.keys(miss), ...Object.keys(hit)]))
    demand[a] = miss[a] || 0; // demand = unmet needs; hits shown for miss-rate context
  return { demand, miss, hit };
}

// ── Derived signal 2: REAL Decision Ledger (from outcome_recorded) ───────────
export function ledgerFromTelemetry(log) {
  return log.filter((e) => e.type === 'outcome_recorded').map((e) => ({
    id: e.decisionId, decision: e.decision, asset: e.asset, mode: e.mode,
    outcome: e.outcome, businessValue: e.businessValue, note: e.note,
  }));
}

// ── Governance audit: the recommend → approve/reject → generate funnel ───────
export function governanceFunnel(log) {
  const c = (t) => log.filter((e) => e.type === t).length;
  return { shown: c('recommendation_shown'), approved: c('human_approved'),
    rejected: c('human_rejected'), generated: c('experiment_generated') };
}

// ── Decisions that CHANGED because of newly acquired knowledge ───────────────
// An outcome_recorded that references a prior decision (changedFrom) and the
// knowledge event that flipped it (viaKnowledge).
export function decisionsChangedByKnowledge(log) {
  return log.filter((e) => e.type === 'outcome_recorded' && e.changedFrom && e.viaKnowledge)
    .map((e) => ({ decision: e.decision, asset: e.asset, changedFrom: e.changedFrom,
      changedTo: e.changedTo, viaKnowledge: e.viaKnowledge, outcome: e.outcome, businessValue: e.businessValue }));
}
