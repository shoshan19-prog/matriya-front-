// Decision Value — the final layer: Knowledge → Decision → Business Value.
//
// The goal is no longer to maximize knowledge but the QUALITY OF DECISIONS the
// organization can make because of it. Priority gains a Business-Impact term, and
// PROTEUS asks: "which next event produces the highest TOTAL VALUE for the org?"
//
//   Priority = f(ΔK, Demand, Business Impact, Cost, Confidence Gap)
//
// Decision-coupling is REAL (events that actually changed a production decision);
// Business Impact is a configurable business input (the company's current focus).

import { CANDIDATE_EVENTS, learningPrimitives } from '../events/learning-primitives.mjs';
import { buildKnowledgeEvents } from '../events/event.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { COST_VECTORS, costComposite, costMaxes } from '../strategy/cost-vector.mjs';
import { demandRegister } from '../strategy/demand.mjs';
import { businessImpactMap, BUSINESS_OBJECTIVES } from './business-impact.mjs';

const DK_REF = 0.465;

/** Real decision-coupling per asset: share of its events that changed a decision. */
export function decisionCoupling(events) {
  const by = new Map();
  for (const e of events) {
    const b = by.get(e.asset) || { n: 0, d: 0 };
    b.n += 1; b.d += e.decisionChanged ? 1 : 0; by.set(e.asset, b);
  }
  const out = {};
  for (const [asset, b] of by) out[asset] = +(0.3 + 0.7 * (b.d / b.n)).toFixed(2); // base 0.3
  return out;
}

export function buildDecisionPriorities(episodes, objectiveKey = 'customer-returns-cracking', realDemand = {}, weights) {
  const events = buildKnowledgeEvents(episodes);
  const prims = learningPrimitives(events);
  const primOf = Object.fromEntries(prims.map((p) => [p.type, p]));
  const assets = buildKnowledgeAssets(episodes);
  const assetOf = Object.fromEntries(assets.map((a) => [a.name, a]));
  const demand = demandRegister(assets, realDemand);
  const coupling = decisionCoupling(events);
  const biz = businessImpactMap(assets.map((a) => a.name), BUSINESS_OBJECTIVES[objectiveKey]);
  const maxes = costMaxes();
  const maxDemand = Math.max(1, ...Object.values(demand).map((d) => d.value));
  const W = weights || { dk: 0.12, demand: 0.12, business: 0.46, gap: 0.10, coupling: 0.20 };

  return CANDIDATE_EVENTS.map((c) => {
    const prim = primOf[c.learningType] || { avgDK: 0.05 };
    const asset = assetOf[c.asset] || { confidence: 0.5 };
    const gap = +(1 - asset.confidence).toFixed(2);
    const dem = demand[c.asset]?.value ?? 0;
    const couple = coupling[c.asset] ?? 0.3;
    const bImpact = biz[c.asset] ?? 0;
    const decisionValue = +(bImpact * (0.4 + 0.6 * couple)).toFixed(2); // Knowledge→Decision→Business
    const v = COST_VECTORS[c.name] || { ils: 1000, days: 5, technicians: 1, external: false };
    const cost = costComposite(v, maxes);
    const value = +(W.dk * (prim.avgDK / DK_REF) + W.demand * (dem / maxDemand) +
      W.business * bImpact + W.gap * gap + W.coupling * couple).toFixed(3);
    return {
      asset: c.asset, mode: c.acquisition, event: c.name,
      expectedDK: +prim.avgDK.toFixed(2), demand: dem, businessImpact: bImpact,
      decisionValue, confGap: gap, cost: v, costComposite: cost,
      priority: +(value / (cost + 0.05)).toFixed(2),
    };
  }).sort((a, b) => b.priority - a.priority);
}

/** PROTEUS's recommendation now includes Business Impact + Decision Value. */
export function protocol(rows) {
  const t = rows[0];
  return { Asset: t.asset, Mode: t.mode, Event: t.event, ExpectedDK: t.expectedDK,
    BusinessImpact: t.businessImpact, DecisionValue: t.decisionValue, Priority: t.priority };
}
