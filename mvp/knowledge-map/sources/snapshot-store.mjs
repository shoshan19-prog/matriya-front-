// SNAPSHOT STORE — the one stateful piece: append-only memory of past scans.
//
// The Change Detector compares "now" to "last time". This is "last time": an
// append-only log of every scan, per source, so "what changed today" runs against
// real history instead of an in-memory pair. Append-only on purpose — we never
// rewrite the past (same governance as the rest of MATRIYA); each scan is a new
// line, and the latest line is the baseline for the next comparison.
//
//   recordScan(source, inventory)  =  detect(last snapshot, inventory) → feed
//                                     + append this inventory as the new baseline
//
// Source-agnostic, like everything above the Scanner: it stores normalized
// inventories ({source,id,name,modified,…}) and knows nothing about content.
// Storage is a local JSONL file per source, kept OUTSIDE git (.data/ is ignored).

import { existsSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFeed } from './change-feed.mjs';

const DEFAULT_DIR = dirname(fileURLToPath(import.meta.url)) + '/../.data/snapshots';
const safe = (s) => String(s).replace(/[^a-z0-9_-]+/gi, '_');
const pathFor = (source, dir) => `${dir}/${safe(source)}.jsonl`;

/** The most recent persisted snapshot for a source (or null on first ever scan). */
export function lastSnapshot(source, dir = DEFAULT_DIR) {
  const p = pathFor(source, dir);
  if (!existsSync(p)) return null;
  const lines = readFileSync(p, 'utf8').trim().split('\n').filter(Boolean);
  if (!lines.length) return null;
  return JSON.parse(lines[lines.length - 1]);   // last line = latest baseline
}

/** Append a snapshot as the new baseline (append-only — never overwrites). */
export function appendSnapshot(source, inventory, takenAt, dir = DEFAULT_DIR) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const record = { takenAt, source, count: inventory.length, inventory };
  appendFileSync(pathFor(source, dir), JSON.stringify(record) + '\n');
  return record;
}

/** RECORD A SCAN: compare the new inventory to the last baseline, return the
 *  change feed, and persist the new inventory as the next baseline. This is the
 *  real "what changed since last scan" — the only call a daily job needs. */
export function recordScan({ source, inventory, takenAt = new Date().toISOString(), dir = DEFAULT_DIR }) {
  const prev = lastSnapshot(source, dir);
  const feed = buildFeed(prev?.inventory || [], inventory);
  appendSnapshot(source, inventory, takenAt, dir);
  return {
    source, takenAt, firstScan: !prev, prevTakenAt: prev?.takenAt || null,
    // on the first ever scan everything reads as NEW — that is a BASELINE, not a
    // flood; the flag lets the UI say so instead of crying wolf.
    feed,
  };
}
