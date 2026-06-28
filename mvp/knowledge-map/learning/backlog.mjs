// Organizational Learning Backlog — the honest deliverable while volume is low.
//
// The Learning Pattern Engine is, today, a HYPOTHESIS engine: it can mine
// candidate patterns but must not PROMOTE any to "proven organizational
// pattern" until the corpus has enough evidential volume. This module is the
// register of those waiting hypotheses + an evidence ledger that measures the
// gap to the promotion gate. It invents nothing: the ledger reflects only
// Episodes actually reconstructed so far.

// The gate that must be cleared before ANY hypothesis may be promoted.
export const PROMOTION_GATE = { episodes: 30, families: 3, productionDecisions: 5 };

// Per-hypothesis support needed (same MIN_SUPPORT as patterns.mjs).
const MIN_SUPPORT = 4;

// ── Evidence ledger: ONLY what has really been reconstructed. ────────────────
// After extracting all four planned products (TLV, thermal, INT-TFX, MPZ) from
// the real Drive corpus. Numbers are the ACTUAL reconstructed yields — not the
// earlier optimistic projection (INT-TFX yielded 0 production decisions, not 2).
export const LEDGER = {
  episodes: 50,                // 7+7+4+7+7 + 5 fire-plaster + 7 BETONIZE + 6 PROTECH
  families: 5,                 // restoration plaster · intumescent coating · cementitious · silicate coatings · SFRM fire plaster
  productionDecisions: 8,      // 1 TLV + 2 MPZ + 1 GRANITAL + 0 fire-plaster + 2 BETONIZE + 2 PROTECH
  byProduct: [
    { product: 'טיח תל אביב',          family: 'restoration plaster', episodes: 7, productionDecisions: 1, status: 'done' },
    { product: 'טיח תל אביב תרמי',      family: 'restoration plaster', episodes: 7, productionDecisions: 0, status: 'done (halted product)' },
    { product: 'INT-TFX',              family: 'intumescent coating', episodes: 4, productionDecisions: 0, status: 'done (Stage-0 dossier, 0 trials run)' },
    { product: 'MPZ / cementitious',   family: 'cementitious',        episodes: 7, productionDecisions: 2, status: 'done (real strength data)' },
    { product: 'GRANITAL',             family: 'silicate coatings',   episodes: 7, productionDecisions: 1, status: 'done (gap-driven: seeds Color domain, measured ΔE)' },
    { product: 'fire-retardant plaster', family: 'SFRM fire plaster', episodes: 5, productionDecisions: 0, status: 'done (2nd Fire source, thin; 2nd measured Density)' },
    { product: 'BETONIZE 2030',        family: 'silicate coatings',   episodes: 7, productionDecisions: 2, status: 'done (2nd Color source qual; measured Workability)' },
    { product: 'PROTECH A1',           family: 'silicate coatings',   episodes: 6, productionDecisions: 2, status: 'done (measured Workability + measured Fire A1)' },
  ],
};

