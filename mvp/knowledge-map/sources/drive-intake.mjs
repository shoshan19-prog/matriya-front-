// DRIVE INTAKE — the read-only heartbeat. Runs the intake up to the Human-Review
// wall and NO further. Given a normalized Drive inventory it:
//   1. detects changes vs the last snapshot (append-only snapshot store)
//   2. classifies each change's provenance (Drive = Fresco internal source)
//   3. builds a REVIEW queue of actionable changes
//   4. appends the transitions to the flow log
// It NEVER approves, NEVER writes to the corpus, NEVER declares knowledge. The
// scheduler (cron) drives this; a human metabolizes what it queues.

import { recordScan } from './snapshot-store.mjs';
import { appendFlow } from '../research-os/flow-log-store.mjs';

// crude file-name → likely asset hint (display only — NOT a knowledge claim)
const HINT = [
  [/fire|בעיר|שריפ|intumesc|interchar/i, 'Fire Resistance'],
  [/לחיצה|compress|strength|MP\d|mpz/i, 'Compression Strength'],
  [/צבע|color|tint|ΔE|spectro/i, 'Color / Shade'],
  [/viscos|רheolog|rheo|זרימה|workab/i, 'Workability / Flow'],
  [/צפיפות|density/i, 'Density'],
];
const hintAsset = (name) => (HINT.find(([re]) => re.test(name)) || [, '—'])[1];

/** Run one intake pass. inventory: normalized items {source,id,name,modified,size?}.
 *  now: ISO date string (deterministic). Returns the queue + flow events; persists
 *  the new snapshot and appends the flow log. */
export function driveIntake({ source = 'drive', inventory = [], now = new Date().toISOString().slice(0, 10), origin = 'fresco' }) {
  const scan = recordScan({ source, inventory, takenAt: now });
  const actionable = scan.feed.events;  // NEW / UPDATED / DELETED (UNCHANGED dropped)

  const queue = actionable.map((e) => ({
    file: e.name, change: e.status, source,
    provenance: origin === 'fresco' ? 'fresco internal (Drive)' : origin,
    hint: hintAsset(e.name),
    stage: 'Episode → Human Review',
    status: 'QUEUED_FOR_REVIEW',
  }));

  // flow log: one transition per actionable change (movement metadata only)
  const flowEvents = actionable.map((e) => ({
    unit: e.name, stage: `${e.status}→Review`, at: now, note: `drive intake · ${hintAsset(e.name)}`,
  }));
  if (flowEvents.length) appendFlow(flowEvents);

  return {
    source, now, firstScan: scan.firstScan,
    detected: actionable.length, queued: queue.length,
    queue,
    downstream: 'STOPPED at Human Review. No approval, no corpus write, no knowledge declared.',
    autoApproved: 0, autoWrites: 0,
    flowAppended: flowEvents.length,
  };
}
