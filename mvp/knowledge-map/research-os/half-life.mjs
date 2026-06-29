// INNOVATION 3 — KNOWLEDGE HALF-LIFE.
//
// Knowledge decays. A 2018 reading on a since-reformulated product is weaker
// evidence than a fresh one; a result under a now-superseded standard expires when
// the official standard supersedes it. Because the unit is an Episode (with a date
// and a standard), MATRIYA can measure this — and flag knowledge that is aging or
// resting on an informal/superseded standard.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';

// acquisition order = age proxy (older products contribute older evidence)
const ORDER = ['טיח תל אביב', 'תרמי', 'INT-TFX', 'MPZ', 'GRANITAL', 'fire-retardant plaster',
  'BETONIZE', 'PROTECH A1', 'raw-material QC', 'concrete densifiers', 'F.SILICATO', 'spectro QC'];
const ageOf = (p) => { const i = ORDER.indexOf(p); return i < 0 ? 1 : 1 - (i + 1) / ORDER.length; }; // 0 fresh … 1 old

// standards that supersede an informal one → knowledge under the old one has a half-life
export const STANDARD_SUPERSESSION = [
  { asset: 'Fire Resistance', resting: 'DIN 4102-8 (intermediate)', supersededBy: 'EN 13381-8:2013 (official large-scale)',
    risk: 'the Drive fire knowledge expires as "validated" until the official EN 13381-8 report exists' },
];

export function knowledgeHalfLife() {
  const assets = buildKnowledgeAssets(REAL_EPISODES).filter((a) => a.evidence > 0);
  const rows = assets.map((a) => {
    const prods = [...new Set(REAL_EPISODES.filter((e) => (e.domains || []).some((d) => d.domain === a.name)).map((e) => e.product))];
    const youngest = Math.min(...prods.map(ageOf));   // freshest contributing product
    return { asset: a.name, freshness: +(1 - youngest).toFixed(2),
      status: youngest > 0.6 ? 'AGING' : youngest > 0.3 ? 'maturing' : 'fresh' };
  }).sort((x, y) => x.freshness - y.freshness);

  return { rows, aging: rows.filter((r) => r.status === 'AGING').map((r) => r.asset),
    standardRisks: STANDARD_SUPERSESSION,
    note: 'knowledge resting on old episodes or superseded standards has a half-life — refresh before relying on it' };
}
