// INNOVATION A — Dead-End Memory (negative-knowledge index).
//
// The most valuable, most-forgotten knowledge in any lab is what was already
// TRIED and FAILED, and WHY. This indexes every rejected episode by its
// hypothesis + failure reason, so PROTEUS can warn "we tried that — it failed
// because …" BEFORE recommending it again. Prevents repeating dead ends, the #1
// silent waste in R&D.

export function buildDeadEndIndex(episodes) {
  return episodes
    .filter((e) => e.decision.outcome === 'rejected')
    .map((e) => ({
      episode_id: e.episode_id,
      product: e.product,
      tried: e.hypothesis || '(hypothesis not recorded)',
      failed_because: e.decision.reason || '(reason not recorded)',
      measured: e.results.map((r) => `${r.value}${r.unit}`),
      confidence: e.decision.confidence,
    }));
}

/** "Have we tried this before?" — match a proposed idea against past failures. */
export function checkDeadEnd(index, ideaText) {
  const t = (ideaText || '').toLowerCase();
  const hits = index.filter((d) => (d.tried || '').toLowerCase().split(/\s+/).some((w) => w.length > 2 && t.includes(w)));
  return { proposed: ideaText, warning: hits.length > 0, prior_failures: hits };
}
