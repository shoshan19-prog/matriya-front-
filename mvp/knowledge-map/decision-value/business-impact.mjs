// Business Impact — the bridge from knowledge to the business.
//
// An organization does not exist to acquire knowledge; it exists to improve
// products, quality, development time, cost, and customers. So an event that
// adds a lot of knowledge (high ΔK) may carry little business value, and vice
// versa. Business Impact is a VECTOR over what a company actually cares about,
// scored against the company's CURRENT objective (configurable — "this year's
// pain"). Profiles are domain-meaning based; the objective is a business input.

import { DOMAIN } from '../domains/domains.mjs';

export const BIZ_DIM = ['Production', 'Quality', 'Sales', 'Regulation', 'Customer', 'Strategic'];

// How each asset bears on each business dimension (0..1) — from its domain meaning.
export const ASSET_BUSINESS = {
  [DOMAIN.ADHESION]:    { Production: 0.4, Quality: 0.9, Sales: 0.3, Regulation: 0.3, Customer: 0.9, Strategic: 0.3 }, // cracking/peeling = returns
  [DOMAIN.COMPRESSION]: { Production: 0.7, Quality: 0.6, Sales: 0.2, Regulation: 0.8, Customer: 0.4, Strategic: 0.4 }, // structural / spec
  [DOMAIN.COLOR]:       { Production: 0.3, Quality: 0.5, Sales: 0.9, Regulation: 0.1, Customer: 0.7, Strategic: 0.3 }, // shelf appeal / match
  [DOMAIN.FIRE]:        { Production: 0.3, Quality: 0.5, Sales: 0.3, Regulation: 0.95, Customer: 0.5, Strategic: 0.7 }, // certification / safety
  [DOMAIN.WATER]:       { Production: 0.4, Quality: 0.5, Sales: 0.3, Regulation: 0.4, Customer: 0.4, Strategic: 0.4 },
  [DOMAIN.WORKABILITY]: { Production: 0.8, Quality: 0.5, Sales: 0.2, Regulation: 0.1, Customer: 0.4, Strategic: 0.3 }, // applicator experience
  [DOMAIN.SETCURE]:     { Production: 0.7, Quality: 0.5, Sales: 0.1, Regulation: 0.2, Customer: 0.3, Strategic: 0.3 },
  [DOMAIN.GRANULOMETRY]:{ Production: 0.5, Quality: 0.5, Sales: 0.1, Regulation: 0.2, Customer: 0.2, Strategic: 0.2 },
  [DOMAIN.DENSITY]:     { Production: 0.4, Quality: 0.3, Sales: 0.1, Regulation: 0.2, Customer: 0.2, Strategic: 0.2 },
};

// Company objective presets — the CURRENT strategic focus (weights sum ~1).
export const BUSINESS_OBJECTIVES = {
  'customer-returns-cracking': { Quality: 0.35, Customer: 0.35, Production: 0.15, Regulation: 0.10, Sales: 0.05, Strategic: 0.00 },
  'regulatory-certification':  { Regulation: 0.45, Strategic: 0.20, Quality: 0.15, Customer: 0.10, Production: 0.10, Sales: 0.00 },
  'win-new-sales':             { Sales: 0.40, Customer: 0.25, Quality: 0.15, Strategic: 0.15, Production: 0.05, Regulation: 0.00 },
};

/** Business Impact of an asset under an objective (0..1), normalized to the best asset. */
export function businessImpact(assetName, objectiveWeights) {
  const prof = ASSET_BUSINESS[assetName];
  if (!prof) return 0;
  return BIZ_DIM.reduce((s, d) => s + (prof[d] || 0) * (objectiveWeights[d] || 0), 0);
}

/** Normalize impacts so the top asset = 1.0 (for comparability with ΔK/demand). */
export function businessImpactMap(assetNames, objectiveWeights) {
  const raw = Object.fromEntries(assetNames.map((n) => [n, businessImpact(n, objectiveWeights)]));
  const max = Math.max(1e-9, ...Object.values(raw));
  return Object.fromEntries(Object.entries(raw).map(([n, v]) => [n, +(v / max).toFixed(2)]));
}
