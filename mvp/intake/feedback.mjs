// Human Feedback Learning (#4) — learn from Rachel's ✓/✗.
//
// Don't just nudge a weight: ATTRIBUTE. For each confirmed/rejected link, which
// entity TYPE helped or misled? Then update the Authority Registry toward each
// type's measured precision. This is how the engine learns that, e.g., Operator
// caused 12 false links while Date contributed 45 correct ones.

/**
 * records: [{ chain:[{type,value,authority}], predProduct, goldProduct }]
 * Returns attribution: { correct:{type:n}, misled:{type:n} }.
 *   correct  — types in the chain of a CORRECT link (they helped)
 *   misled   — the highest-authority type in the chain of a FALSE link (it led us astray)
 */
export function attribute(records) {
  const correct = {}, misled = {};
  for (const r of records) {
    if (!r.predProduct) continue;                  // abstain/orphan: no link to credit or blame
    if (r.predProduct === r.goldProduct) {
      for (const t of new Set((r.chain || []).map((c) => c.type))) correct[t] = (correct[t] || 0) + 1;
    } else {
      const blame = [...(r.chain || [])].sort((a, b) => b.authority - a.authority)[0];
      if (blame) misled[blame.type] = (misled[blame.type] || 0) + 1;
    }
  }
  return { correct, misled };
}

/** Update authorities toward each type's empirical precision (EMA, alpha). */
export function updateAuthority(authority, attribution, alpha = 0.5) {
  const out = { ...authority };
  const types = new Set([...Object.keys(attribution.correct), ...Object.keys(attribution.misled)]);
  const changes = [];
  for (const t of types) {
    const c = attribution.correct[t] || 0, w = attribution.misled[t] || 0;
    if (c + w === 0) continue;
    const empirical = c / (c + w);
    const before = authority[t] ?? 0.5;
    const after = +(alpha * empirical + (1 - alpha) * before).toFixed(2);
    out[t] = after;
    changes.push({ type: t, correct: c, misled: w, empirical: +empirical.toFixed(2), before, after });
  }
  return { authority: out, changes };
}
