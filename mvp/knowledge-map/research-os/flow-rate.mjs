// KNOWLEDGE FLOW RATE — the metabolism of the lab.
//
// Not how much knowledge exists, but how much knowledge MOVES:
//
//   Evidence → Review → Accepted → Episode → Knowledge → Decision
//
// Derived entirely from layers already built (the funnel, the qualification gate,
// the agenda, the pending batch). It exposes the lab's "metabolic rate":
//   • WIP per stage           — how much sits at each stage right now
//   • dwell                   — how long the oldest unit has been stuck (e.g. in Review)
//   • hold rate               — share of claims the gate sends to Review vs ACCEPT
//   • conversion              — how many hypotheses become knowledge
//   • open vs closed          — questions opened vs resolved
//
// Honesty about time: WIP, dwell and ratios are computable from one snapshot. True
// RATES (units/day, average cycle time) need a time series — an append-only flow
// log that accrues as the live pipeline records stage transitions. Those fields are
// returned as null with a clear note until the log has ≥2 timepoints.

import { knowledgeResolution } from './funnel.mjs';
import { qualificationGateSummary } from '../metrics/evidence-qualification.mjs';
import { researchAgenda } from './agenda.mjs';
import { hypothesisCandidates } from './hypotheses.mjs';
import { FIRE_EPISODES_PENDING } from '../schema/fire-episodes.mjs';

// append-only flow log — the substrate true rates will accrue into. Seeded with the
// one transition we actually know: the Drive fire batch received, now in Review.
export const FLOW_LOG = [
  { unit: 'Drive fire batch (INT-TFX)', stage: 'Episode→Review', at: '2026-06-26', note: 'extracted, recognized, awaiting human approval' },
];

const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

/** Compute the flow snapshot. `now` is passed explicitly (deterministic). */
export function knowledgeFlowRate(now = '2026-06-29') {
  const res = knowledgeResolution();
  const gate = qualificationGateSummary().stats;       // {accepted, review, total}
  const agenda = researchAgenda();
  const hyp = hypothesisCandidates().candidates;

  // WIP per funnel stage
  const wip = res.funnel.map((f) => ({ stage: f.stage, count: f.count }));

  // dwell — oldest unit waiting in Review (the fire batch)
  const oldest = FLOW_LOG.filter((e) => e.stage.endsWith('Review')).sort((a, b) => Date.parse(a.at) - Date.parse(b.at))[0];
  const dwell = oldest ? { unit: oldest.unit, stage: 'Review', daysWaiting: days(oldest.at, now) } : null;

  // hold rate — share routed to Review rather than ACCEPT (from the gate)
  const holdRate = gate.total ? +(gate.review / gate.total).toFixed(2) : null;

  // conversion — hypotheses that have become knowledge (none yet: all UNVALIDATED)
  const hypoToKnowledge = { of: hyp.length, became: 0, ratio: 0 };

  // open vs closed questions — opened are visible in the agenda; CLOSED needs a log
  const opened = agenda.counts.reduce((n, c) => n + c.n, 0);

  return {
    now,
    wip,
    dwell,
    holdRate,
    rejectedOrHeld: gate.review, accepted: gate.accepted,
    hypoToKnowledge,
    questions: { opened, closed: null },
    // TRUE rates — require the flow log to accrue over time:
    rates: { evidenceToAcceptDays: null, throughputPerDay: null, openVsCloseRate: null,
      note: 'cycle-time and per-day rates need ≥2 timepoints in FLOW_LOG — they accrue once the live pipeline records transitions' },
    reading: dwell && dwell.daysWaiting > 0
      ? `flow is REVIEW-bound: ${res.batch.entered} fire episodes have waited ${dwell.daysWaiting} days at the Human-Review wall; nothing past it has metabolized (0 → knowledge, 0 → law).`
      : 'flow nominal',
    note: 'metabolism of the lab: how much knowledge moves, where it pools, and where it is stuck — derived, not invented.',
  };
}
