// INNOVATION 2 — KNOWLEDGE LINEAGE & RETRACTION PROPAGATION.
//
// Because the unit is an Episode (not a PDF), every piece of Knowledge can be
// traced to the episodes that support it — and you can ask the question no
// document store can answer: "if this episode turns out to be wrong, what
// knowledge collapses?". That is retraction propagation: knowledge is only as
// safe as its lineage.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';

// episodes that contribute evidence to an asset (the asset's lineage)
function lineageOf(asset, episodes) {
  return episodes.filter((e) => (e.domains || []).some((d) => d.domain === asset))
    .map((e) => ({ id: e.id, product: e.product,
      signal: (e.domains.find((d) => d.domain === asset) || {}).signal }));
}

export function lineage(assetName) {
  const eps = lineageOf(assetName, REAL_EPISODES);
  const measured = eps.filter((e) => e.signal === 'measured');
  return { asset: assetName, episodes: eps, measuredCount: measured.length,
    // a claim is FRAGILE if a single measured episode carries it
    fragile: measured.length === 1,
    note: measured.length === 1 ? 'load-bearing: one measured episode carries this claim' : `${measured.length} measured episodes support this claim` };
}

/** Retraction propagation: if `episodeId` were retracted, which assets lose a
 *  measured support, and which would become ungrounded (lose their ONLY one)? */
export function whatCollapsesIf(episodeId) {
  const ep = REAL_EPISODES.find((e) => e.id === episodeId);
  if (!ep) return { episodeId, found: false };
  const assets = buildKnowledgeAssets(REAL_EPISODES);
  const touched = (ep.domains || []).map((d) => d.domain);
  const impact = touched.map((dom) => {
    const measuredEps = REAL_EPISODES.filter((e) => (e.domains || []).some((d) => d.domain === dom && d.signal === 'measured'));
    const epIsMeasured = (ep.domains.find((d) => d.domain === dom) || {}).signal === 'measured';
    return { asset: dom, measuredSupport: measuredEps.length,
      effect: epIsMeasured && measuredEps.length === 1 ? 'COLLAPSES (only measured support)' : epIsMeasured ? 'weakens (one of several)' : 'context only' };
  });
  return { episodeId, product: ep.product, found: true, impact };
}

/** The lab's most FRAGILE knowledge — single-episode load-bearing claims. */
export function fragileKnowledge() {
  const assets = buildKnowledgeAssets(REAL_EPISODES).filter((a) => a.evidence > 0);
  return assets.map((a) => lineage(a.name)).filter((l) => l.fragile)
    .map((l) => ({ asset: l.asset, supportedBy: l.episodes.filter((e) => e.signal === 'measured').map((e) => e.id) }));
}
