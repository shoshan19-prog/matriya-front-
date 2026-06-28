// Knowledge Transformation Layer (Phase 5.5) — the PHYSICS of knowledge.
//
// A Knowledge Asset alone is a snapshot. MATRIYA is a living system, so each
// asset must carry its dynamics:  State(t0) → Evidence → Transformation → State(t1).
// This layer REPLAYS evidence acquisition in order and records, for every asset,
// how each new piece of evidence CHANGED the knowledge (Δconfidence, Δmeasured,
// new frontier). The real question is not "what do we know" but "how did knowledge
// change when evidence arrived" — which evidence moved the needle, which didn't,
// what the R&D return was, and (Phase 6) which patterns are stable enough to be Laws.

import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';

// the order evidence actually arrived (extraction order)
export const ACQUISITION_ORDER = [
  'טיח תל אביב', 'תרמי', 'INT-TFX', 'MPZ', 'GRANITAL', 'fire-retardant plaster', 'BETONIZE', 'PROTECH A1',
  'raw-material QC',   // ROI-scouted FIRST_MEASUREMENT for Granulometry (retrieved)
  // RETRIEVE scout "more of the good and known" — additional existing measured evidence
  'concrete densifiers', 'field-stone QC', 'F.SILICATO', 'MP-1000 primer', 'CC primer', 'Sloxan/LASUR',
  // Frontier RETRIEVE_AVAILABLE round — Color & Granulometry depth
  'spectro QC', 'Italian/Acryl-Plus',
];

// Innovation 2 — Surprise Index: evidence that changed the model QUALITATIVELY
// (created an asset, introduced the first measurement, or — most telling —
// LOWERED confidence by diluting grounding) carries more learning than evidence
// that merely nudged a number. High surprise = where real revision happened.
function surpriseOf(t) {
  let s = 0;
  if (t.created) s += 0.5;
  if (t.introducedMeasured) s += 0.4;
  if (t.dConf < 0) s += Math.min(1, -t.dConf * 3) + 0.3;   // counter-intuitive drop = revision
  if (t.dConf >= 0.25) s += 0.3;
  return +s.toFixed(2);
}

/** Replay acquisition; emit one transformation per asset that changed at each step. */
export function replayTransformations(episodes, order = ACQUISITION_ORDER) {
  let prev = new Map();
  const transformations = [];
  const seen = [];
  order.forEach((product, step) => {
    seen.push(product);
    const subset = episodes.filter((e) => seen.includes(e.product));
    const assets = buildKnowledgeAssets(subset);
    for (const a of assets) {
      const b = prev.get(a.name);
      const cb = b ? b.confidence : 0;
      const eb = b ? b.evidence : 0;
      if (b && a.evidence === eb) continue;             // unchanged this step
      const t = {
        step, product, asset: a.name,
        conf_before: cb, conf_after: a.confidence, dConf: +(a.confidence - cb).toFixed(2),
        evidence_before: eb, evidence_after: a.evidence,
        dProducts: a.products - (b ? b.products : 0),
        dMeasured: a.measured - (b ? b.measured : 0),
        created: !b,
        introducedMeasured: (b ? b.measured : 0) === 0 && a.measured > 0,
        frontier_after: a.frontier.length,
      };
      t.surprise = surpriseOf(t);
      transformations.push(t);
    }
    prev = new Map(assets.map((a) => [a.name, a]));
  });
  return transformations;
}

// classify a transformation by the KIND of evidence event (used by VoI priors)
export function transformationType(t) {
  if (t.created) return 'opens-asset';
  if (t.introducedMeasured) return 'first-measured';
  if (t.dMeasured > 0) return 'more-measured';
  if (t.dProducts > 0) return 'new-product-qualitative';
  return 'more-of-same';
}

// ── Analyses the layer unlocks ───────────────────────────────────────────────

/** Which evidence raised confidence the most / not at all (redundant R&D). */
export function impactRanking(transformations) {
  const sorted = [...transformations].sort((a, b) => b.dConf - a.dConf);
  return { biggest: sorted.slice(0, 6), redundant: transformations.filter((t) => Math.abs(t.dConf) < 0.01 && !t.created) };
}

/** R&D ROI per product = total knowledge (Σ Δconfidence across assets) it produced. */
export function rdRoi(transformations, order = ACQUISITION_ORDER) {
  return order.map((p) => {
    const ts = transformations.filter((t) => t.product === p);
    return { product: p, dConfTotal: +ts.reduce((s, t) => s + Math.max(0, t.dConf), 0).toFixed(2),
      assetsTouched: new Set(ts.map((t) => t.asset)).size,
      surprises: ts.filter((t) => t.surprise >= 0.5).length };
  }).sort((a, b) => b.dConfTotal - a.dConfTotal);
}

/** Most surprising / revising evidence (Innovation 2). */
export function revisions(transformations) {
  return [...transformations].filter((t) => t.surprise >= 0.5).sort((a, b) => b.surprise - a.surprise);
}

/** Law candidates (Phase 6 bridge): assets whose knowledge has CONVERGED — many
 *  products, decent confidence, last change small → stable enough to state. */
export function lawCandidates(transformations) {
  const byAsset = new Map();
  for (const t of transformations) (byAsset.get(t.asset) || byAsset.set(t.asset, []).get(t.asset)).push(t);
  const out = [];
  for (const [asset, ts] of byAsset) {
    const last = ts[ts.length - 1];
    const productsSeen = Math.max(...ts.map((t) => t.evidence_after && t.dProducts >= 0 ? 0 : 0), 0); // placeholder
    const stable = last.conf_after >= 0.6 && Math.abs(last.dConf) < 0.05 && ts.length >= 3;
    if (stable) out.push({ asset, confidence: last.conf_after, transformations: ts.length,
      reason: 'converged: many evidence steps, confidence stable → knowledge no longer revising' });
  }
  return out;
}
