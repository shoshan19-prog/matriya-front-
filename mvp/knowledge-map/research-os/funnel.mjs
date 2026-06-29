// KNOWLEDGE RESOLUTION — the research funnel. Not "how much knowledge", but "at
// what STAGE is it resolved?". Every unit travels the same pipeline, and we
// measure where the mass sits and how it converts between stages:
//
//   Reality → Evidence → Episode → Knowledge → Decision → Validated Principle
//
// This is what makes MATRIYA a research operating system rather than a store:
// you can ask not just "what do we know" but "what is still unresolved, and
// where exactly is it stuck".

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { FIRE_EPISODES_PENDING } from '../schema/fire-episodes.mjs';

export const STAGES = ['Evidence', 'Episode', 'Knowledge', 'Decision', 'Validated Principle'];

// where has an ASSET resolved to?
function stageOf(a) {
  if (a.confidence >= 0.6 && (a.patterns || []).length) return 'Decision';
  if (a.confidence >= 0.5) return 'Knowledge';
  if (a.episodes > 0) return 'Episode';
  return 'Evidence';
}

export function knowledgeResolution() {
  const assets = buildKnowledgeAssets(REAL_EPISODES).filter((a) => a.evidence > 0);
  const counts = Object.fromEntries(STAGES.map((s) => [s, 0]));
  for (const a of assets) counts[stageOf(a)]++;
  // no asset has been promoted to a Law — kept honest (the discipline that holds).
  counts['Validated Principle'] = 0;

  const funnel = STAGES.map((s) => ({ stage: s, count: counts[s] }));
  // resolution index: weighted mean position (0 = all raw, 1 = all validated)
  const total = assets.length || 1;
  const idx = +(STAGES.reduce((sum, s, i) => sum + counts[s] * (i / (STAGES.length - 1)), 0) / total).toFixed(2);

  // the LATEST batch — the Drive fire episodes — tracked separately and honestly:
  // they entered, sit at Representation/Review, and have resolved to NOTHING yet.
  const batch = {
    name: 'Drive fire tests (INT-TFX)',
    entered: FIRE_EPISODES_PENDING.filter((e) => e.origin === 'fresco').length,
    atStage: 'Representation → Human Review (PENDING)',
    becameKnowledge: 0, changedDecision: 0, changedLaw: 0,
  };

  return {
    funnel, resolutionIndex: idx, assets: total, batch,
    note: 'resolution measures WHERE knowledge sits in the research funnel, not how much exists',
  };
}
