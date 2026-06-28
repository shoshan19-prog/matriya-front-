// Episode Builder → observe() → Trust Engine.   (narrow scope: this and nothing more)
//
// Every time the Episode Builder assembles a decision cycle, it implicitly TESTS
// each source that fed it: did this source TYPE actually deliver the knowledge it
// claims to hold? We turn that test into observations and feed the Trust Engine.
// The Router stops being a hand-written matrix and becomes a learned one.
//
// No graph writes. The only output is: the Trust Matrix updated.

import { KTYPE, sourceById } from './sources.mjs';

// Infer the source TYPE of a doc (real pipeline: set d.source_type explicitly).
export function sourceTypeOf(d) {
  if (d.source_type) return d.source_type;
  const n = (d.name || '').toLowerCase();
  if (/פורמולצ|formula/.test(n)) return 'formula_sheet';
  if (/לחיצה|מעבדה|compress|lab|בדיקת/.test(n)) return 'lab_sheet';
  if (/שבוע|מעקב|weekly|משימות/.test(n)) return 'weekly_report';
  if (/מו"פ|מופ|דו"ח|r&d|דוח-/.test(n)) return 'rd_report';
  if (/priority|פריוריט/.test(n)) return 'priority';
  if (/\.(jpg|jpeg|png)$/.test(n)) return 'image';
  if (/ספק|coa|supplier/.test(n)) return 'supplier_doc';
  return null;
}

// What each source TYPE claims to provide (prior stars ≥ 3) — it is judged only
// on its own claims, so a lab sheet is graded on MEASUREMENT, not on REASON.
const claimsOf = (st) =>
  Object.entries(sourceById[st]?.expert || {}).filter(([, v]) => v >= 3).map(([k]) => k);

const has = (re, docs) => docs.some((d) => re.test(d.content || ''));

// For one (episode, source-type, knowledge-type): what outcome did the build see?
function outcomeFor(ep, k, srcDocs) {
  switch (k) {
    case KTYPE.MEASUREMENT:
      return ep.results.some((r) => srcDocs.some((d) => d.id === r.source)) ? 'DELIVERED' : 'EMPTY';
    case KTYPE.INPUT:
      return has(/\d+\s*(kg|ק"ג|קג|gr|גרם|%)/, srcDocs) || ep.anchor.version ? 'DELIVERED' : 'EMPTY';
    case KTYPE.REASON:
      return ep.why ? 'DELIVERED' : 'EMPTY';
    case KTYPE.HYPOTHESIS:
      return ep.hypothesis ? 'DELIVERED' : 'EMPTY';
    case KTYPE.DECISION:
      if (ep.contradiction) return 'CONTRADICTED';        // conflicts with another source
      if (ep.decision.outcome === 'open') return 'EMPTY';  // no decision recorded
      return ep.decision.reason ? 'DELIVERED' : 'LOW_CONFIDENCE'; // decided, but is the WHY on record?
    case KTYPE.DEAD_END:
      return ep.decision.outcome === 'rejected' && ep.why ? 'DELIVERED' : 'EMPTY';
    case KTYPE.SUPPLIER:
      return has(/ספק|supplier|צמיתות|כפר גלעדי|COA/i, srcDocs) ? 'DELIVERED' : 'EMPTY';
    case KTYPE.BATCH:
      return ep.anchor.batch ? 'DELIVERED' : 'EMPTY';
    default:
      return null;
  }
}

// Worst-wins precedence when one source type appears on several docs in an episode.
const RANK = { CONTRADICTED: 4, EMPTY: 3, LOW_CONFIDENCE: 2, DELIVERED: 1 };

/** Derive observations from ONE episode (one obs per source-type × knowledge-type). */
export function deriveObservations(ep, docs) {
  const epDocs = docs.filter((d) => (ep.documents || []).includes(d.id));
  const bySource = new Map();
  for (const d of epDocs) {
    const st = sourceTypeOf(d);
    if (!st) continue;
    (bySource.get(st) || bySource.set(st, []).get(st)).push(d);
  }
  const obs = [];
  for (const [st, srcDocs] of bySource) {
    for (const k of claimsOf(st)) {
      const outcome = outcomeFor(ep, k, srcDocs);
      if (!outcome) continue;
      const key = `${st}|${k}`;
      const prev = obs.find((o) => o.key === key);
      if (!prev) obs.push({ key, source_type: st, knowledge_type: k, outcome, episode: ep.episode_id });
      else if (RANK[outcome] > RANK[prev.outcome]) { prev.outcome = outcome; }
    }
  }
  return obs.map(({ key, ...o }) => o);
}

/** Feed a whole batch of episodes into the Trust Engine; report what moved. */
export function observeEpisodes(engine, episodes, docs) {
  const snap = () => {
    const m = {};
    for (const ep of episodes) for (const o of deriveObservations(ep, docs)) {
      const t = engine.trust(o.source_type, o.knowledge_type);
      m[`${o.source_type}|${o.knowledge_type}`] = { stars: t.stars, calibrated: t.calibrated };
    }
    return m;
  };
  const before = snap();
  let count = 0;
  const fired = [];
  for (const ep of episodes) for (const o of deriveObservations(ep, docs)) {
    engine.observe(o.source_type, o.knowledge_type, o.outcome);
    fired.push(o); count++;
  }
  const after = snap();
  const changed = [];
  for (const key of Object.keys(after)) {
    const b = before[key] || { stars: null, calibrated: false }, a = after[key];
    if (b.stars !== a.stars || b.calibrated !== a.calibrated)
      changed.push({ cell: key, from: b.stars, to: a.stars, calibrated: a.calibrated });
  }
  return { observations: count, fired, changed };
}
