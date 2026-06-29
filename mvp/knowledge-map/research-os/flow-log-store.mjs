// FLOW-LOG STORE — the append-only ledger of stage transitions.
//
// This is the substrate Knowledge Flow Rate needs to compute TRUE rates over time.
// It is committed (not in .data) on purpose: the container is ephemeral, so the
// log must be durable and auditable to accrue across scheduled runs. It records
// only movement metadata — a unit, the transition, a timestamp, a note — never
// source content, never secrets, never a corpus write.

import { existsSync, readFileSync, appendFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = dirname(fileURLToPath(import.meta.url)) + '/flow-log.jsonl';

/** Append flow events. events: [{unit, stage, at, note?}] — append-only. */
export function appendFlow(events) {
  for (const e of events) appendFileSync(FILE, JSON.stringify(e) + '\n');
  return events.length;
}

/** Read the full flow log (oldest → newest). */
export function readFlow() {
  if (!existsSync(FILE)) return [];
  return readFileSync(FILE, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
}
