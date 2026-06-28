// Learning Pattern Engine — META-learning over Episodes.
//
// It does NOT ask "what happened?". It asks "how does Fresco usually produce
// good knowledge?" — mining recurring PROCESS patterns across many decision
// cycles. Crucially, it is honest about evidence: a pattern is only a PATTERN
// when its support is high enough; below that it is an explicit HYPOTHESIS, not
// a finding. No assumptions are laundered into insights.

const MIN_SUPPORT = 4;     // need ≥4 cycles before a contrast is a "pattern"
const STRONG_LIFT = 1.4;   // success-rate ratio that counts as a real effect

const rate = (k, n) => (n ? k / n : 0);

/** Each episode carries { id, stages:Set/array, outcome, product }. */
const success = (e) => e.outcome === 'accepted';
const hasStage = (e, s) => (e.stages || []).includes(s);

// ── 1. Canonical PATH mining — the route a cycle usually takes ────────────────
export function minePaths(threads) {
  const counts = new Map();
  for (const path of threads.map((t) => t.path).filter(Boolean)) {
    counts.set(path, (counts.get(path) || 0) + 1);
  }
  const ranked = [...counts.entries()].map(([path, n]) => ({ path, support: n }))
    .sort((a, b) => b.support - a.support);
  // most common consecutive stage transition across all threads
  const trans = new Map();
  for (const t of threads) {
    const seq = t.sequence || [];
    for (let i = 0; i < seq.length - 1; i++) {
      const key = `${seq[i]} → ${seq[i + 1]}`;
      trans.set(key, (trans.get(key) || 0) + 1);
    }
  }
  return {
    canonical: ranked[0] || null,
    paths: ranked,
    transitions: [...trans.entries()].map(([t, n]) => ({ transition: t, support: n })).sort((a, b) => b.support - a.support),
  };
}

// ── 2. Stage → outcome contrast — does a step change the success rate? ───────
export function stageOutcomeContrast(episodes, stages) {
  return stages.map((s) => {
    const withS = episodes.filter((e) => hasStage(e, s));
    const without = episodes.filter((e) => !hasStage(e, s));
    const pWith = rate(withS.filter(success).length, withS.length);
    const pWithout = rate(without.filter(success).length, without.length);
    const lift = pWithout > 0 ? pWith / pWithout : (pWith > 0 ? Infinity : 1);
    return {
      stage: s, support: withS.length,
      p_with: pWith, p_without: pWithout, lift,
      retrial_with: rate(withS.filter((e) => e.outcome === 'retrial').length, withS.length),
      retrial_without: rate(without.filter((e) => e.outcome === 'retrial').length, without.length),
      evidence: withS.length >= MIN_SUPPORT && without.length >= 1
        ? (Math.abs(pWith - pWithout) >= 0.15 || lift >= STRONG_LIFT || lift <= 1 / STRONG_LIFT ? 'PATTERN' : 'no effect')
        : 'HYPOTHESIS (n<' + MIN_SUPPORT + ')',
    };
  }).sort((a, b) => Math.abs(b.p_with - b.p_without) - Math.abs(a.p_with - a.p_without));
}

// ── 3. Pair contrast — do two stages TOGETHER beat either alone? ─────────────
export function pairContrast(episodes, A, B) {
  const both = episodes.filter((e) => hasStage(e, A) && hasStage(e, B));
  const rest = episodes.filter((e) => !(hasStage(e, A) && hasStage(e, B)));
  const pBoth = rate(both.filter(success).length, both.length);
  const pRest = rate(rest.filter(success).length, rest.length);
  return {
    pair: `${A} + ${B}`, support: both.length, p_both: pBoth, p_rest: pRest,
    lift: pRest > 0 ? pBoth / pRest : (pBoth > 0 ? Infinity : 1),
    evidence: both.length >= MIN_SUPPORT ? 'PATTERN' : 'HYPOTHESIS (n<' + MIN_SUPPORT + ')',
  };
}

// ── 4. Trials-to-freeze — how many cycles until a formula is frozen? ─────────
export function trialsToFreeze(threads) {
  const lens = threads.filter((t) => t.frozen).map((t) => t.trials);
  if (!lens.length) return { n: 0, mean: null, min: null, max: null, evidence: 'HYPOTHESIS (no frozen threads)' };
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  return { n: lens.length, mean: +mean.toFixed(1), min: Math.min(...lens), max: Math.max(...lens),
    evidence: lens.length >= MIN_SUPPORT ? 'PATTERN' : 'HYPOTHESIS (n<' + MIN_SUPPORT + ')' };
}

// ── 5. PROTEUS meta-insights — NL, gated by evidence ─────────────────────────
export function metaInsights(episodes, stages, threads) {
  const out = [];
  const tag = (e) => (e.startsWith('PATTERN') ? '✔ PATTERN' : '… HYPOTHESIS');

  const contrasts = stageOutcomeContrast(episodes, stages);
  for (const c of contrasts) {
    if (c.evidence === 'no effect') continue;
    if (c.p_with > c.p_without + 0.001)
      out.push({ tag: tag(c.evidence), n: c.support,
        text: `כש‎"${c.stage}" נכלל לפני החלטה, שיעור ההצלחה ${(c.p_with*100).toFixed(0)}% מול ${(c.p_without*100).toFixed(0)}% בלעדיו (lift ${c.lift===Infinity?'∞':c.lift.toFixed(2)}).` });
    else if (c.retrial_without > c.retrial_with + 0.001)
      out.push({ tag: tag(c.evidence), n: c.support,
        text: `דילוג על "${c.stage}" העלה את הסיכוי לניסוי חוזר (${(c.retrial_without*100).toFixed(0)}% מול ${(c.retrial_with*100).toFixed(0)}%).` });
  }

  const t2f = trialsToFreeze(threads);
  if (t2f.mean != null)
    out.push({ tag: tag(t2f.evidence), n: t2f.n,
      text: `בממוצע נדרשו ${t2f.mean} ניסויים עד הקפאת פורמולציה (טווח ${t2f.min}–${t2f.max}).` });

  const paths = minePaths(threads);
  if (paths.canonical)
    out.push({ tag: paths.canonical.support >= MIN_SUPPORT ? '✔ PATTERN' : '… HYPOTHESIS', n: paths.canonical.support,
      text: `המסלול הנפוץ ביותר לשינוי: ${paths.canonical.path}.` });

  return { insights: out, contrasts, t2f, paths };
}
