// INNOVATION 5 — RESEARCH AGENDA.
//
// The scheduler of the research OS: it gathers everything the lab has left
// unresolved — pending reviews, representation gaps, fragile knowledge, aging
// knowledge, open hypotheses — and prioritises them into one read-only agenda of
// "what to look at next". It RECOMMENDS; it never acts, never approves, never
// writes. The human runs the lab; the OS keeps the list.

import { FIRE_EPISODES_PENDING } from '../schema/fire-episodes.mjs';
import { representationCoverage } from './representation-coverage.mjs';
import { fragileKnowledge } from './lineage.mjs';
import { knowledgeHalfLife } from './half-life.mjs';
import { hypothesisCandidates } from './hypotheses.mjs';

const PRIORITY = { blocker: 0, gap: 1, risk: 2, question: 3 };

export function researchAgenda() {
  const items = [];

  // pending reviews — knowledge waiting at the Human-Review wall
  const pendingFire = FIRE_EPISODES_PENDING.filter((e) => e.origin === 'fresco').length;
  if (pendingFire) items.push({ kind: 'blocker', title: `${pendingFire} Fire episodes pending Human Review`,
    why: 'recognized & sound, but no Knowledge until a person approves + the Fire schema v2 is confirmed' });

  // representation gaps — measurement types with no model
  for (const w of representationCoverage().unmodeledWings)
    items.push({ kind: 'gap', title: `No model for ${w.dimension} (${w.asset})`, why: `seen via ${w.source} — extend the schema before ingest` });

  // fragile knowledge — single-episode load-bearing claims
  for (const f of fragileKnowledge())
    items.push({ kind: 'risk', title: `Fragile: ${f.asset} rests on one measured episode (${f.supportedBy.join(', ')})`, why: 'add an independent measurement to de-risk' });

  // aging knowledge + standard supersession
  const hl = knowledgeHalfLife();
  for (const s of hl.standardRisks) items.push({ kind: 'risk', title: `Standard half-life: ${s.asset}`, why: s.risk });

  // open hypotheses / questions
  for (const h of hypothesisCandidates().candidates)
    items.push({ kind: 'question', title: h.hypothesis, why: `${h.status} — ${h.test}` });

  items.sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind]);
  return { items, counts: ['blocker', 'gap', 'risk', 'question'].map((k) => ({ kind: k, n: items.filter((i) => i.kind === k).length })),
    note: 'a read-only research agenda — recommendations only; the OS never acts on these' };
}
