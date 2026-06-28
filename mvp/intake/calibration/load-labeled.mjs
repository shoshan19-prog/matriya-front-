// Loads a real human-labeled CSV (Rachel's labels) into the harness format.
// Place the filled file at calibration/labeled-real.csv (gitignored — real data).
// If absent, the harness falls back to the synthetic fixture.
//
// CSV columns: id,file_name,folder_path,content_snippet,gold_product,gold_version,gold_experiment
//   gold_product empty => the correct answer is "orphan / no link".

import { readFileSync, existsSync } from 'node:fs';

// minimal CSV parser (handles "quoted, fields" with commas/newlines)
function parseCSV(text) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (c === '"') q = false; else field += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') { if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = ''; } if (c === '\r' && text[i + 1] === '\n') i++; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

export function loadLabeled(path) {
  const rows = parseCSV(readFileSync(path, 'utf8')).filter((r) => r.some((c) => c.trim() !== ''));
  const header = rows.shift().map((h) => h.trim());
  const idx = (n) => header.indexOf(n);
  return rows.map((r, i) => ({
    id: (r[idx('id')] || `R${i + 1}`).trim(),
    signals: { name: (r[idx('file_name')] || '').trim(), path: ((r[idx('folder_path')] || '').trim() + '/' + (r[idx('file_name')] || '').trim()).replace(/^\//, ''), content: (r[idx('content_snippet')] || '').trim() || null },
    gold: { product: (r[idx('gold_product')] || '').trim() || null, version: (r[idx('gold_version')] || '').trim() || null, experiment: (r[idx('gold_experiment')] || '').trim() || null },
  }));
}

/** Returns real labels if calibration/labeled-real.csv exists, else null. */
export function loadLabeledIfPresent() {
  const p = new URL('./labeled-real.csv', import.meta.url).pathname;
  return existsSync(p) ? loadLabeled(p) : null;
}
