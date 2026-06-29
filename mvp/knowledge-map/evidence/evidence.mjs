// Evidence Atom — the TRUE smallest unit (below the Knowledge Event).
//
// Every source (SharePoint, Drive, Gmail, a photo, a lab instrument, a sentence)
// produces the same thing: EVIDENCE. The event is not the first atom — evidence
// is. "09:13 Rachel uploaded a photo." "09:20 Brookfield → 18,500 cP." "09:25
// 'the colour cracked'." Each is one Evidence atom; every higher layer is built
// from them:
//   Evidence → Knowledge Event → Research Memory → Compression → Context Graph
//            → Entropy → Decision → Law
//
// So every adapter just emits Evidence; the engine assembles the rest.

import { REAL_EPISODES } from '../domains/corpus.mjs';

export const KIND = ['measurement', 'image', 'text', 'email', 'document', 'observation', 'absence'];

let _seq = 0;
export const evidence = ({ ts, source, actor, kind, asset, signal, value, unit, raw }) =>
  ({ id: `EV${String(_seq++).padStart(4, '0')}`, ts: ts ?? _seq, source, actor: actor ?? null,
     kind, asset: asset ?? null, signal: signal ?? null, value: value ?? null, unit: unit ?? null, raw: raw ?? null });

/** Derive Evidence atoms from the real corpus: every domain signal is one atom. */
export function evidenceFromCorpus(episodes = REAL_EPISODES) {
  const atoms = [];
  let t = 0;
  for (const ep of episodes) {
    for (const d of ep.domains || []) {
      const kind = d.signal === 'measured' ? 'measurement' : d.signal === 'empty' ? 'absence' : 'observation';
      atoms.push(evidence({ ts: t++, source: ep.product, kind, asset: d.domain, signal: d.signal, raw: d.note }));
    }
    for (const m of ep.materials || []) atoms.push(evidence({ ts: t++, source: ep.product, kind: 'observation', asset: null, raw: `${m.name}: ${m.effect}` }));
  }
  return atoms;
}

/** Knowledge Events are now AGGREGATES of evidence (grouped by source × asset). */
export function eventsFromEvidence(atoms) {
  const groups = new Map();
  for (const a of atoms) {
    if (!a.asset) continue;
    const k = `${a.source}|${a.asset}`;
    (groups.get(k) || groups.set(k, []).get(k)).push(a);
  }
  return [...groups.entries()].map(([k, ev]) => {
    const [source, asset] = k.split('|');
    return { source, asset, evidence: ev.map((e) => e.id), kind: ev.some((e) => e.kind === 'measurement') ? 'measured' : 'qualitative', n: ev.length };
  });
}
