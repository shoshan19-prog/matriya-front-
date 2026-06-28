// Knowledge Intake — end-to-end demo proving SOURCE-AGNOSTICISM.
// Runs Drive items (from the prior audit) AND a synthetic SharePoint item through
// the SAME Normalizer + Classifier, then prints coverage + orphans. The SharePoint
// item is synthetic ONLY because creds aren't set here; the moment they are, the
// real sharepoint adapter feeds identical raw items into the same pipeline.
//
//   run:  node demo.mjs
//
import { normalize } from './normalizer.mjs';
import { classify, coverage } from './classifier.mjs';
import { validate } from './schema.mjs';
import { fromListing } from './adapters/drive.mjs';
import { isConfigured } from './adapters/sharepoint.mjs';

// --- Drive items (subset of the real Rachel LAB audit; names/paths only) ---
const driveListing = [
  { id: 'g1', title: 'עותק של פורמולציות לטיח תל אביב.xlsx', mimeType: 'spreadsheet', fileSize: '29258', _path: 'Rachel LAB/טיח תל אביב/עותק של פורמולציות לטיח תל אביב.xlsx' },
  { id: 'g2', title: 'בדיקת לחיצה.xlsx', mimeType: 'spreadsheet', fileSize: '40246', _path: 'Rachel LAB/בדיקות מעבדה/בדיקת לחיצה.xlsx' },
  { id: 'g3', title: 'טיח תל אביב תרמי.xlsx', mimeType: 'spreadsheet', fileSize: '29665', _path: 'Rachel LAB/פרויקטים/טיח תל אביב תרמי/טיח תל אביב תרמי.xlsx' },
  { id: 'g4', title: 'SCHLICT_ACRYLIC_EXP_FORMULA_2026-03-15.xlsx', mimeType: 'spreadsheet', fileSize: '26633', _path: 'Rachel LAB/פרויקטים/שליכט/SCHLICT_ACRYLIC...xlsx' },
  { id: 'g5', title: 'קורוזיה 2025.xlsx', mimeType: 'spreadsheet', fileSize: '33000', _path: 'Rachel LAB/פרויקטים/קורוזיה 2025.xlsx' },
  { id: 'g6', title: 'Patcham-brochure.pdf', mimeType: 'pdf', fileSize: '133156', _path: 'Rachel LAB/SDS/Patcham-brochure.pdf' },                 // expected ORPHAN (datasheet)
  { id: 'g7', title: 'הצעת מחיר-FRESCO.pdf', mimeType: 'pdf', fileSize: '133156', _path: 'Rachel LAB/הצעות מחיר/הצעת מחיר.pdf' },                 // expected ORPHAN (quote)
];

// --- one SYNTHETIC SharePoint-shaped item (same shape the real adapter emits) ---
const sharepointRaw = [
  { source_id: 'sp-001', name: 'פורמולציה שפכטל צמנטי v3.xlsx', path: 'Shared Documents/Development/שפכטל צמנטי/פורמולציה v3.xlsx', mime_type: 'spreadsheet', size_bytes: 41000, web_url: 'https://x.sharepoint.com/...' },
];

const fetched_at = '2026-06-26T00:00:00Z';
const docs = [
  ...fromListing(driveListing).map((r) => normalize(r, { system: 'google_drive', site: 'Rachel LAB', collector: 'drive-mcp', fetched_at })),
  ...sharepointRaw.map((r) => normalize(r, { system: 'sharepoint', site: 'Fresco', collector: 'sharepoint-graph', fetched_at })),
].map(classify);

console.log('=== schema validation ===');
const bad = docs.filter((d) => !validate(d).ok);
console.log(`  ${docs.length} docs, ${bad.length} invalid\n`);

console.log('=== two normalized documents (one per source) — proving identical shape ===');
for (const sys of ['google_drive', 'sharepoint']) {
  const d = docs.find((x) => x.source.system === sys);
  console.log(`\n[${sys}]`, JSON.stringify({ doc_id: d.doc_id, name: d.name, doc_type: d.doc_type, product: d.product, source: { system: d.source.system, path: d.source.path }, hash: d.provenance.content_hash }, null, 0));
}

console.log('\n=== coverage by product ===');
const cov = coverage(docs);
for (const p of cov.products) console.log(`  ${p.product.padEnd(22)} ${p.count} doc(s)  [V:${p.verified} P:${p.partial}]  types: ${Object.entries(p.doc_types).map(([k, v]) => k + ':' + v).join(', ')}`);
console.log('\n=== orphans (no product) ===');
for (const o of cov.orphans) console.log(`  ✗ ${o.name}  — ${o.reason}`);
console.log(`\ntotals: ${cov.totals.classified}/${cov.totals.docs} classified, ${cov.totals.orphans} orphan(s)`);

console.log(`\nSharePoint adapter configured in THIS env? ${isConfigured() ? 'YES — real pull available' : 'NO (env vars unset) — synthetic item used; set env + the SAME pipeline pulls real SharePoint'}`);
