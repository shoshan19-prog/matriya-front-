// Knowledge Gap Detector — MVP engine (zero dependencies).
//
// MATRIYA's real question is NOT "was the expert right?" — that is the Judgment
// Engine, which is an Evidence layer. The core question is: *how is new
// knowledge born?* A law is born when an existing mechanism stops explaining the
// experiments in some region — a structured BREAKDOWN, not noise — and the
// smallest deciding experiment resolves it.
//
// This engine makes the LAW a first-class object (relationship + domain of
// validity + residuals) and detects, over a set of experiments:
//   ✓ explained   ✗ unexplained   ⚠ contradiction   🔥 breakdown
//   🧪 the single smallest experiment that would close the gap (max info gain)
//
// It maps directly onto MATRIYA's gate:
//   K (known law, established on its own consistent region) → C (check vs ALL
//   evidence) → B (structured breakdown) → N (new boundary + deciding
//   experiment) → L (validate later).

const mean = (xs) => xs.reduce((s, v) => s + v, 0) / (xs.length || 1);
const std = (xs) => { const m = mean(xs); return Math.sqrt(mean(xs.map((v) => (v - m) ** 2))); };
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : 0; };

// --- a Law as a first-class object: y ≈ a*x + b over a domain of validity ---
export function fitLinear(points, xKey, yKey) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p[xKey], 0);
  const sy = points.reduce((s, p) => s + p[yKey], 0);
  const sxx = points.reduce((s, p) => s + p[xKey] ** 2, 0);
  const sxy = points.reduce((s, p) => s + p[xKey] * p[yKey], 0);
  const denom = n * sxx - sx * sx || 1e-9;
  const a = (n * sxy - sx * sy) / denom;
  const b = (sy - a * sx) / n;
  return { xKey, yKey, a, b, predict: (x) => a * x + b, describe: () => `${yKey} ≈ ${a.toFixed(2)}·${xKey} + ${b.toFixed(1)}` };
}

// --- K: ESTABLISH the law on its largest self-consistent region (RANSAC) ----
// Don't refit to everything (that smears two regimes into one bad line). Find
// the biggest set of experiments that ONE linear law explains within tol0; that
// set is the law's domain of validity, the rest are candidates for a gap.
export function establishLaw(experiments, xKey, yKey, tol0) {
  let best = { inliers: [], law: null };
  for (let i = 0; i < experiments.length; i++) {
    for (let j = i + 1; j < experiments.length; j++) {
      if (experiments[i][xKey] === experiments[j][xKey]) continue; // need a slope
      const law = fitLinear([experiments[i], experiments[j]], xKey, yKey);
      const inliers = experiments.filter((e) => Math.abs(e[yKey] - law.predict(e[xKey])) <= tol0);
      if (inliers.length > best.inliers.length) best = { inliers, law };
    }
  }
  const law = fitLinear(best.inliers, xKey, yKey);          // refit on the consistent region
  const residuals = best.inliers.map((e) => e[yKey] - law.predict(e[xKey]));
  const noiseStd = std(residuals) || 1;
  return { law, inliers: best.inliers, noiseStd, tol: Math.max(2 * noiseStd, 2) };
}

// --- C: check the law against EVERY experiment ------------------------------
export function classify(experiments, law, tol) {
  return experiments.map((e) => {
    const pred = law.predict(e[law.xKey]);
    const residual = e[law.yKey] - pred;
    return { ...e, pred: +pred.toFixed(1), residual: +residual.toFixed(1), explained: Math.abs(residual) <= tol };
  });
}

