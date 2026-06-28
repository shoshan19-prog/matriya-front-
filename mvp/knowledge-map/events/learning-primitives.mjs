// Learning Primitives — laws of LEARNING (not laws of materials).
//
// Aggregate Knowledge Events by type → an empirical primitive: how much ΔK that
// kind of event produces on average, how often, at what cost. These are the
// organization's learning laws: "FIRST_MEASUREMENT, repeated 4×, avg ΔK 0.46".
// Candidate future events are then PREDICTED from the matching primitive — and
// PROTEUS recommends an EVENT (FIRST_PULL_OFF), not a product or document.

import { COST_MODEL } from './event.mjs';

/** Aggregate events into Learning Primitives. */
export function learningPrimitives(events) {
  const by = new Map();
  for (const e of events) {
    const p = by.get(e.type) || { type: e.type, n: 0, sumDK: 0, sumCost: 0, decisions: 0 };
    p.n += 1; p.sumDK += e.dK; p.sumCost += e.costILS; p.decisions += e.decisionChanged ? 1 : 0;
    by.set(e.type, p);
  }
  return [...by.values()].map((p) => ({
    type: p.type, n: p.n,
    avgDK: +(p.sumDK / p.n).toFixed(3),
    avgCostILS: Math.round(p.sumCost / p.n),
    roiPer1k: +((p.sumDK / p.n) / ((p.sumCost / p.n) / 1000)).toFixed(3),
    decisionRate: +(p.decisions / p.n).toFixed(2),
  })).sort((a, b) => b.avgDK - a.avgDK);
}

// ── Candidate FUTURE events: specific tests PROTEUS could acquire ────────────
// Each instantiates a learning-type (→ predicted ΔK from its primitive), carries
// a specific cost, and an `acquisition`: RETRIEVE (data exists, scout fetches) vs
// GENERATE (data does NOT exist — must run a new lab test). The ROI-scout set
// these verdicts: FIRST_SIEVE_CURVE was RETRIEVED (now in corpus → removed);
// SET/CURE and ADHESION are confirmed ABSENT → GENERATE.
export const CANDIDATE_EVENTS = [
  { name: 'FIRST_SET_TIME',        learningType: 'FIRST_MEASUREMENT', asset: 'Set / Cure',                  costILS: 600,   days: 3,  acquisition: 'GENERATE' },
  { name: 'FIRST_PULL_OFF',        learningType: 'FIRST_MEASUREMENT', asset: 'Adhesion',                    costILS: 1200,  days: 7,  acquisition: 'GENERATE' },
  { name: 'SEM_AFTER_COMPRESSION', learningType: 'MORE_MEASURED',     asset: 'Compression Strength',        costILS: 2500,  days: 14, acquisition: 'GENERATE' },
  { name: 'FREEZE_THAW',           learningType: 'MORE_MEASURED',     asset: 'Compression Strength',         costILS: 9000,  days: 60, acquisition: 'GENERATE' },
  { name: 'EN13381_FIRE_RATING',   learningType: 'MORE_MEASURED',     asset: 'Fire Resistance',             costILS: 18000, days: 45, acquisition: 'GENERATE' },
  { name: 'SALT_SPRAY',            learningType: 'MORE_MEASURED',     asset: 'Water Resistance / Moisture',  costILS: 18000, days: 30, acquisition: 'GENERATE' },
];

function predict(candidate, primitives) {
  const prim = primitives.find((p) => p.type === candidate.learningType) || { avgDK: 0.05 };
  const predictedDK = prim.avgDK;
  return { ...candidate, predictedDK, roiPer1k: +(predictedDK / (candidate.costILS / 1000)).toFixed(3) };
}

// ── EFFICIENCY 1 — cost-aware acquisition: rank events by ROI (ΔK per ₪), not raw ΔK.
export function rankEventsByROI(primitives, candidates = CANDIDATE_EVENTS) {
  return candidates.map((c) => predict(c, primitives)).sort((a, b) => b.roiPer1k - a.roiPer1k);
}

// ── EFFICIENCY 2 — budget-constrained event PORTFOLIO: pick the SET of events
//    that maximizes total expected ΔK under an R&D budget (greedy by ROI, which
//    is optimal for divisible value; good heuristic for the 0/1 case).
export function eventPortfolio(primitives, budgetILS, candidates = CANDIDATE_EVENTS) {
  const ranked = rankEventsByROI(primitives, candidates);
  const chosen = []; let spend = 0, gain = 0;
  for (const e of ranked) {
    if (spend + e.costILS <= budgetILS) { chosen.push(e); spend += e.costILS; gain += e.predictedDK; }
  }
  return { budgetILS, chosen, spendILS: spend, expectedDKtotal: +gain.toFixed(2),
    skipped: ranked.filter((e) => !chosen.includes(e)) };
}
