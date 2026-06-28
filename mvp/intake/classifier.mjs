// Product Classifier — assigns each NormalizedDocument to a product in the tree,
// with a confidence tag (never invents). Confidence:
//   VERIFIED   product name/code appears in the file NAME
//   PARTIAL    product keyword appears only in the folder PATH
//   UNVERIFIED no match -> candidate ORPHAN
//
// The product registry mirrors PRODUCT_TREE_DOSSIER_INDEX.md. Keywords are
// matched case-insensitively against name (strong) and path (weak).

export const PRODUCTS = [
  { name: 'טיח תל אביב', code: null, keywords: ['טיח תל אביב', 'tel aviv', 'tlv'] },
  { name: 'טיח תל אביב תרמי', code: null, keywords: ['תל אביב תרמי', 'תרמי', 'thermal'] },
  { name: 'טיח מעכב בעירה', code: null, keywords: ['מעכב בעירה', 'fire-retardant', 'igniver'] },
  { name: 'הגנת-אש לפלדה', code: 'BATF-126/VA29', keywords: ['הגנה בפני אש', 'batf', 'va29', 'fire protection'] },
  { name: 'שפכטל צמנטי', code: null, keywords: ['שפכטל צמנטי', 'skim', 'cementitious skim'] },
  { name: 'שליכט W100', code: 'W100', keywords: ['schlict', 'שליכט', 'w100', 'carolith'] },
  { name: 'שליכט הידראולי', code: null, keywords: ['שליכט הידראולי'] },
  { name: 'מקביל לריפרה', code: null, keywords: ['מקביל לריפרה', 'אבוקל', 'natural plaster', 'evocal'] },
  { name: 'טיח איטלקי', code: null, keywords: ['טיח איטלקי', 'italian', 'carrara'] },
  { name: 'צבעים סיליקטיים', code: null, keywords: ['צבעים סיליקט', 'silicate', 'סילוקסן', 'siloxane', 'טרה פנלו'] },
  { name: 'F.SILICATO system', code: 'F.SILICATO/PROTECH/BETONIZE', keywords: ['f.silicato', 'protech', 'betonize', 'סיליקטים'] },
  { name: 'ממברנה PU/acrylic', code: null, keywords: ['ממברנה', 'membrane'] },
  { name: 'Primer אינטומסנטי', code: null, keywords: ['קורוזיה', 'corrosion', 'intumescent', 'primer'] },
];

const NON_PRODUCT = [/sds/i, /tds/i, /הצעת מחיר/, /quote/i, /price/i, /חומרי גלם\b/, /תקן/, /נורמ/, /spectro|ספקטרו/];

// Find the MOST SPECIFIC product match (longest matching keyword) in a haystack,
// so "טיח תל אביב תרמי" beats the substring "טיח תל אביב".
function bestMatch(hay) {
  let best = null;
  for (const p of PRODUCTS) for (const k of p.keywords) {
    const kk = k.toLowerCase();
    if (hay.includes(kk) && (!best || kk.length > best.kw.length)) best = { p, kw: kk };
  }
  return best;
}

export function classify(doc) {
  const name = (doc.name || '').toLowerCase();
  const path = (doc.source?.path || '').toLowerCase();

  const nameHit = bestMatch(name);
  if (nameHit) { doc.product = { name: nameHit.p.name, code: nameHit.p.code, confidence: 'VERIFIED', evidence: `name matches "${nameHit.kw}"` }; return doc; }
  const pathHit = bestMatch(path);
  if (pathHit) { doc.product = { name: pathHit.p.name, code: pathHit.p.code, confidence: 'PARTIAL', evidence: `path contains "${pathHit.kw}"` }; return doc; }

  const orphanReason = NON_PRODUCT.some((re) => re.test(doc.name || '')) ? 'non-product (datasheet/quote/standard)' : 'no product match';
  doc.product = { name: null, code: null, confidence: 'UNVERIFIED', evidence: orphanReason };
  return doc;
}

/** Coverage + orphans over a set of classified docs. */
export function coverage(docs) {
  const byProduct = {};
  const orphans = [];
  for (const d of docs) {
    if (d.product.name) {
      const k = d.product.name;
      byProduct[k] = byProduct[k] || { product: k, code: d.product.code, count: 0, verified: 0, partial: 0, with_strength: 0, doc_types: {} };
      const b = byProduct[k];
      b.count++;
      if (d.product.confidence === 'VERIFIED') b.verified++; else if (d.product.confidence === 'PARTIAL') b.partial++;
      if (d.fields_present.strength) b.with_strength++;
      b.doc_types[d.doc_type] = (b.doc_types[d.doc_type] || 0) + 1;
    } else {
      orphans.push({ name: d.name, doc_type: d.doc_type, reason: d.product.evidence, path: d.source?.path });
    }
  }
  return { products: Object.values(byProduct), orphans, totals: { docs: docs.length, classified: docs.length - orphans.length, orphans: orphans.length } };
}
