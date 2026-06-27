// Segmented-regression engine for the cement-threshold V1 (zero dependencies).
//
// Tests H1: a one-break segmented model explains 28-day strength vs cement%
// significantly better than a continuous linear model, with the breakpoint
// ESTIMATED (never hand-picked), validated by permutation + bootstrap, and
// surviving confounder control. The investigator never sees raw strengths;
// this module returns only aggregate statistics.

export const mean = (a) => a.reduce((s, v) => s + v, 0) / (a.length || 1);
const sum = (a) => a.reduce((s, v) => s + v, 0);

// --- OLS via normal equations (small k), tiny ridge for stability -----------
export function ols(X, y) {
  const n = X.length, k = X[0].length;
  const XtX = Array.from({ length: k }, () => new Array(k).fill(0));
  const Xty = new Array(k).fill(0);
  for (let i = 0; i < n; i++) for (let a = 0; a < k; a++) {
    Xty[a] += X[i][a] * y[i];
    for (let b = 0; b < k; b++) XtX[a][b] += X[i][a] * X[i][b];
  }
  for (let a = 0; a < k; a++) XtX[a][a] += 1e-6; // ridge
  // Gaussian elimination
  const M = XtX.map((row, i) => [...row, Xty[i]]);
  for (let c = 0; c < k; c++) {
    let p = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    const piv = M[c][c] || 1e-9;
    for (let j = c; j <= k; j++) M[c][j] /= piv;
    for (let r = 0; r < k; r++) if (r !== c) { const f = M[r][c]; for (let j = c; j <= k; j++) M[r][j] -= f * M[c][j]; }
  }
  const beta = M.map((row) => row[k]);
  const resid = X.map((row, i) => y[i] - row.reduce((s, v, a) => s + v * beta[a], 0));
  return { beta, resid, rss: sum(resid.map((r) => r * r)) };
}

const linfit = (x, y) => ols(x.map((v) => [1, v]), y);

// --- one-break segmented fit: best discontinuous two-line split in [lo,hi] ---
export function segmentedBest(x, y, range, minPer = 3) {
  const xs = [...new Set(x)].sort((a, b) => a - b);
  let best = null;
  for (let i = 1; i < xs.length; i++) {
    const T = (xs[i - 1] + xs[i]) / 2;
    if (T < range.lo || T > range.hi) continue;
    const Li = [], Ri = [];
    x.forEach((v, idx) => (v < T ? Li : Ri).push(idx));
    if (Li.length < minPer || Ri.length < minPer) continue;
    const l = linfit(Li.map((j) => x[j]), Li.map((j) => y[j]));
    const r = linfit(Ri.map((j) => x[j]), Ri.map((j) => y[j]));
    const rss = l.rss + r.rss;
    const gap = (r.beta[0] + r.beta[1] * T) - (l.beta[0] + l.beta[1] * T);
    if (!best || rss < best.rss) best = { T, rss, gap, left: l.beta, right: r.beta };
  }
  return best;
}

const aic = (n, rss, k) => n * Math.log((rss / n) || 1e-9) + 2 * k;

// Level-shift (jump) model: y = b0 + b1·x + δ·1[x>=T]. This is the faithful
// model for a "threshold JUMP" and — unlike two independent sloped segments —
// localizes the breakpoint sharply (a sloped segment can mimic a break one
// level away; a level shift cannot). Estimated breakpoint = T minimizing RSS.
export function segmentedJump(x, y, range, minPer = 3) {
  const xs = [...new Set(x)].sort((a, b) => a - b);
  let best = null;
  for (let i = 1; i < xs.length; i++) {
    const T = (xs[i - 1] + xs[i]) / 2;
    if (T < range.lo || T > range.hi) continue;
    const left = x.filter((v) => v < T).length;
    if (left < minPer || x.length - left < minPer) continue;
    const f = ols(x.map((v) => [1, v, v >= T ? 1 : 0]), y);
    if (!best || f.rss < best.rss) best = { T, rss: f.rss, jump: f.beta[2], beta: f.beta };
  }
  return best;
}

// improvement statistic: fraction of linear residual variance explained by the jump
export function improvement(x, y, range, minPer) {
  const lin = linfit(x, y);
  const seg = segmentedJump(x, y, range, minPer);
  if (!seg) return { seg: null, lin, improvement: 0 };
  return {
    seg, lin,
    improvement: lin.rss > 0 ? (lin.rss - seg.rss) / lin.rss : 0,
    aic_lin: aic(x.length, lin.rss, 2), aic_seg: aic(x.length, seg.rss, 3),
  };
}

function mulberry32(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const shuffle = (a, rnd) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// permutation test on the improvement statistic
export function permutationP(x, y, range, minPer, B, seed = 7) {
  const obs = improvement(x, y, range, minPer).improvement;
  const rnd = mulberry32(seed); let ge = 0;
  for (let b = 0; b < B; b++) { const yp = shuffle(y, rnd); if (improvement(x, yp, range, minPer).improvement >= obs) ge++; }
  return { obs, p: (1 + ge) / (B + 1) };
}

// bootstrap CI for the breakpoint
export function bootstrapT(x, y, range, minPer, B, seed = 11) {
  const rnd = mulberry32(seed); const n = x.length; const Ts = [];
  for (let b = 0; b < B; b++) {
    const idx = Array.from({ length: n }, () => Math.floor(rnd() * n));
    const seg = segmentedJump(idx.map((i) => x[i]), idx.map((i) => y[i]), range, minPer);
    if (seg) Ts.push(seg.T);
  }
  Ts.sort((a, b) => a - b);
  if (!Ts.length) return { lo: NaN, hi: NaN, width: Infinity, n: 0 };
  const q = (p) => Ts[Math.min(Ts.length - 1, Math.max(0, Math.floor(p * (Ts.length - 1))))];
  const lo = q(0.025), hi = q(0.975);
  return { lo, hi, width: hi - lo, n: Ts.length };
}

// confounder control: residualize y on covariates, then re-test on residuals
export function adjustForConfounders(rows, y, covariateSpec) {
  // build design matrix: intercept + continuous + one-hot categoricals (drop first level)
  const cols = [(_) => 1];
  for (const c of covariateSpec.continuous || []) cols.push((row) => Number(row[c]) || 0);
  for (const c of covariateSpec.categorical || []) {
    const levels = [...new Set(rows.map((r) => String(r[c])))].sort();
    for (const lv of levels.slice(1)) cols.push((row) => (String(row[c]) === lv ? 1 : 0));
  }
  const X = rows.map((r) => cols.map((f) => f(r)));
  return ols(X, y).resid;
}