// --- B: structured breakdown vs noise? --------------------------------------
// A split (feature, threshold) is a breakdown iff the LOW side stays mostly
// explained AND the HIGH side is systematically biased (sign-consistent, large).
// Using fractions/medians keeps it robust to a single anomalous point.
export function detectBreakdown(scored, features, tol, noiseStd) {
  let best = null;
  for (const f of features) {
    const xs = [...new Set(scored.map((e) => e[f]))].sort((p, q) => p - q);
    for (let i = 1; i < xs.length; i++) {
      const t = (xs[i - 1] + xs[i]) / 2;
      const low = scored.filter((e) => e[f] < t), high = scored.filter((e) => e[f] >= t);
      if (low.length < 3 || high.length < 3) continue;
      const lowExplained = low.filter((e) => Math.abs(e.residual) <= tol).length / low.length;
      const rHigh = high.map((e) => e.residual);
      const sign = Math.sign(median(rHigh)) || 1;
      const highConsistency = high.filter((e) => Math.sign(e.residual) === sign).length / high.length;
      const bias = Math.abs(mean(rHigh));
      const structured = lowExplained >= 0.8 && highConsistency >= 0.8 && bias > Math.max(3 * noiseStd, tol);
      const score = structured ? bias * highConsistency : 0;
      if (score > 0 && (!best || score > best.score)) best = {
        feature: f, threshold: t, bias: +bias.toFixed(1), consistency: highConsistency, score,
        direction: sign < 0 ? 'over-predicts (actual lower than law)' : 'under-predicts (actual higher than law)',
      };
    }
  }
  return best;
}

// --- ⚠ contradiction: near-identical conditions, divergent outcome ----------
export function findContradictions(experiments, keys, yKey, tol, neighborhood) {
  const out = [];
  for (let i = 0; i < experiments.length; i++) for (let j = i + 1; j < experiments.length; j++) {
    const a = experiments[i], b = experiments[j];
    if (keys.every((k) => Math.abs(a[k] - b[k]) <= neighborhood[k]) && Math.abs(a[yKey] - b[yKey]) > 2 * tol)
      out.push({ a: a.id, b: b.id, dy: +(a[yKey] - b[yKey]).toFixed(1), at: keys.map((k) => `${k}≈${a[k]}`).join(', ') });
  }
  return out;
}

// --- N: the smallest deciding experiment (max information gain) --------------
// One experiment in the unexplored gap STRADDLING the boundary, at the input
// where the known law and the breakdown estimate disagree most.
export function proposeExperiment(scored, law, breakdown) {
  if (!breakdown) return null;
  const f = breakdown.feature;
  const vals = [...new Set(scored.map((e) => e[f]))].sort((p, q) => p - q);
  let straddle = null;
  for (let i = 1; i < vals.length; i++) if (vals[i - 1] < breakdown.threshold && vals[i] >= breakdown.threshold) straddle = { lo: vals[i - 1], hi: vals[i] };
  if (!straddle) straddle = { lo: breakdown.threshold, hi: breakdown.threshold };
  const at = +((straddle.lo + straddle.hi) / 2).toFixed(1);
  const breakoutEstimate = mean(scored.filter((e) => e[f] >= breakdown.threshold).map((e) => e[law.yKey]));
  const xMax = Math.max(...scored.map((e) => e[law.xKey]));
  return {
    [f]: at, [law.xKey]: xMax,
    rationale: `Unexplored gap in ${f} ∈ (${straddle.lo}, ${straddle.hi}). At ${law.xKey}=${xMax} the known law predicts ${law.yKey}≈${law.predict(xMax).toFixed(0)} while the breakdown region averages ≈${breakoutEstimate.toFixed(0)} — maximal disagreement, so ONE experiment here decides whether the boundary is real and where it sits.`,
  };
}

// --- orchestration: the full K→C→B→N→L pass ---------------------------------
export function detectKnowledgeGaps(experiments, { xKey, yKey, features, neighborhood, tol0 = 4 }) {
  const { law, inliers, noiseStd, tol } = establishLaw(experiments, xKey, yKey, tol0); // K
  const scored = classify(experiments, law, tol);                                      // C
  const breakdown = detectBreakdown(scored, features, tol, noiseStd);                  // B
  const contradictions = findContradictions(experiments, [xKey, ...features.filter((f) => f !== xKey)], yKey, tol, neighborhood);
  const deciding = proposeExperiment(scored, law, breakdown);                          // N
  const explained = scored.filter((e) => e.explained);
  const unexplained = scored.filter((e) => !e.explained);
  const breakdownCluster = breakdown ? unexplained.filter((e) => e[breakdown.feature] >= breakdown.threshold) : [];
  return { law, inliers, tol, noiseStd, scored, explained, unexplained, breakdown, breakdownCluster, contradictions, deciding };
}
