// INNOVATION B — Causal Threads (knowledge lineage across episodes).
//
// Episodes are not isolated: episode N's "Next Action" becomes episode N+1's
// "Hypothesis". Linking them yields a reasoning TRAJECTORY over time — the story
// of how a formula evolved. PROTEUS can then traverse "the decision lineage that
// led to the current production render", instead of staring at isolated files.

const kw = (s) => new Set((s || '').toLowerCase().match(/[a-z֐-׿]{3,}/g) || []);
const overlap = (a, b) => { const A = kw(a), B = kw(b); let n = 0; for (const w of A) if (B.has(w)) n++; return n; };

/** Link episode -> successor when next_action ~ successor.hypothesis, or version succeeds (v043->v044). */
export function buildThreads(episodes, { minOverlap = 1 } = {}) {
  const edges = [];
  for (const a of episodes) for (const b of episodes) {
    if (a === b) continue;
    const sem = a.next_action && b.hypothesis ? overlap(a.next_action, b.hypothesis) : 0;
    const va = +(a.anchor.version || '').replace(/\D/g, ''), vb = +(b.anchor.version || '').replace(/\D/g, '');
    const versionSucc = va && vb && vb === va + 1 && a.product && a.product === b.product;
    if (sem >= minOverlap || versionSucc) edges.push({ from: a.episode_id, to: b.episode_id, via: versionSucc ? `version ${a.anchor.version}→${b.anchor.version}` : `next_action→hypothesis (overlap ${sem})` });
  }
  // assemble linear threads (chains) from edges
  const next = Object.fromEntries(edges.map((e) => [e.from, e.to]));
  const hasParent = new Set(edges.map((e) => e.to));
  const threads = [];
  for (const e of episodes) if (!hasParent.has(e.episode_id) && next[e.episode_id]) {
    const chain = [e.episode_id]; let cur = e.episode_id; const seen = new Set(chain);
    while (next[cur] && !seen.has(next[cur])) { cur = next[cur]; chain.push(cur); seen.add(cur); }
    if (chain.length > 1) threads.push(chain);
  }
  return { edges, threads };
}
