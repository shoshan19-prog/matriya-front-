// PROTEUS "Where should I look?" router + Knowledge Flow.
//
// Old PROTEUS: "I'm missing information." (dead end)
// New PROTEUS: "Here is where the answer is MOST LIKELY to be found, ranked by
// how reliable each source type is FOR THIS KIND of knowledge — and which
// sources don't even exist in our corpus, so don't bother."
//
// Also models Knowledge Flow: sources do NOT flow into a graph; they flow into
// EPISODES. Each episode field is fed by the source types that hold that kind
// of knowledge, ranked by trust.

import { KTYPE } from './sources.mjs';

// Knowledge Flow: which knowledge type feeds which Episode field.
export const EPISODE_FLOW = {
  question:    [KTYPE.DECISION, KTYPE.HYPOTHESIS],
  hypothesis:  [KTYPE.HYPOTHESIS, KTYPE.REASON],
  experiment:  [KTYPE.INPUT, KTYPE.BATCH],
  results:     [KTYPE.MEASUREMENT, KTYPE.VISUAL],
  decision:    [KTYPE.DECISION],
  why:         [KTYPE.REASON],
  dead_end:    [KTYPE.DEAD_END],
};

/**
 * Given a missing piece of knowledge, tell the engineer where to look.
 * Returns a ranked, presence-aware recommendation — never just "missing".
 */
export function whereToLook(engine, ktype, { presence = {} } = {}) {
  const ranked = engine.rank(ktype, { presence });
  const reachable = ranked.filter((r) => r.presence !== 'absent');
  const absent = ranked.filter((r) => r.presence === 'absent');
  const best = reachable[0] || null;

  const notes = [];
  if (best && !best.calibrated)
    notes.push(`top source "${best.label}" is UNCALIBRATED (only ${best.observed} obs) — trust is still the expert prior, treat as a guess`);
  const empty = ranked.filter((r) => r.presence === 'empty');
  for (const e of empty)
    notes.push(`"${e.label}" is the natural home for this but the field is EMPTY in our corpus — the data was never recorded, not just misfiled`);
  if (absent.length)
    notes.push(`not available in corpus: ${absent.map((a) => a.label).join(', ')} — adding these sources would unlock this knowledge type`);

  return {
    missing: ktype,
    recommendation: reachable.map((r, i) => ({
      rank: i + 1, source: r.label, trust: r.score, stars: '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars),
      presence: r.presence, calibrated: r.calibrated,
    })),
    best_bet: best ? best.label : null,
    notes,
  };
}

/**
 * Complementary sources: to reconstruct a full target (e.g. a product story),
 * which source types TOGETHER cover the needed knowledge types, and what stays
 * unreachable given presence. This is "which sources complete each other".
 */
export function coverTarget(engine, ktypes, { presence = {} } = {}) {
  const plan = ktypes.map((k) => {
    const r = engine.rank(k, { presence }).filter((x) => x.presence !== 'absent');
    return { ktype: k, source: r[0]?.label || null, reachable: !!r[0] && r[0].presence !== 'empty', via: r[0] };
  });
  return {
    plan,
    covered: plan.filter((p) => p.reachable).map((p) => p.ktype),
    gaps: plan.filter((p) => !p.reachable).map((p) => p.ktype),
  };
}
