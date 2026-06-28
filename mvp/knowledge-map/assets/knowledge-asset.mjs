// Knowledge Asset — MATRIYA's PRIMARY unit. Not the product, not the episode,
// not the document: the scientific knowledge itself.
//
//   Raw Sources → Collectors → Normalizer → Identity → Episodes
//        → KNOWLEDGE ASSETS → Domains → Patterns → PROTEUS
//
// A Knowledge Asset rolls up everything known about one scientific property,
// from ALL products/episodes/materials, and separates:
//   • internal evidence  — what we actually have (real corpus numbers)
//   • frontier           — sub-dimensions still missing (honest gaps)
//   • external knowledge  — where evidence could come from (ASTM/suppliers/papers)
// New sources just feed more evidence into the same assets — the core never changes.

import { buildDomainRegistry, buildMaterialIndex } from '../domains/registry.mjs';
import { domainDensity } from '../domains/knowledge-gain.mjs';
import { ASSET_META } from './asset-meta.mjs';

// materials that touch a given domain (their episodes carry that domain)
function materialsForDomain(episodes, domain) {
  const names = new Set();
  for (const ep of episodes)
    if ((ep.domains || []).some((d) => d.domain === domain))
      for (const m of ep.materials || []) names.add(m.name);
  return [...names];
}

// open questions inside the asset = frontier items + episodes left open/empty
function openCount(episodes, domain, frontier) {
  const emptyEpisodes = episodes.filter((ep) =>
    (ep.domains || []).some((d) => d.domain === domain && d.signal === 'empty')).length;
  return frontier.length + emptyEpisodes;
}

/** Build every Knowledge Asset from the real corpus. */
export function buildKnowledgeAssets(episodes) {
  const registry = buildDomainRegistry(episodes);
  const density = Object.fromEntries(domainDensity(registry, episodes).map((d) => [d.domain, d]));

  return registry.map((r) => {
    const meta = ASSET_META[r.domain] || { category: '—', frontier: [], external: [], patterns: [], deadEnds: 0 };
    const dens = density[r.domain] || { measured: 0, confidence: 0 };
    const materials = materialsForDomain(episodes, r.domain);
    const confidence = dens.confidence;
    // Expected acquisition gain: how much a new piece of evidence would help.
    // High when the asset is incomplete (low confidence) and has open frontier.
    const incompleteness = (1 - confidence);
    const frontierPull = Math.min(meta.frontier.length / 5, 1);
    const expectedGain = +(0.6 * incompleteness + 0.4 * frontierPull).toFixed(2);
    return {
      name: r.domain,
      category: meta.category,
      evidence: r.evidence,
      measured: dens.measured,
      products: r.products,
      episodes: r.episodes,
      materials,
      confidence,
      knowledgeDensity: confidence,
      patterns: meta.patterns,
      deadEnds: meta.deadEnds,
      openQuestions: openCount(episodes, r.domain, meta.frontier),
      frontier: meta.frontier,               // what's missing INSIDE the asset
      externalKnowledge: meta.external,      // where to acquire it
      expectedGain,
      status: r.status,
    };
  }).sort((a, b) => b.evidence - a.evidence);
}

// ── Router: not "where is a document?" but "which Knowledge Asset is incomplete?"
export function assetGaps(asset) {
  return { asset: asset.name, confidence: asset.confidence,
    missing: asset.frontier, lookIn: asset.externalKnowledge };
}

// ── PROTEUS: "Next Knowledge Asset", not "Next Product". Ranks acquisition targets.
export function nextKnowledgeAsset(assets) {
  return assets
    .map((a) => ({ asset: a.name, need: a.frontier[0] || '(asset complete)',
      expectedGain: a.expectedGain, confidence: a.confidence,
      lookIn: a.externalKnowledge.slice(0, 3) }))
    .sort((x, y) => y.expectedGain - x.expectedGain);
}

export function renderAssetCard(a) {
  const L = [];
  L.push(`Knowledge Asset`);
  L.push(`────────────────────────────`);
  L.push(`Name:            ${a.name}`);
  L.push(`Category:        ${a.category}`);
  L.push(`Evidence:        ${a.evidence}   (measured ${a.measured})`);
  L.push(`Products:        ${a.products}`);
  L.push(`Episodes:        ${a.episodes}`);
  L.push(`Materials:       ${a.materials.slice(0, 6).join(', ')}${a.materials.length > 6 ? ', …' : ''}`);
  L.push(`Confidence:      ${a.confidence.toFixed(2)}`);
  L.push(`Knowledge Density: ${a.knowledgeDensity.toFixed(2)}`);
  L.push(`Patterns:        ${a.patterns.join(', ') || '—'}`);
  L.push(`Dead Ends:       ${a.deadEnds}`);
  L.push(`Open Questions:  ${a.openQuestions}`);
  L.push(`Expected Gain:   ${a.expectedGain}`);
  L.push(`Frontier (missing): ${a.frontier.join(' · ') || '—'}`);
  L.push(`External Knowledge: ${a.externalKnowledge.join(', ')}`);
  return L.join('\n');
}
