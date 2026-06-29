// VALIDATION TEST 4 — Sensitivity Harness.
//
//   Corpus → Perturbation → Recompute → ΔMetric
//
// A valid metric must RESPOND to a real change and IGNORE noise. Two failure
// modes the harness catches:
//   • insensitive — barely moves when something relevant changed.
//   • unstable    — jumps disproportionately to a tiny change.
// The sharpest check: a DUPLICATE document carries no new knowledge → every
// metric should move ≈ 0. If it moves, the metric is counting documents, not
// knowledge. We are no longer asking "does the metric look right?" but
// "under what conditions does it break?".

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { assetEntropy } from '../evidence/entropy.mjs';
import { replayTransformations } from '../transformations/transformation.mjs';
import { classifyFrontier, knowledgePhase } from '../frontier/frontier.mjs';
import { buildDecisionPriorities } from '../decision-value/decision-value.mjs';
import { CANDIDATE_EVENTS } from '../events/learning-primitives.mjs';
import { informationPotential } from './information-potential.mjs';

const D = (domain, signal) => ({ domain, signal, note: 'pert' });
const ep = (product, domain, signal) => ({ id: 'P', product, domains: [D(domain, signal)], materials: [] });

/** One snapshot of all corpus-derived metrics. */
function snapshot(episodes) {
  const assets = buildKnowledgeAssets(episodes);
  const a = (n) => assets.find((x) => x.name === n) || { confidence: 0 };
  return {
    entropy: +(assets.reduce((s, x) => s + assetEntropy(x), 0) / assets.length).toFixed(3),
    adhesionConf: a('Adhesion').confidence,
    compressionConf: a('Compression Strength').confidence,
    phase: knowledgePhase(classifyFrontier(assets, replayTransformations(episodes))).phaseIndex,
    topAction: buildDecisionPriorities(episodes, 'customer-returns-cracking')[0].event,
    topIP: informationPotential(CANDIDATE_EVENTS, episodes)[0].event,
  };
}

// ── perturbations (corpus → corpus') ─────────────────────────────────────────
export const PERTURBATIONS = {
  '+measurement (Adhesion)':   { kind: 'signal', f: (e) => [...e, ep('pert', 'Adhesion', 'measured')] },
  '−measurement (Compression)': { kind: 'signal', f: (e) => { const i = e.findIndex((x) => (x.domains || []).some((d) => d.domain === 'Compression Strength' && d.signal === 'measured')); return e.filter((_, j) => j !== i); } },
  'duplicate document (noise)': { kind: 'noise',  f: (e) => [...e, { ...e[0], id: 'DUP' }] },
  'missing episode':           { kind: 'signal', f: (e) => e.slice(1) },
  'wrong inference (adversarial)': { kind: 'adversarial', f: (e) => [...e, ep('pert', 'Adhesion', 'measured')] }, // a false "measured" claim
};

const diff = (b, a) => Object.fromEntries(Object.keys(b).map((k) =>
  [k, typeof b[k] === 'number' ? +(a[k] - b[k]).toFixed(3) : (a[k] === b[k] ? 'same' : `${b[k]}→${a[k]}`)]));

export function sensitivity() {
  const base = snapshot(REAL_EPISODES);
  const results = {};
  for (const [name, p] of Object.entries(PERTURBATIONS)) results[name] = { kind: p.kind, delta: diff(base, snapshot(p.f(REAL_EPISODES))) };
  return { base, results };
}

/** Verdict per perturbation: did the metrics respond appropriately? */
export function verdicts(s = sensitivity()) {
  const out = [];
  for (const [name, r] of Object.entries(s.results)) {
    const moved = Math.abs(r.delta.entropy) >= 0.005 || Math.abs(r.delta.adhesionConf) >= 0.01 || Math.abs(r.delta.compressionConf) >= 0.01;
    let verdict;
    if (r.kind === 'noise') verdict = moved ? 'WEAKNESS — moved on a duplicate (counts documents, not knowledge)' : 'GOOD — ignored the duplicate (noise-robust)';
    else if (r.kind === 'adversarial') verdict = 'GAP — treated a false claim as valid evidence (no content-level contradiction check yet)';
    else verdict = moved ? 'GOOD — responded proportionately to a real change' : 'WEAK — barely moved when something relevant changed';
    out.push({ perturbation: name, kind: r.kind, verdict, delta: r.delta });
  }
  return out;
}
