// HYPOTHESIS METRIC 2 — Knowledge Phase Transition.
//
// Don't treat entropy decline as continuous — look for JUMPS. A drop from
// 0.78→0.41 in one step is not another measurement; it may be a phase transition:
// many questions closed, a central contradiction resolved, a new model formed —
// "the moment the lab understood". If it recurs across projects, that moment is
// detectable.
//
// ⚠ HYPOTHESIS under test, not a law.

import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { assetEntropy } from '../evidence/entropy.mjs';

/** Cumulative knowledge entropy after each acquisition step (a trajectory). */
export function entropyTrajectory(orderedEpisodes) {
  const series = [];
  for (let i = 1; i <= orderedEpisodes.length; i++) {
    const sub = orderedEpisodes.slice(0, i);
    const assets = buildKnowledgeAssets(sub).filter((a) => a.evidence > 0);
    const H = assets.length ? +(assets.reduce((s, a) => s + assetEntropy(a), 0) / assets.length).toFixed(3) : 1;
    series.push({ step: i, after: orderedEpisodes[i - 1].id || orderedEpisodes[i - 1].product, entropy: H });
  }
  return series;
}

/** Detect a phase transition: a downward step much larger than the typical step. */
export function detectPhaseTransition(series) {
  const drops = [];
  for (let i = 1; i < series.length; i++) drops.push({ at: series[i].after, step: i, delta: +(series[i].entropy - series[i - 1].entropy).toFixed(3) });
  const downs = drops.filter((d) => d.delta < 0).map((d) => -d.delta);
  if (!downs.length) return { transition: null, drops, note: 'no entropy drop observed' };
  const mean = downs.reduce((a, b) => a + b, 0) / downs.length;
  const sd = Math.sqrt(downs.reduce((a, b) => a + (b - mean) ** 2, 0) / downs.length) || 1e-9;
  const biggest = drops.filter((d) => d.delta < 0).sort((a, b) => a.delta - b.delta)[0];
  const z = (-biggest.delta - mean) / sd;
  return {
    transition: z >= 1.5 ? biggest : null,
    biggest, meanDrop: +mean.toFixed(3), z: +z.toFixed(2), drops,
    note: z >= 1.5 ? `phase transition at "${biggest.at}" (drop ${biggest.delta}, ${z.toFixed(1)}σ above typical)`
      : 'entropy declines smoothly — no jump (this corpus)',
  };
}
