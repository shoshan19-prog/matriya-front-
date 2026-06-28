// Normalizer — maps a raw item from ANY adapter into a NormalizedDocument.
// Source-agnostic: the only thing that differs per source is the adapter that
// produced the raw item; the normalized shape is identical.

import { createHash } from 'node:crypto';
import { emptyDoc, docId, FIELD_FLAGS } from './schema.mjs';

const ext = (n = '') => (n.split('.').pop() || '').toLowerCase();

function docType(name) {
  const e = ext(name), n = name.toLowerCase();
  if (/formul|פורמולצ|recipe|תערוב|הרבצה/.test(n)) return 'formulation';
  if (/לחיצה|compress|strength|בדיקת/.test(n)) return 'lab_test';
  if (e === 'pdf' && /sds|tds|msds/.test(n)) return 'datasheet';
  if (/הצעת מחיר|quote|price/.test(n)) return 'quote';
  if (['jpg', 'jpeg', 'png', 'gif', 'tif'].includes(e)) return 'image';
  if (['xlsx', 'xls', 'xlsm'].includes(e)) return 'spreadsheet';
  if (['docx', 'doc'].includes(e)) return 'document';
  return 'other';
}

/**
 * raw: { source_id, name, path, mime_type, size_bytes, web_url, content_hash?, text? }
 * opts: { system, site, collector }
 * If raw.text is provided (optional content peek), field flags are detected from it;
 * otherwise fields_present stays all-false (honest: unknown, not guessed).
 */
export function normalize(raw, { system, site = null, collector = 'unknown', fetched_at }) {
  const d = emptyDoc();
  d.source = { system, site, path: raw.path || null, source_id: raw.source_id, web_url: raw.web_url || null };
  d.doc_id = docId(system, raw.source_id);
  d.name = raw.name;
  d.mime_type = raw.mime_type || null;
  d.size_bytes = raw.size_bytes ?? null;
  d.doc_type = docType(raw.name || '');
  d.provenance = {
    fetched_at: fetched_at || null,
    content_hash: raw.content_hash || createHash('sha256').update(`${raw.source_id}|${raw.size_bytes ?? ''}|${raw.name}`).digest('hex').slice(0, 16),
    collector,
  };
  if (typeof raw.text === 'string' && raw.text) {
    const t = raw.text;
    d.fields_present = {
      composition: /חומר|material|ingredient|אבקות/.test(t),
      percentages: /%|אחוז/.test(t),
      psd: /0-0\.8|0\.8-1\.4|1\.4-2\.5|נפה|גרנול|granul|sieve/.test(t),
      water_powder: /מים|w\/p|water|דילול/.test(t),
      process: /עירבוב|דקות|rpm|ערבוב|mixing|curing/i.test(t),
      strength: /\bMPa\b|לחיצה|compress/.test(t),
      dates: /\d{2}[./]\d{2}[./]\d{2,4}/.test(t),
    };
    d.versions = [...new Set((t.match(/\d{2}[./]\d{2}[./]\d{2,4}(?:-\d+)?/g) || []).slice(0, 8))];
  }
  // ensure all flags exist
  for (const f of FIELD_FLAGS) if (!(f in d.fields_present)) d.fields_present[f] = false;
  return d;
}
