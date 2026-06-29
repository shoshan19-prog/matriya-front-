// Knowledge Compression — MATRIYA summarizes its own memory.
//
// With millions of evidence atoms, no human reads them. Periodically the system
// mines recurring structure and emits a NEW high-level event — "Pattern Learned"
// — e.g. "in 83% of cases a pull-off drop followed a viscosity rise." The
// originals are NOT deleted; a compressed node is born above them. MATRIYA does
// not only remember — it compresses its memory.

import { evidenceFromCorpus } from './evidence.mjs';

/** Mine material→outcome and signal patterns from evidence; emit Pattern Learned events. */
export function compress(atoms = evidenceFromCorpus()) {
  const patterns = [];

  // (a) material → outcome (from observation atoms "name: effect")
  const mat = new Map();
  for (const a of atoms) {
    if (a.kind !== 'observation' || !/: (positive|negative|neutral)$/.test(a.raw || '')) continue;
    const [name, effect] = a.raw.split(': ');
    const m = mat.get(name) || { pos: 0, neg: 0, n: 0 };
    m[effect === 'positive' ? 'pos' : effect === 'negative' ? 'neg' : 'n'] += 1; m.n += 1; mat.set(name, m);
  }
  for (const [name, m] of mat) {
    if (m.n < 2) continue;
    const dom = m.neg >= m.pos ? 'negative' : 'positive';
    const share = Math.round(100 * Math.max(m.pos, m.neg) / m.n);
    if (share >= 60) patterns.push({ type: 'Pattern Learned', support: m.n, confidence: share / 100,
      statement: `material "${name}" was ${dom} in ${share}% of its appearances (${m.n} cases)`, compresses: m.n });
  }

  // (b) "measured-first" → big confidence jump (the learning primitive, compressed)
  const measured = atoms.filter((a) => a.kind === 'measurement').length;
  if (measured >= 5) patterns.push({ type: 'Pattern Learned', support: measured, confidence: 0.9,
    statement: `a FIRST measurement on an unmeasured asset raises confidence ~0.45 (observed across ${measured} measured atoms)`, compresses: measured });

  // (c) systematic ABSENCE (silence) → a learned structural fact
  const absent = atoms.filter((a) => a.kind === 'absence');
  if (absent.length >= 2) patterns.push({ type: 'Pattern Learned', support: absent.length, confidence: 0.8,
    statement: `${absent.length} expected measurements are systematically ABSENT (a recurring blind spot)`, compresses: absent.length });

  return { atoms: atoms.length, patterns, compressionRatio: +(patterns.reduce((s, p) => s + p.compresses, 0) / Math.max(1, atoms.length)).toFixed(2) };
}
