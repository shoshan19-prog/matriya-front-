// Identity Resolution demo — rescuing the orphans the filename-classifier can't.
// These files name NO product; identity is resolved from CONTENT/metadata entities
// + existing relationships (registry). content/metadata here simulate parsed
// xlsx text / PDF text / OCR. Run:  node demo-identity.mjs
//
import { normalize } from './normalizer.mjs';
import { classify } from './classifier.mjs';
import { link } from './linker.mjs';

// previously-ORPHAN lab files (no product in the name) + their parsed content/OCR
const cases = [
  { raw: { source_id: 'sp-10', name: 'בדיקת לחיצה.xlsx', path: 'Shared Documents/בדיקות מעבדה/בדיקת לחיצה.xlsx', mime_type: 'spreadsheet', size_bytes: 40000 },
    content: 'MPZ 15 ... בדיקת לחיצה 28 יום ... תאריך יציקה 14.12.2025 ... שם לבורנט דוד' },
  { raw: { source_id: 'sp-11', name: 'Furnace_Report.pdf', path: 'Shared Documents/Fire/Furnace_Report.pdf', mime_type: 'pdf', size_bytes: 120000 },
    content: 'Fire Test Report. Version 044. INT-TFX-044. Thickness=2000µm. Operator Rachel. 2024-03-11.' },
  { raw: { source_id: 'sp-12', name: 'IMG_3421.jpg', path: 'Shared Documents/Photos/IMG_3421.jpg', mime_type: 'image/jpeg', size_bytes: 2200000 },
    metadata: 'OCR: v043' },                                  // version only, no product → honest low confidence
  { raw: { source_id: 'sp-13', name: 'SEM001.tif', path: 'Shared Documents/SEM/SEM001.tif', mime_type: 'image/tiff', size_bytes: 5000000 },
    /* no content/metadata */ },                              // truly unresolvable → stays orphan
];

const fetched_at = '2026-06-26T00:00:00Z';
for (const c of cases) {
  let d = classify(normalize(c.raw, { system: 'sharepoint', site: 'Fresco', collector: 'sharepoint-graph', fetched_at }));
  d = link(d, { content: c.content, metadata: c.metadata });
  const r = d.identity.resolved;
  console.log(`\n■ ${d.name}`);
  console.log(`  filename-classify: ${d.product?.score != null ? 'was ORPHAN' : (d.product?.name ? 'product=' + d.product.name : 'ORPHAN')}`);
  console.log(`  entities: ${d.identity.entities.map((e) => `${e.type}=${e.value}[${e.signal}]`).join(', ') || '(none)'}`);
  if (r.product) {
    console.log(`  → RESOLVED: ${r.product}  confidence ${r.confidence}` + (r.version ? `  ${r.version}` : '') + (r.experiment ? `  ${r.experiment}` : ''));
    console.log(`     because: ${r.evidence.join(' + ')}`);
    console.log(`     tag: ${d.product.confidence}` + (d.product.score != null ? ` (score ${d.product.score})` : ''));
  } else {
    console.log(`  → UNRESOLVED (stays orphan): ${r.version ? `found ${r.version} but no product link` : 'no identifying entities'}  confidence ${r.confidence}`);
  }
}

console.log('\nThe point: identity comes from ENTITIES (content+metadata+relationships),');
console.log('not the filename. Orphans become "0.93 likely INT-TFX v044 because …",');
console.log('and what truly cannot be resolved stays honestly unresolved.');
