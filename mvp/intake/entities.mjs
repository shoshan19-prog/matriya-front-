// Identity layer — entity EXTRACTION.
//
// The real bottleneck is not "which product does this filename belong to" but
// "which ENTITIES appear inside this file". A lab file (בדיקת לחיצה.xlsx,
// Furnace_Report.pdf, SEM001.tif) names no product, yet contains version ids,
// experiment ids, dates, operators, formula ids. We extract those from FIVE
// signals, each carrying a weight (filename low → existing-relationships highest).

export const SIGNAL_WEIGHT = { name: 0.10, path: 0.30, content: 0.60, metadata: 0.60, relationship: 0.90 };

const PATTERNS = [
  // type, regex (global), normalizer
  ['version', /\b[vV]\.?\s?0*(\d{1,3})\b/g, (m) => 'v' + String(+m[1]).padStart(3, '0')],
  ['version', /(?:גרסה|version|ערבוב)\s*0*(\d{1,3})/gi, (m) => 'v' + String(+m[1]).padStart(3, '0')],
  ['product_code', /\b(INT-?TFX|ISM-?\d+|BATF-?\d+|VA\s?29|W100|MPZ\s?\d+(?:\.\d+)?|F\.?\s?SILICATO|PROTECH-?A?1?|BETONIZE\s?2030[AB]?)\b/gi, (m) => m[1].toUpperCase().replace(/\s+/g, '')],
  ['experiment_id', /\b([A-Z]{2,5}-\d{2,4}(?:-\d{1,3})?)\b/g, (m) => m[1].toUpperCase()],
  ['date', /\b(\d{4}-\d{2}-\d{2})\b/g, (m) => m[1]],
  ['date', /\b(\d{2}[./]\d{2}[./]\d{2,4})\b/g, (m) => m[1].replace(/\//g, '.')],
  ['operator', /(?:operator|לבורנט|שם לבורנט)\s*[:,]?\s*([A-Za-z֐-׿]{2,})/gi, (m) => m[1]],
  ['formula_id', /(?:נוסחה|formula(?:\s*id)?)\s*0*(\d{1,3})/gi, (m) => 'f' + (+m[1])],
  ['batch_id', /(?:מנה|batch)\s*(?:מס'?\s*)?0*(\d{1,4})/gi, (m) => 'b' + (+m[1])],
  ['lab_sample', /(?:מספר דוגמ[אה]|sample(?:\s*id)?)\s*[:#]?\s*0*(\d{1,4})/gi, (m) => 's' + (+m[1])],
  ['measurement', /(\d+(?:\.\d+)?)\s?(µm|um|MPa|cps|CPS|°C|%RH)/g, (m) => `${m[1]}${m[2]}`], // evidence, not identity
];

/** signals = { name, path, content, metadata } (any may be absent). */
export function extractEntities(signals = {}) {
  const out = [];
  for (const [field, weight] of Object.entries(SIGNAL_WEIGHT)) {
    if (field === 'relationship') continue;                 // relationship signal is added by the resolver
    const text = signals[field];
    if (typeof text !== 'string' || !text) continue;
    for (const [type, re, norm] of PATTERNS) {
      re.lastIndex = 0; let m;
      while ((m = re.exec(text))) {
        const value = norm(m);
        if (value) out.push({ type, value, signal: field, weight });
      }
    }
  }
  // dedupe by (type,value,signal)
  const seen = new Set();
  return out.filter((e) => { const k = `${e.type}|${e.value}|${e.signal}`; if (seen.has(k)) return false; seen.add(k); return true; });
}