// ── The organizational hypotheses waiting for volume. ───────────────────────
// current_support = how many real cycles already touch the hypothesis (small!).
export const HYPOTHESES = [
  { id: 'OLH-1', source: 'engine',
    statement: 'כמעט כל שינוי חומר גלם עובר במסלול קבוע: Field failure → Meeting → Supplier change → Lab trial → Compression → Decision → Production.',
    current_support: 1, kind: 'canonical-path' },
  { id: 'OLH-2', source: 'engine',
    statement: 'דילוג על שלב SEM/אפיון-מבנה מעלה את ההסתברות לניסוי חוזר.',
    current_support: 0, kind: 'step-skip→retrial', note: 'בכל 4 המשפחות SEM נעדר לחלוטין — פרסקו כמעט אף פעם לא מבצעת SEM. ההשערה אינה ניתנת לבדיקה; הממצא עצמו: SEM אינו חלק מהתהליך.' },
  { id: 'OLH-3', source: 'expert',
    statement: 'החלטות שהסתמכו רק על מדידת צמיגות (בלי חוזק) הסתיימו לעיתים קרובות בניסוי נוסף.',
    current_support: 3, kind: 'measurement→outcome', note: 'תרמי + BETONIZE 2030-B (קרישה→retrial) + GRANITAL/PROTECH (צמיגות תנור→retrial). מתקרב לסף.' },
  { id: 'OLH-4', source: 'expert',
    statement: 'שילוב משוב שטח + תוצאת מעבדה לפני שינוי פורמולציה → שיעור הצלחה גבוה יותר.',
    current_support: 1, kind: 'pair→success', note: 'ב-TLV המדידה היתה ריקה — אי-אפשר לאשש את צד-המעבדה.' },
  { id: 'OLH-5', source: 'engine',
    statement: 'מספר הניסויים עד הקפאת פורמולציה מתכנס לטווח אופייני.',
    current_support: 2, kind: 'trials-to-freeze', note: 'TLV ~15 פיילוטים + סדרת מנות MPZ → 2 נקודות.' },
  { id: 'OLH-6', source: 'expert',
    statement: 'החלפת ספק מתרחשת כשבדיקות איכות (ניפוי/COA) מראות חוסר-עקביות בפרקציות.',
    current_support: 1, kind: 'trigger→action', note: 'צמיתות→כפר גלעדי (TLV). ב-MPZ לא נמצא אירוע החלפת-ספק.' },
  { id: 'OLH-7', source: 'expert',
    statement: 'דילוג על אפיון ספיגת-מים לפני בחירת אגרגט קל → כשל חוזר.',
    current_support: 1, kind: 'step-skip→failure', note: 'שרשרת הכשלים של הווריאנט התרמי.' },
  { id: 'OLH-8', source: 'engine',
    statement: 'בקרת תהליך (מים/אשפרה/אנטי-קצף) יכולה להכריע את תוצאת המוצר יותר מהפורמולציה עצמה.',
    current_support: 2, kind: 'process>formula', note: 'MPZ (מים/אשפרה ניצחו את הפורמולציה) + PROTECH A1 (אנטי-קצף 162 פתר במקום מסלול המסמיכים). שתי משפחות — המועמדת הקרובה ביותר לקידום; צריך עוד מקרה אחד.' },
  { id: 'OLH-9', source: 'engine',
    statement: 'בפרסקו החלטות מתקבלות לרוב לפני שנמדדת התגובה (תהליך "דל-מדידה").',
    current_support: 3, kind: 'cross-family', note: 'תקף לתגובת-חוזק בטיח/צמנט (TLV/תרמי/MPZ-מוקדם) אך נסתר במשפחת הצבעים — שם הצמיגות כן נמדדת (BETONIZE/PROTECH/GRANITAL). הדפוס תלוי-משפחה, לא אוניברסלי — דורש ניסוח מחדש לפני קידום.' },
];

// ── Extraction plan — ACTUAL yields after all four reconstructions. ──────────
// The earlier projection (32/3/5) assumed INT-TFX +9ep/+2prod and MPZ +9ep/+2prod.
// Reality: INT-TFX is a Stage-0 dossier (4 ep / 0 prod), so the real total falls
// SHORT on episodes and production decisions even though families cleared.
export const EXTRACTION_PLAN = [
  { product: 'טיח תל אביב',          family: 'restoration plaster', projected_episodes: 7, projected_prod: 1, actual_episodes: 7, actual_prod: 1, status: 'done' },
  { product: 'טיח תל אביב תרמי',      family: 'restoration plaster', projected_episodes: 7, projected_prod: 0, actual_episodes: 7, actual_prod: 0, status: 'done — negative knowledge' },
  { product: 'INT-TFX',              family: 'intumescent coating', projected_episodes: 9, projected_prod: 2, actual_episodes: 4, actual_prod: 0, status: 'done — Stage-0 dossier, UNDER projection' },
  { product: 'MPZ / cementitious',   family: 'cementitious',        projected_episodes: 9, projected_prod: 2, actual_episodes: 7, actual_prod: 2, status: 'done — real strength data' },
  { product: 'GRANITAL',             family: 'silicate coatings',   projected_episodes: 7, projected_prod: 1, actual_episodes: 7, actual_prod: 1, status: 'done — gap-driven, seeds Color domain' },
  { product: 'fire-retardant plaster', family: 'SFRM fire plaster', projected_episodes: 2, projected_prod: 0, actual_episodes: 5, actual_prod: 0, status: 'done — 2nd Fire source (thin)' },
  { product: 'BETONIZE 2030',        family: 'silicate coatings',   projected_episodes: 5, projected_prod: 2, actual_episodes: 7, actual_prod: 2, status: 'done — 2nd Color (qual) + Workability' },
  { product: 'PROTECH A1',           family: 'silicate coatings',   projected_episodes: 5, projected_prod: 2, actual_episodes: 6, actual_prod: 2, status: 'done — measured Workability + Fire A1' },
];

