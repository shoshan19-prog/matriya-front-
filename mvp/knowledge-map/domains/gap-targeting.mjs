// Domain-Gap Targeting — choose the next extraction by GAP, not by product name.
//
// Rule (the new discipline): the next product to reconstruct is the one that
// most strengthens the WEAK/EMPTY domains of the knowledge map — not whichever
// product is next alphabetically. This turns extraction from "collect dossiers"
// into "fill the scientific knowledge map".

import { DOMAIN } from './domains.mjs';

// How badly each domain needs evidence, from its registry status.
// Empty is worst; single-product domains carry a cross-family penalty (a pattern
// must hold across products, so a 2nd source is worth a lot).
const STATUS_GAP = { 'Empty (gap)': 5, Seed: 4, Partial: 3, Growing: 1, Mature: 0 };

export function domainGaps(registry, { allDomains = Object.values(DOMAIN) } = {}) {
  const byName = Object.fromEntries(registry.map((r) => [r.domain, r]));
  return allDomains.map((d) => {
    const r = byName[d];
    const status = r ? r.status : 'Empty (gap)';
    let gap = STATUS_GAP[status] ?? 3;
    if ((r?.products ?? 0) < 2 && status !== 'Empty (gap)') gap += 2; // needs a 2nd product
    return { domain: d, status, products: r?.products ?? 0, episodes: r?.episodes ?? 0, gap };
  }).sort((a, b) => b.gap - a.gap);
}

// The five signals the user defined as worth extracting, mapped to the domains
// each one would strengthen. A candidate that carries a signal fills those gaps.
export const SIGNAL_DOMAINS = {
  COLOR:              [DOMAIN.COLOR],
  COMPRESSION:        [DOMAIN.COMPRESSION],
  WORKABILITY_FAIL:   [DOMAIN.WORKABILITY],
  FIRE:               [DOMAIN.FIRE],
  PRODUCTION_DECISION: [],   // not a domain — a global gate bonus (see scoreCandidate)
};

/**
 * Score a candidate product by how much it would close domain gaps.
 * candidate = { product, signals:{COLOR:true,...}, richness:'rich'|'medium'|'thin'|'none' }
 */
export function scoreCandidate(candidate, gaps) {
  const gapOf = Object.fromEntries(gaps.map((g) => [g.domain, g.gap]));
  const richnessMult = { rich: 1, medium: 0.7, thin: 0.4, none: 0 }[candidate.richness] ?? 0.5;
  const filled = [];
  let score = 0;
  for (const [sigName, on] of Object.entries(candidate.signals || {})) {
    if (!on) continue;
    if (sigName === 'PRODUCTION_DECISION') { score += 3; filled.push('production-decision (gate)'); continue; }
    for (const d of SIGNAL_DOMAINS[sigName] || []) {
      const g = gapOf[d] ?? 3;
      score += g;
      filled.push(`${d} (+${g})`);
    }
  }
  return { product: candidate.product, score: +(score * richnessMult).toFixed(1),
    raw: score, richness: candidate.richness, fills: filled };
}

export function selectNextExtraction(candidates, gaps) {
  return candidates.map((c) => scoreCandidate(c, gaps)).sort((a, b) => b.score - a.score);
}
