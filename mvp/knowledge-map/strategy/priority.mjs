// Knowledge Strategy — the priority function that makes PROTEUS an R&D manager.
//
//   Priority = f(ΔKnowledge, Demand, Acquisition Cost, Confidence Gap)
//
// The next experiment is no longer "what teaches the most" but "what produces the
// most VALUE for the whole system". PROTEUS returns four fields — Asset · Mode
// (Retrieve/Generate) · Event · Expected ΔK — and, given a budget and free lab
// time, plans the R&D PORTFOLIO over the full cost vector.

import { CANDIDATE_EVENTS, learningPrimitives } from '../events/learning-primitives.mjs';
import { buildKnowledgeEvents } from '../events/event.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { COST_VECTORS, costComposite, costMaxes } from './cost-vector.mjs';
import { demandRegister } from './demand.mjs';

const DK_REF = 0.465; // reference ΔK (first-measurement) for normalization

export function buildPriorities(episodes, realDemand = {}, weights) {
  const prims = learningPrimitives(buildKnowledgeEvents(episodes));
  const primOf = Object.fromEntries(prims.map((p) => [p.type, p]));
  const assets = buildKnowledgeAssets(episodes);
  const assetOf = Object.fromEntries(assets.map((a) => [a.name, a]));
  const demand = demandRegister(assets, realDemand);
  const maxes = costMaxes();
  const maxDemand = Math.max(1, ...Object.values(demand).map((d) => d.value));
  const W = weights || { dk: 0.30, demand: 0.35, gap: 0.20, decision: 0.15 };

  return CANDIDATE_EVENTS.map((c) => {
    const prim = primOf[c.learningType] || { avgDK: 0.05, decisionRate: 0 };
    const asset = assetOf[c.asset] || { confidence: 0.5 };
    const gap = +(1 - asset.confidence).toFixed(2);
    const dem = demand[c.asset]?.value ?? 0;
    const v = COST_VECTORS[c.name] || { ils: 1000, days: 5, technicians: 1, external: false };
    const cost = costComposite(v, maxes);
    const value = +(W.dk * (prim.avgDK / DK_REF) + W.demand * (dem / maxDemand) +
      W.gap * gap + W.decision * (prim.decisionRate || 0)).toFixed(3);
    return {
      asset: c.asset, mode: c.acquisition, event: c.name,
      expectedDK: +prim.avgDK.toFixed(2),
      demand: dem, demandSource: demand[c.asset]?.source,
      confGap: gap, cost: v, costComposite: cost,
      value, priority: +(value / (cost + 0.05)).toFixed(2),   // value per unit cost
    };
  }).sort((a, b) => b.priority - a.priority);
}

/** PROTEUS's four-field recommendation. */
export function protocol(rows) {
  const t = rows[0];
  return { Asset: t.asset, Mode: t.mode, Event: t.event, ExpectedDK: t.expectedDK, Priority: t.priority };
}

/** R&D manager: pick the portfolio under a money budget AND a lab-time window.
 *  Money is a shared budget (cumulative); lab time is a window each event must
 *  fit (different equipment runs in parallel). Greedy by priority. */
export function rdPlan(rows, { budgetILS, labDays }) {
  const chosen = []; let ils = 0;
  for (const r of rows) {
    if (ils + r.cost.ils <= budgetILS && r.cost.days <= labDays) { chosen.push(r); ils += r.cost.ils; }
  }
  return { budgetILS, labDays, chosen, spendILS: ils,
    expectedDKtotal: +chosen.reduce((s, r) => s + r.expectedDK, 0).toFixed(2) };
}