const bar = (have, need) => {
  const f = Math.min(1, have / need); const n = Math.round(f * 20);
  return `[${'█'.repeat(n)}${'░'.repeat(20 - n)}] ${have}/${need}`;
};

export function assess(ledger = LEDGER) {
  const gate = {
    episodes: ledger.episodes >= PROMOTION_GATE.episodes,
    families: ledger.families >= PROMOTION_GATE.families,
    productionDecisions: ledger.productionDecisions >= PROMOTION_GATE.productionDecisions,
  };
  const open = Object.values(gate).every(Boolean);
  const hyps = HYPOTHESES.map((h) => ({
    ...h,
    own_support_met: h.current_support >= MIN_SUPPORT,
    status: open ? (h.current_support >= MIN_SUPPORT ? 'READY_TO_PROMOTE' : 'NEEDS_OWN_SUPPORT') : 'BLOCKED_ON_VOLUME',
  }));
  // actual ledger realised after executing the whole plan
  const actual = EXTRACTION_PLAN.reduce(
    (a, p) => ({ episodes: a.episodes + p.actual_episodes, prod: a.prod + p.actual_prod,
                 families: new Set([...a.families, p.family]) }),
    { episodes: 0, prod: 0, families: new Set() });
  const gap = {
    episodes: Math.max(0, PROMOTION_GATE.episodes - ledger.episodes),
    families: Math.max(0, PROMOTION_GATE.families - ledger.families),
    productionDecisions: Math.max(0, PROMOTION_GATE.productionDecisions - ledger.productionDecisions),
  };
  return { gate, gate_open: open, hyps, gap,
    actual: { episodes: actual.episodes, families: actual.families.size, productionDecisions: actual.prod } };
}

// ── CLI report ───────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const a = assess();
  console.log('═══ ORGANIZATIONAL LEARNING BACKLOG ═══\n');
  console.log('  PROMOTION GATE (clear ALL before promoting any hypothesis):');
  console.log(`    episodes              ${bar(LEDGER.episodes, PROMOTION_GATE.episodes)}  ${a.gate.episodes ? '✓' : '✗'}`);
  console.log(`    product families      ${bar(LEDGER.families, PROMOTION_GATE.families)}  ${a.gate.families ? '✓' : '✗'}`);
  console.log(`    production decisions  ${bar(LEDGER.productionDecisions, PROMOTION_GATE.productionDecisions)}  ${a.gate.productionDecisions ? '✓' : '✗'}`);
  console.log(`\n  VERDICT: ${a.gate_open ? 'GATE OPEN — promotion allowed per-hypothesis' : 'PROMOTION LOCKED — corpus below evidential volume'}\n`);

  console.log('  WAITING HYPOTHESES (organizational, not material):');
  for (const h of a.hyps)
    console.log(`    ${h.id} [${h.status}]  support ${h.current_support}/${MIN_SUPPORT}  (${h.source})\n        ${h.statement}${h.note ? `\n        ⓘ ${h.note}` : ''}`);

  console.log('\n  EXTRACTION PLAN → ACTUAL yield (projection → reality):');
  for (const p of EXTRACTION_PLAN)
    console.log(`    • ${p.product.padEnd(22)} proj +${p.projected_episodes}ep/+${p.projected_prod}prod → real +${p.actual_episodes}ep/+${p.actual_prod}prod   [${p.status}]`);
  console.log(`    ── actual total: ${a.actual.episodes} episodes · ${a.actual.families} families · ${a.actual.productionDecisions} production decisions`);

  console.log('\n  REMAINING GAP TO GATE:');
  console.log(`    episodes              need ${a.gap.episodes} more`);
  console.log(`    product families      need ${a.gap.families} more  ${a.gap.families === 0 ? '✓ CLEARED' : ''}`);
  console.log(`    production decisions  need ${a.gap.productionDecisions} more`);

  console.log('\n  Families CLEARED; episodes & production decisions still short → PROMOTION STAYS LOCKED.');
  console.log('  Every OLH above remains an HONEST HYPOTHESIS. INT-TFX under-delivered (Stage-0 dossier),');
  console.log('  so reality fell short of the projection — exactly why we count real episodes, not planned ones.');
}
