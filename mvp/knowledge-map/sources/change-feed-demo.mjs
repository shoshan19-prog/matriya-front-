// The Universal Change Detector + Change Feed — source-agnostic "what changed?".
//   run: node change-feed-demo.mjs
import { detectChanges, signatureOf } from './change-detector.mjs';
import { buildFeed, renderFeed, feedToPipeline, SNAPSHOT_YESTERDAY, SNAPSHOT_TODAY } from './change-feed.mjs';

console.log('\n═══ UNIVERSAL CHANGE DETECTOR — the museum guard ═══\n');
console.log('  knows nothing about the paintings; only "this was not here yesterday" / "someone moved it".');
console.log('  contract: a source need only produce { source, id, name, modified, size?, hash?, etag? }\n');

const feed = buildFeed(SNAPSHOT_YESTERDAY, SNAPSHOT_TODAY);
console.log('  Change Feed (yesterday → today):');
console.log(renderFeed(feed));
const s = feed.summary;
console.log(`\n  NEW ${s.NEW} · UPDATED ${s.UPDATED} · DELETED ${s.DELETED} · UNCHANGED ${s.UNCHANGED}  (actionable ${s.actionable})`);
console.log(`  by source: ${s.bySource.map((b) => `${b.source} ${b.changed}`).join(' · ')}`);

console.log('\n═══ SOURCE-AGNOSTIC — the SAME detector, four different origins ═══\n');
console.log('  the changes above span sharepoint · gdrive · gmail · local — detected identically.');
console.log('  the only thing that ever changes per source is the Scanner that produces the inventory.\n');

console.log('  proof it is blind to content (museum guard sees the signature, not the painting):');
const a = { source: 'x', id: '1', name: 'f.pdf', modified: '2026-06-29T09:00', size: 10 };
const b = { ...a, asset: 'Compression Strength', value: 23.83, secret: 'xyz' };
console.log(`    signature(plain)         = ${signatureOf(a)}`);
console.log(`    signature(+content/value)= ${signatureOf(b)}   → identical: ${signatureOf(a) === signatureOf(b)}`);
console.log(`    detect([a],[b]) = ${detectChanges([a], [b])[0].status}  (content fields cannot fake a change)`);

console.log('\n═══ HAND-OFF — each change becomes a Knowledge-Pipeline candidate ═══\n');
for (const h of feedToPipeline(feed)) console.log(`  ${h.change.padEnd(8)} ${h.name.padEnd(28)} [${h.source}] → ${h.handoff}`);
console.log('\n  the feed answers "what changed?"; the pipeline then asks "does this change KNOWLEDGE?"');
console.log('  — never auto-ingested. The day Microsoft Graph opens, swap the Scanner; nothing else moves.\n');
