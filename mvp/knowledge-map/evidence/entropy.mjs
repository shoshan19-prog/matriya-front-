// Knowledge Entropy — measure how ORDERED the knowledge is, not how much.
//
// Everyone counts how much information exists. MATRIYA measures how much of it is
// in order. Two projects with 500 events each: one is connected, few
// contradictions, questions closed (entropy 0.18); the other is disconnected,
// many unknowns and unverified claims (entropy 0.81). The system can then say not
// "we lack information" but "we lack order" — and the real goal of MATRIYA may be
// to REDUCE the entropy of knowledge.
//
// Plus three out-of-the-box additions:
//   • Silence (negative evidence)  — absence of expected evidence is information.
//   • Evidence half-life (staleness) — knowledge decays; entropy rises with age.
//   • Entropy gradient             — which action reduces entropy most per effort.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { CANDIDATE_EVENTS } from '../events/learning-primitives.mjs';

// documented contradictions per asset (from the reconstructions — preserved, not smoothed)
const CONTRA = { 'Compression Strength': 2, 'Workability / Flow': 2, 'Fire Resistance': 1, 'Adhesion': 1 };

/** Entropy of one asset (0 ordered … 1 chaotic). */
export function assetEntropy(a, contradictions = CONTRA[a.name] || 0) {
  const unanswered = 1 - a.confidence;                       // distance from grounded
  const contra = Math.min(1, contradictions / 3);            // conflicting evidence
  const unverified = a.episodes ? 1 - a.measured / a.episodes : 1; // qualitative share
  const disconnection = a.products < 2 ? 0.5 : 0;            // isolated knowledge
  return +(0.4 * unanswered + 0.2 * contra + 0.3 * unverified + 0.1 * disconnection).toFixed(2);
}

/** Entropy of a project / group of products. */
export function groupEntropy(episodes) {
  const assets = buildKnowledgeAssets(episodes).filter((a) => a.evidence > 0);
  if (!assets.length) return { entropy: 1, assets: 0 };
  const H = assets.reduce((s, a) => s + assetEntropy(a), 0) / assets.length;
  return { entropy: +H.toFixed(2), assets: assets.length };
}

// ── Idea A — Silence (negative evidence): expected-but-absent observations ───
export function silence(episodes = REAL_EPISODES) {
  const assets = buildKnowledgeAssets(episodes);
  const absent = episodes.flatMap((e) => (e.domains || []).filter((d) => d.signal === 'empty')).length;
  const perAsset = assets.map((a) => ({ asset: a.name,
    // a frontier with 0 measured = expected measurement that is silent
    silent: a.measured === 0 ? a.openQuestions : Math.max(0, a.openQuestions - a.measured) }))
    .filter((x) => x.silent > 0).sort((x, y) => y.silent - x.silent);
  return { totalAbsentRecords: absent, loudestSilence: perAsset.slice(0, 4),
    note: 'absence of expected evidence is information — the "dark matter" that keeps entropy high' };
}

// ── Idea B — Evidence half-life: knowledge decays; entropy rises with age ────
export function staleness(atomsTsMax = 50) {
  // age proxy = acquisition order index; newer products carry fresher evidence.
  const order = ['טיח תל אביב', 'תרמי', 'INT-TFX', 'MPZ', 'GRANITAL', 'fire-retardant plaster', 'BETONIZE', 'PROTECH A1', 'raw-material QC', 'concrete densifiers', 'F.SILICATO', 'spectro QC'];
  const ageOf = (p) => 1 - (order.indexOf(p) + 1) / order.length; // 0 fresh … 1 old
  const assets = buildKnowledgeAssets(REAL_EPISODES);
  const stale = assets.map((a) => {
    const prods = new Set(REAL_EPISODES.filter((e) => (e.domains || []).some((d) => d.domain === a.name)).map((e) => e.product));
    const youngest = Math.min(...[...prods].map(ageOf));      // freshest contributing product
    return { asset: a.name, freshness: +(1 - youngest).toFixed(2), staleEntropy: +(youngest * 0.5).toFixed(2) };
  }).sort((x, y) => x.freshness - y.freshness);
  return { stalest: stale.slice(0, 4),
    note: 'a 2018 viscosity reading on a since-changed formula is weaker evidence than a fresh one — knowledge decays; entropy rises unless refreshed' };
}

// ── Idea C — Entropy gradient: which action reduces entropy most per effort ──
export function entropyGradient(candidates = CANDIDATE_EVENTS) {
  const assets = Object.fromEntries(buildKnowledgeAssets(REAL_EPISODES).map((a) => [a.name, a]));
  return candidates.map((c) => {
    const a = assets[c.name && assets[c.name] ? c.name : c.asset] || assets[c.asset];
    if (!a) return null;
    const before = assetEntropy(a);
    // counterfactual: one measured observation → recompute that asset's entropy
    const after = buildKnowledgeAssets([...REAL_EPISODES, { id: 'G', product: '(sim)', domains: [{ domain: c.asset, signal: 'measured', note: 'sim' }], materials: [] }])
      .find((x) => x.name === c.asset);
    const dH = +(before - assetEntropy(after)).toFixed(2);     // entropy reduced
    return { event: c.name, asset: c.asset, entropyBefore: before, dEntropy: dH,
      gradient: +(dH / ((c.costILS || 1000) / 1000)).toFixed(3) }; // ΔH per ₪1,000
  }).filter(Boolean).sort((x, y) => y.gradient - x.gradient);
}
