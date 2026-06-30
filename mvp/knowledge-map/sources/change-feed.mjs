// CHANGE FEED — the timestamped stream the museum guard hands to the curator.
//
//   09:14  NEW      TLV_Report_44.pdf
//   09:51  UPDATED  Burn_Test_18.xlsx
//   --     DELETED  Old_Color_Report.docx
//
// The feed is the universal hand-off point: everything upstream (which source,
// how it was scanned) is gone; everything downstream (Provenance → Qualification
// → … → Law) consumes the SAME feed regardless of origin. A source adapter's only
// job is to produce a normalized inventory; the feed and the whole Knowledge
// Pipeline never change when the source does.

import { detectChanges, changeSummary, CHANGE } from './change-detector.mjs';

const hhmm = (iso) => (iso && /\d{2}:\d{2}/.test(iso)) ? iso.slice(11, 16) : '--';

/** Build the Change Feed from two snapshots: a list of actionable change events,
 *  ordered by time, UNCHANGED dropped. Pure data — no wall clock needed. */
export function buildFeed(previous, current) {
  const changes = detectChanges(previous, current);
  const events = changes
    .filter((c) => c.status !== CHANGE.UNCHANGED)
    // a deletion's timestamp is "when we noticed it gone", not the file's old edit
    // time — so DELETED shows '--' rather than a misleading stale modified time.
    .map((c) => ({ time: c.status === CHANGE.DELETED ? '--' : hhmm(c.modified), status: c.status, name: c.name, source: c.source, id: c.id }))
    .sort((a, b) => (a.time === '--' ? '99:99' : a.time).localeCompare(b.time === '--' ? '99:99' : b.time));
  return { events, summary: changeSummary(changes), changes };
}

export function renderFeed(feed) {
  const L = [];
  for (const e of feed.events) {
    L.push(`  ${e.time.padEnd(5)} ${e.status.padEnd(8)} ${e.name}   [${e.source}]`);
    L.push('  ' + '─'.repeat(40));
  }
  return L.join('\n');
}

/** The hand-off contract to the Knowledge Pipeline: only changed items, normalized,
 *  with WHY they are here. Does NOT decide if the change matters — that is the
 *  pipeline's question ("does this change knowledge?"). Governance preserved:
 *  produces candidates for review, never auto-ingests. */
export function feedToPipeline(feed) {
  return feed.events.map((e) => ({ changeId: e.id, source: e.source, name: e.name, change: e.status,
    handoff: 'candidate for the Knowledge Pipeline — does this change knowledge? (human-reviewed, never auto-ingested)' }));
}

// ── sample snapshots: yesterday vs today, ACROSS DIFFERENT SOURCES ───────────
// Proves universality: the SAME detector classifies SharePoint, Google Drive,
// Gmail and a local folder identically. The day Graph opens, only the source of
// these inventories changes — not a line of the detector or the feed.
export const SNAPSHOT_YESTERDAY = [
  { source: 'sharepoint', id: 's1', name: 'TLV_Report_44.pdf',     modified: '2026-06-28T16:00', size: 120 },
  { source: 'sharepoint', id: 's2', name: 'Burn_Test_18.xlsx',     modified: '2026-06-28T10:00', size: 88 },
  { source: 'gdrive',     id: 'g1', name: 'Old_Color_Report.docx', modified: '2026-06-20T09:00', size: 40 },
  { source: 'gmail',      id: 'm1', name: 'Supplier COA email',    modified: '2026-06-27T12:00', size: 12 },
];
export const SNAPSHOT_TODAY = [
  { source: 'sharepoint', id: 's1', name: 'TLV_Report_44.pdf',     modified: '2026-06-29T09:14', size: 140 }, // UPDATED (size+time)
  { source: 'sharepoint', id: 's2', name: 'Burn_Test_18.xlsx',     modified: '2026-06-28T10:00', size: 88 },  // UNCHANGED
  { source: 'gmail',      id: 'm1', name: 'Supplier COA email',    modified: '2026-06-27T12:00', size: 12 },  // UNCHANGED
  { source: 'local',      id: 'l9', name: 'MPZ_Dec2025_strength.csv', modified: '2026-06-29T09:51', size: 30 }, // NEW
  // g1 absent today → DELETED
];
