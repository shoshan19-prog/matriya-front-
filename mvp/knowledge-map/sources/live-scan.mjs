// LIVE SCAN — the last wire: a real source adapter → normalized inventory →
// snapshot store → Change Feed. This is the ONE piece that was missing between
// "the source is blocked" and "matriya changes answers for real".
//
// The day the credentials and Graph egress policy open, nothing else changes:
// the adapter's scan() already returns the normalized shape, this maps it into the
// universal contract, and recordScan compares it to history. Every source is just
// another entry in SCANNERS — same contract, same downstream.

import { scan as sharepointScan } from '../adapters/sharepoint.mjs';
import { recordScan } from './snapshot-store.mjs';

// register a Scanner per source — each must return { ok, inventory:[{id,name,modified,size}], reason? }
const SCANNERS = {
  sharepoint: sharepointScan,
  // gdrive: gdriveScan,   gmail: gmailScan,   local: localScan,   ← same contract, added later
};

/** Run a live scan for a source, persist it, and return the Change Feed.
 *  Honest by construction: if the source is not configured or the network is
 *  blocked, it returns that reason — it never fabricates a feed. */
export async function liveChanges(source = 'sharepoint') {
  const scanner = SCANNERS[source];
  if (!scanner) return { ok: false, source, reason: `no scanner registered for "${source}"` };

  const scan = await scanner();
  if (!scan.ok) return { ok: false, source, reason: scan.reason, missing: scan.missing };

  // map the adapter's inventory into the universal contract (it already conforms)
  const inventory = (scan.inventory || []).map((i) => ({
    source, id: i.id, name: i.name, modified: i.modified, size: i.size,
  }));
  return { ok: true, source, ...recordScan({ source, inventory }) };
}
