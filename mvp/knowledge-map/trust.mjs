// Knowledge Trust Engine — the layer that is missing today.
//
// It does NOT decide who is "right". It learns HOW MUCH a SOURCE TYPE can be
// RELIED ON for a SPECIFIC KNOWLEDGE TYPE — i.e. trust is a function of
// (source_type × knowledge_type), and it is LEARNED, not declared.
//
// Each cell is a Beta(α,β) belief about "when this source is consulted for this
// knowledge type, does it actually deliver?":
//   • prior  ← the expert stars in the Source Map (weak pseudo-counts, so data wins)
//   • observe(success) ← real evidence: it delivered (success) or was present-but-
//                        empty / wrong (failure). present-but-empty is a FAILURE —
//                        that is how Fresco's empty lab measurements get learned.
//   trust  = posterior mean  α/(α+β)
//   calibrated = enough real observations to stop leaning on the prior
//
// Same discipline as the Identity Calibration harness: do NOT trust uncalibrated
// stars. An uncalibrated cell is flagged so PROTEUS routes with a caveat.

import { SOURCE_MAP, sourceById } from './sources.mjs';

const PRIOR_STRENGTH = 4;     // total pseudo-count injected by the prior (small → data dominates)
const CALIBRATED_AT = 3;      // need ≥3 real observations before a cell is "calibrated"

const stars = (s, k) => (s.expert && k in s.expert ? s.expert[k] : 0); // 0..5, 0 = "not expected"

export function makeTrustEngine() {
  const cells = new Map(); // key `${source}|${ktype}` -> {a,b,obs}
  const key = (s, k) => `${s}|${k}`;

  const cell = (s, k) => {
    const kk = key(s, k);
    if (!cells.has(kk)) {
      const src = sourceById[s];
      const st = src ? stars(src, k) : 0;                 // 0..5
      const a0 = 1 + PRIOR_STRENGTH * (st / 5);           // success pseudo-count
      const b0 = 1 + PRIOR_STRENGTH * (1 - st / 5);       // failure pseudo-count
      cells.set(kk, { a: a0, b: b0, obs: 0, prior_stars: st });
    }
    return cells.get(kk);
  };

  return {
    /** Record one real observation: did `source` deliver `ktype` when consulted? */
    observe(source, ktype, success) {
      const c = cell(source, ktype);
      if (success) c.a += 1; else c.b += 1;
      c.obs += 1;
      return this;
    },

    /** Calibrated trust for (source, ktype): posterior mean + whether it's earned. */
    trust(source, ktype) {
      const c = cell(source, ktype);
      const score = c.a / (c.a + c.b);
      const n = c.a + c.b;
      const variance = (c.a * c.b) / (n * n * (n + 1)); // Beta variance → confidence
      return {
        source, ktype,
        score,                                   // 0..1
        stars: Math.round(score * 5),            // ★ for display
        prior_stars: c.prior_stars,              // what the expert prior said
        observed: c.obs,
        calibrated: c.obs >= CALIBRATED_AT,
        confidence: 1 - Math.min(1, Math.sqrt(variance) * 4),
        // a drift flag: real evidence pulled trust away from the prior belief
        surprise: Math.abs(score * 5 - c.prior_stars) >= 1.5 && c.obs > 0,
      };
    },

    /** Rank every source type for a knowledge type — PROTEUS's "where should I look?". */
    rank(ktype, { presence = {} } = {}) {
      return SOURCE_MAP
        .map((s) => {
          const t = this.trust(s.id, ktype);
          const pres = presence[s.id] || 'unknown'; // delivered | empty | absent | unknown
          return { ...t, label: s.label, presence: pres };
        })
        .filter((t) => t.prior_stars > 0 || t.observed > 0) // only sources expected to hold it
        .sort((x, y) => {
          // present-and-delivered beats present-but-empty beats absent, then by trust
          const rankPres = (p) => ({ delivered: 3, unknown: 2, empty: 1, absent: 0 }[p] ?? 2);
          return rankPres(y.presence) - rankPres(x.presence) || y.score - x.score;
        });
    },
  };
}
