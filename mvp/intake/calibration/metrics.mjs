// Identity calibration — metrics (precision / recall / false-link / calibration).

export function confusion(preds) {
  let TP = 0, FP = 0, FN = 0, TN = 0;
  for (const p of preds) {
    const linked = !!p.pred.product, hasGold = !!p.gold.product;
    const correct = linked && p.pred.product === p.gold.product;
    if (linked && correct) TP++;
    else if (linked && !correct) FP++;      // wrong product, OR linked when gold is orphan
    else if (!linked && hasGold) FN++;       // missed a real link
    else TN++;                               // correct abstention
  }
  const precision = TP + FP ? TP / (TP + FP) : 1;
  const recall = TP + FN ? TP / (TP + FN) : 1;
  const false_link_rate = TP + FP ? FP / (TP + FP) : 0;
  return { TP, FP, FN, TN, precision: +precision.toFixed(3), recall: +recall.toFixed(3), false_link_rate: +false_link_rate.toFixed(3) };
}

// Reliability table: among LINKED predictions, accuracy per confidence band + ECE.
export function calibration(preds, bands = [[0.95, 1.01], [0.85, 0.95], [0.7, 0.85], [0.5, 0.7], [0, 0.5]]) {
  const linked = preds.filter((p) => p.pred.product);
  const N = linked.length || 1;
  const rows = bands.map(([lo, hi]) => {
    const inb = linked.filter((p) => p.pred.confidence >= lo && p.pred.confidence < hi);
    const acc = inb.length ? inb.filter((p) => p.pred.product === p.gold.product).length / inb.length : null;
    const meanConf = inb.length ? inb.reduce((s, p) => s + p.pred.confidence, 0) / inb.length : null;
    return { band: `${lo.toFixed(2)}–${(hi > 1 ? 1 : hi).toFixed(2)}`, n: inb.length, accuracy: acc == null ? null : +acc.toFixed(2), mean_conf: meanConf == null ? null : +meanConf.toFixed(2) };
  });
  const ece = rows.filter((r) => r.n).reduce((s, r) => s + (r.n / N) * Math.abs(r.accuracy - r.mean_conf), 0);
  return { rows, ece: +ece.toFixed(3) };
}

// Selective prediction: smallest confidence threshold achieving target precision,
// and the coverage (fraction of true-link items captured) at that threshold.
export function selectiveThreshold(preds, target = 0.95) {
  const goldCount = preds.filter((p) => p.gold.product).length || 1;
  const cuts = [...new Set(preds.filter((p) => p.pred.product).map((p) => p.pred.confidence))].sort((a, b) => b - a);
  for (const t of cuts) {
    const at = preds.filter((p) => p.pred.product && p.pred.confidence >= t);
    const tp = at.filter((p) => p.pred.product === p.gold.product).length;
    const prec = at.length ? tp / at.length : 1;
    if (prec >= target) return { threshold: +t.toFixed(3), precision_at: +prec.toFixed(3), coverage: +(tp / goldCount).toFixed(3) };
  }
  return { threshold: 1.01, precision_at: 1, coverage: 0 };
}

// Per-entity-type reliability: among predictions whose winning evidence used type T,
// how often the prediction was correct. Drives improvement #2 (reweighting).
export function perTypeReliability(preds) {
  const tot = {}, ok = {};
  for (const p of preds) {
    if (!p.pred.product) continue;
    for (const t of new Set(p.evidenceTypes || [])) {
      tot[t] = (tot[t] || 0) + 1;
      if (p.pred.product === p.gold.product) ok[t] = (ok[t] || 0) + 1;
    }
  }
  const out = {};
  for (const t of Object.keys(tot)) out[t] = +((ok[t] || 0) / tot[t]).toFixed(2);
  return out;
}
