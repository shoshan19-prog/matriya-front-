// Knowledge Domain Registry — aggregates EVIDENCE by domain, across products.
//
// Input: episodes, each carrying domain evidence tags (from the real product
// reconstructions). Output: a registry where each DOMAIN reports how much
// evidence exists, from how many products / episodes, and how mature it is —
// plus a cross-product MATERIAL history. No invented numbers: counts are exactly
// what the episodes carry.

// signal strength of one piece of domain evidence
const WEIGHT = { measured: 2, qualitative: 1, empty: 0 }; // 'empty' = known-relevant but never recorded

function statusOf(products, episodes) {
  if (episodes === 0) return 'Empty (gap)';
  if (products >= 3 && episodes >= 8) return 'Mature';
  if (products >= 2 && episodes >= 4) return 'Growing';
  if (episodes >= 2) return 'Partial';
  return 'Seed';
}

/** Build the Domain Registry from episodes with `.domains = [{domain, signal, note}]`. */
export function buildDomainRegistry(episodes) {
  const dom = new Map();
  for (const ep of episodes) {
    for (const d of ep.domains || []) {
      const r = dom.get(d.domain) || { domain: d.domain, evidence: 0, gaps: 0,
        products: new Set(), episodes: new Set(), byProduct: new Map(), items: [] };
      r.evidence += WEIGHT[d.signal] ?? 0;
      if (d.signal === 'empty') r.gaps += 1; else { r.products.add(ep.product); r.episodes.add(ep.id); }
      const bp = r.byProduct.get(ep.product) || { product: ep.product, evidence: 0, episodes: 0, measured: false };
      bp.evidence += WEIGHT[d.signal] ?? 0; bp.episodes += 1; bp.measured ||= d.signal === 'measured';
      r.byProduct.set(ep.product, bp);
      r.items.push({ product: ep.product, episode: ep.id, signal: d.signal, note: d.note });
      dom.set(d.domain, r);
    }
  }
  return [...dom.values()].map((r) => ({
    domain: r.domain, evidence: r.evidence, gaps: r.gaps,
    products: r.products.size, episodes: r.episodes.size,
    status: statusOf(r.products.size, r.episodes.size),
    byProduct: [...r.byProduct.values()].sort((a, b) => b.evidence - a.evidence),
    items: r.items,
  })).sort((a, b) => b.evidence - a.evidence);
}

/** "What do we really know about <domain>?" — evidence bars per product. */
export function domainEvidence(registry, domain) {
  const r = registry.find((x) => x.domain === domain);
  if (!r) return null;
  const max = Math.max(1, ...r.byProduct.map((p) => p.evidence));
  return {
    domain, status: r.status, evidence: r.evidence, gaps: r.gaps,
    bars: r.byProduct.map((p) => ({
      product: p.product, evidence: p.evidence, measured: p.measured,
      bar: '█'.repeat(Math.round((p.evidence / max) * 10)) || '·',
    })),
  };
}

/** Material history — trace ONE raw material across every product/episode. */
export function buildMaterialIndex(episodes) {
  const mats = new Map();
  for (const ep of episodes) for (const m of ep.materials || []) {
    const r = mats.get(m.name) || { name: m.name, products: new Set(), episodes: [], pos: 0, neg: 0 };
    r.products.add(ep.product); r.episodes.push({ product: ep.product, episode: ep.id, effect: m.effect, note: m.note });
    if (m.effect === 'positive') r.pos++; if (m.effect === 'negative') r.neg++;
    mats.set(m.name, r);
  }
  return [...mats.values()].map((r) => ({
    name: r.name, products: r.products.size, appearances: r.episodes.length,
    positive: r.pos, negative: r.neg, episodes: r.episodes,
  })).sort((a, b) => b.appearances - a.appearances);
}

export function materialHistory(index, name) {
  return index.find((m) => m.name.toLowerCase() === name.toLowerCase()) || null;
}
