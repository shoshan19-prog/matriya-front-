// INNOVATION 1 — REPRESENTATION COVERAGE.
//
// The Representation layer asks "can the system describe this kind of knowledge?".
// Coverage measures it across the whole lab: of every asset the lab produces
// evidence for, how many have a real MODEL (a schema), and which measurement types
// are seen-but-unmodeled — the museum wings that do not exist yet.
//
// This is the metric of how much of REALITY the system can currently represent —
// a number no document store has, because documents have no model to be measured
// against.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { ASSET_SCHEMA } from '../schema/asset-schema.mjs';

// measurement types the lab is known to produce that have NO model yet
export const SEEN_BUT_UNMODELED = [
  { asset: 'Fire Resistance', dimension: 'smokeToxicity', source: 'EN 13501-1 (future)' },
  { asset: 'Weathering / UV', dimension: 'gloss / ΔE over hours', source: 'QUV (future)' },
  { asset: 'Adhesion', dimension: 'pull-off vs substrate / curve', source: 'pull-off rig' },
];

export function representationCoverage() {
  const assets = buildKnowledgeAssets(REAL_EPISODES).filter((a) => a.evidence > 0);
  const rows = assets.map((a) => {
    const model = ASSET_SCHEMA[a.name];
    return { asset: a.name, modeled: !!model,
      dimensions: model ? Object.keys(model.dimensions).length : 0,
      version: model ? model.version : 0 };
  }).sort((x, y) => y.dimensions - x.dimensions);

  const modeled = rows.filter((r) => r.modeled).length;
  const coverage = +(modeled / (rows.length || 1)).toFixed(2);
  return {
    rows, modeled, total: rows.length, coverage,
    unmodeledWings: SEEN_BUT_UNMODELED,
    note: `${modeled}/${rows.length} assets have a representation model (${Math.round(coverage * 100)}%). ` +
      'The rest can hold evidence but not yet a structured model — extend on review, never silently.',
  };
}
