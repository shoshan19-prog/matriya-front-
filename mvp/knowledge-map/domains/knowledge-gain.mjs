// Knowledge Acquisition Optimization — PROTEUS's real objective function.
//
// PROTEUS stops choosing "which product to extract" and starts choosing "which
// action increases Fresco's scientific knowledge the most". Three new measures:
//   • Knowledge Density  — how well-grounded a domain already is (not just "does it exist").
//   • Knowledge Gain     — the REAL contribution one extraction made (after the fact).
//   • Expected Gain      — the predicted contribution of a candidate (before extraction).
// PROTEUS ranks candidates by Expected Gain, extracts the best, recomputes — a loop.
// Innovation here: Knowledge ROI (gain per effort) + SATURATION detection (when to stop).

import { DOMAIN } from './domains.mjs';
import { buildDomainRegistry, buildMaterialIndex } from './registry.mjs';

// ── Knowledge Density — how grounded a domain is ────────────────────────────
export function domainDensity(registry, episodes) {
  const measuredByDomain = new Map();
  for (const ep of episodes) for (const d of ep.domains || [])
    if (d.signal === 'measured') measuredByDomain.set(d.domain, (measuredByDomain.get(d.domain) || 0) + 1);

  return registry.map((r) => {
    const measured = measuredByDomain.get(r.domain) || 0;
    const measuredRatio = r.episodes ? measured / r.episodes : 0;
    const productCov = Math.min(r.products / 3, 1);   // cross-family target = 3
    const volume = Math.min(r.episodes / 8, 1);
    const confidence = +(0.5 * measuredRatio + 0.3 * productCov + 0.2 * volume).toFixed(2);
    return { domain: r.domain, evidence: r.evidence, products: r.products, episodes: r.episodes,
      measured, confidence, status: r.status };
  }).sort((a, b) => b.confidence - a.confidence);
}

// ── Knowledge Gain rules (the new KPI) ──────────────────────────────────────
export const GAIN = {
  NEW_DOMAIN: 10,       // opens a domain that was empty
  SECOND_PRODUCT: 6,    // adds a 2nd product to a single-product domain
  MEASURED: 5,          // adds measured data to a domain
  NEW_FAMILY: 4,        // a whole new product family (broad leverage)
  PRODUCTION_DECISION: 3,
  EPISODE: 2,           // per new decision cycle
  NEW_MATERIAL: 2,      // per new material added to the cross-product history
  SAME_DOCS: 0,         // just more documents of a kind we already have
};

const EST_EPISODES = { rich: 5, medium: 3, thin: 1, none: 0 };

// signal name -> the domain it contributes to
const SIGNAL_DOMAIN = { COLOR: DOMAIN.COLOR, COMPRESSION: DOMAIN.COMPRESSION,
  WORKABILITY_FAIL: DOMAIN.WORKABILITY, FIRE: DOMAIN.FIRE };

/**
 * Expected Knowledge Gain for a candidate, given the CURRENT registry.
 * candidate = { product, family, knownFamily(bool), signals:{COLOR:'measured'|...},
 *               richness, newMaterials:int }
 */
export function expectedGain(candidate, registry) {
  const byDomain = Object.fromEntries(registry.map((r) => [r.domain, r]));
  const breakdown = [];
  let gain = 0;
  const add = (n, why) => { if (n) { gain += n; breakdown.push(`+${n} ${why}`); } };

  if (candidate.knownFamily === false) add(GAIN.NEW_FAMILY, 'new family');

  for (const [sigName, val] of Object.entries(candidate.signals || {})) {
    if (!val) continue;
    if (sigName === 'PRODUCTION_DECISION') { add(GAIN.PRODUCTION_DECISION, 'production decision'); continue; }
    const dom = SIGNAL_DOMAIN[sigName]; if (!dom) continue;
    const r = byDomain[dom];
    const products = r ? r.products : 0;
    if (products === 0) add(GAIN.NEW_DOMAIN, `opens ${dom}`);
    else if (products < 2) add(GAIN.SECOND_PRODUCT, `2nd product to ${dom}`);
    if (val === 'measured') add(GAIN.MEASURED, `measured ${dom}`);
  }

  const est = EST_EPISODES[candidate.richness] ?? 2;
  add(est * GAIN.EPISODE, `${est} new episodes`);
  add(Math.min(candidate.newMaterials || 0, 4) * GAIN.NEW_MATERIAL, `${Math.min(candidate.newMaterials || 0, 4)} new materials`);

  return { product: candidate.product, expectedGain: gain, breakdown,
    effort: { rich: 3, medium: 2, thin: 1, none: 1 }[candidate.richness] ?? 2,
    roi: +(gain / (({ rich: 3, medium: 2, thin: 1, none: 1 }[candidate.richness]) ?? 2)).toFixed(1) };
}

export function rankByExpectedGain(candidates, registry) {
  return candidates.map((c) => expectedGain(c, registry)).sort((a, b) => b.expectedGain - a.expectedGain);
}

// ── Governance: PROTEUS recommends; a human approves every new Intake. ───────
// Extraction changes the corpus and touches proprietary/sensitive sources
// (Drive, SharePoint, email, Priority). So the loop is:
//   recalc → RECOMMEND → human approve → extract → recalc
// NOT recalc → extract → recalc. PROTEUS may rank and recommend automatically;
// it may NOT auto-extract a new source.
export const GOVERNANCE = 'PROTEUS may rank and recommend automatically. PROTEUS may not extract a new source without human approval.';

// ── Innovation: saturation — when does recommending another extraction stop? ──
// If even the best candidate's expected gain falls below SATURATION_GAIN, the
// marginal scientific value is low → recommend STOP / switch focus.
export const SATURATION_GAIN = 8;

/** Produce a RECOMMENDATION (never an action). Human approval is always required. */
export function recommendNext(ranked) {
  const best = ranked[0];
  if (!best) return { action: 'STOP', approvalRequired: false, reason: 'no candidates left', governance: GOVERNANCE };
  if (best.expectedGain < SATURATION_GAIN)
    return { action: 'STOP', approvalRequired: false, best,
      reason: `best expected gain ${best.expectedGain} < saturation ${SATURATION_GAIN} → diminishing returns; recommend pausing extraction`,
      governance: GOVERNANCE };
  return { action: 'RECOMMEND', approvalRequired: true, best,
    reason: `recommend extracting ${best.product} (expected gain ${best.expectedGain}, ROI ${best.roi}) — PENDING HUMAN APPROVAL`,
    governance: GOVERNANCE };
}

// Back-compat alias (now governance-aware): never returns "extract", only recommends.
export const acquisitionVerdict = recommendNext;

// convenience: build registry+density from episodes in one call
export function knowledgeState(episodes) {
  const registry = buildDomainRegistry(episodes);
  return { registry, density: domainDensity(registry, episodes), materials: buildMaterialIndex(episodes) };
}
