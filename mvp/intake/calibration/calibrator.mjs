// Confidence recalibration (improvement #1).
// Fits a MONOTONIC map raw_confidence -> empirical accuracy from the labeled set,
// so a calibrated 0.93 actually means ~93% correct. Pool-adjacent-violators (PAV)
// for isotonic regression, then linear interpolation between bin midpoints.

export function fitCalibrator(preds, nbins = 5) {
  const linked = preds.filter((p) => p.pred.product).map((p) => ({ x: p.pred.confidence, y: p.pred.product === p.gold.product ? 1 : 0 }));
  if (!linked.length) return (x) => x;
  // bin by confidence
  const bins = Array.from({ length: nbins }, () => ({ sx: 0, sy: 0, n: 0 }));
  for (const { x, y } of linked) { const i = Math.min(nbins - 1, Math.floor(x * nbins)); bins[i].sx += x; bins[i].sy += y; bins[i].n++; }
  let pts = bins.filter((b) => b.n).map((b) => ({ x: b.sx / b.n, y: b.sy / b.n, n: b.n }));
  // PAV: enforce non-decreasing y
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < pts.length - 1; i++) if (pts[i].y > pts[i + 1].y) {
      const n = pts[i].n + pts[i + 1].n, y = (pts[i].y * pts[i].n + pts[i + 1].y * pts[i + 1].n) / n, x = (pts[i].x * pts[i].n + pts[i + 1].x * pts[i + 1].n) / n;
      pts.splice(i, 2, { x, y, n }); changed = true; break;
    }
  }
  // interpolating function (clamped)
  return (raw) => {
    if (raw <= pts[0].x) return +pts[0].y.toFixed(3);
    if (raw >= pts[pts.length - 1].x) return +pts[pts.length - 1].y.toFixed(3);
    for (let i = 0; i < pts.length - 1; i++) if (raw >= pts[i].x && raw <= pts[i + 1].x) {
      const t = (raw - pts[i].x) / (pts[i + 1].x - pts[i].x || 1);
      return +(pts[i].y + t * (pts[i + 1].y - pts[i].y)).toFixed(3);
    }
    return +raw.toFixed(3);
  };
}
