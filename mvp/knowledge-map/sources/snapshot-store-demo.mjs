// The persistent snapshot store — "today vs the LAST scan", against real history.
//   run: node snapshot-store-demo.mjs
// Uses a throwaway data dir so it leaves no trace.
import { recordScan } from './snapshot-store.mjs';
import { renderFeed } from './change-feed.mjs';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const dir = mkdtempSync(tmpdir() + '/matriya-snap-');
const show = (label, r) => {
  const s = r.feed.summary;
  console.log(`\n  ── ${label} (${r.takenAt})${r.firstScan ? '  [first scan — BASELINE, not a flood]' : `  vs ${r.prevTakenAt}`} ──`);
  console.log(r.feed.events.length ? renderFeed(r.feed) : '    (no changes since the last scan)');
  console.log(`    NEW ${s.NEW} · UPDATED ${s.UPDATED} · DELETED ${s.DELETED} · UNCHANGED ${s.UNCHANGED}`);
};

console.log('\n═══ PERSISTENT SNAPSHOT STORE — append-only history per source ═══');

// scan 1 — Monday: first ever scan → everything is the BASELINE
const monday = [
  { source: 'sharepoint', id: 's1', name: 'TLV_Report_44.pdf', modified: '2026-06-29T16:00', size: 120 },
  { source: 'sharepoint', id: 's2', name: 'Burn_Test_18.xlsx', modified: '2026-06-29T10:00', size: 88 },
];
show('Monday scan', recordScan({ source: 'sharepoint', inventory: monday, takenAt: '2026-06-29T18:00', dir }));

// scan 2 — Tuesday: one edited, one new, one gone → the real daily delta vs history
const tuesday = [
  { source: 'sharepoint', id: 's1', name: 'TLV_Report_44.pdf', modified: '2026-06-30T09:14', size: 140 }, // UPDATED
  { source: 'sharepoint', id: 's3', name: 'MPZ_strength_Dec.xlsx', modified: '2026-06-30T09:51', size: 30 }, // NEW
  // s2 gone → DELETED
];
show('Tuesday scan', recordScan({ source: 'sharepoint', inventory: tuesday, takenAt: '2026-06-30T18:00', dir }));

// scan 3 — Wednesday: nothing moved → an empty, honest feed
show('Wednesday scan', recordScan({ source: 'sharepoint', inventory: tuesday, takenAt: '2026-07-01T18:00', dir }));

rmSync(dir, { recursive: true, force: true });
console.log('\n  ⇒ each scan compares to the LAST persisted one (append-only history); the first is a baseline,');
console.log('    later scans yield the true daily delta, and a quiet day yields an empty feed — no invention.');
console.log('    Wire a real Scanner into recordScan() and `matriya changes` answers "what\'s new" for real.\n');
