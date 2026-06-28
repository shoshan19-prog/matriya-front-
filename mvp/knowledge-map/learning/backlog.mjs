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
// Today: the טיח תל אביב reconstruction (decision spine EP-01..07), one product
// family (restoration plaster), one production decision (14.12.2022-002 → bag).
export const LEDGER = {
  episodes: 7,
  families: 1,                 // restoration plaster
  productionDecisions: 1,      // 14.12.2022-002 approved to bag
  byProduct: [
    { product: 'טיח תל אביב', family: 'restoration plaster', episodes: 7, productionDecisions: 1, status: 'started' },
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
    current_support: 0, kind: 'step-skip→retrial', note: 'אין ולו Episode אחד עם SEM בקורפוס הנוכחי — לא ניתן לבדוק עדיין.' },
  { id: 'OLH-3', source: 'expert',
    statement: 'החלטות שהסתמכו רק על מדידת צמיגות (בלי חוזק) הסתיימו לעיתים קרובות בניסוי נוסף.',
    current_support: 1, kind: 'measurement→outcome', note: 'נצפה בווריאנט התרמי; צריך עוד מקרים.' },
  { id: 'OLH-4', source: 'expert',
    statement: 'שילוב משוב שטח + תוצאת מעבדה לפני שינוי פורמולציה → שיעור הצלחה גבוה יותר.',
    current_support: 1, kind: 'pair→success', note: 'ב-TLV המדידה היתה ריקה — אי-אפשר לאשש את צד-המעבדה.' },
  { id: 'OLH-5', source: 'engine',
    statement: 'מספר הניסויים עד הקפאת פורמולציה מתכנס לטווח אופייני.',
    current_support: 1, kind: 'trials-to-freeze', note: 'TLV ~15 פיילוטים → נקודת-נתון אחת.' },
  { id: 'OLH-6', source: 'expert',
    statement: 'החלפת ספק מתרחשת כשבדיקות איכות (ניפוי/COA) מראות חוסר-עקביות בפרקציות.',
    current_support: 1, kind: 'trigger→action', note: 'צמיתות→כפר גלעדי.' },
  { id: 'OLH-7', source: 'expert',
    statement: 'דילוג על אפיון ספיגת-מים לפני בחירת אגרגט קל → כשל חוזר.',
    current_support: 1, kind: 'step-skip→failure', note: 'שרשרת הכשלים של הווריאנט התרמי.' },
];

// ── Extraction plan to clear the gate (projected episode yield, not invented data). ──
export const EXTRACTION_PLAN = [
  { product: 'טיח תל אביב', family: 'restoration plaster', projected_episodes: 7, projected_prod: 1, status: 'done' },
  { product: 'INT-TFX', family: 'INT-TFX', projected_episodes: 9, projected_prod: 2, status: 'todo' },
  { product: 'MPZ / חומרים צמנטיים', family: 'cementitious', projected_episodes: 9, projected_prod: 2, status: 'todo' },
  { product: 'טיח תל אביב תרמי (נעצר)', family: 'restoration plaster', projected_episodes: 7, projected_prod: 0, status: 'todo (halted product — negative knowledge)' },
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
  // projected ledger if the whole plan is executed
  const projected = EXTRACTION_PLAN.reduce(
    (a, p) => ({ episodes: a.episodes + p.projected_episodes, prod: a.prod + p.projected_prod,
                 families: new Set([...a.families, p.family]) }),
    { episodes: 0, prod: 0, families: new Set() });
  return { gate, gate_open: open, hyps,
    projected: { episodes: projected.episodes, families: projected.families.size, productionDecisions: projected.prod } };
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

  console.log('\n  EXTRACTION PLAN → projected ledger if executed:');
  for (const p of EXTRACTION_PLAN)
    console.log(`    • ${p.product.padEnd(28)} +${p.projected_episodes} ep / +${p.projected_prod} prod   [${p.status}]`);
  console.log(`    ── projected total: ${a.projected.episodes} episodes · ${a.projected.families} families · ${a.projected.productionDecisions} production decisions`);
  const ok = a.projected.episodes >= PROMOTION_GATE.episodes && a.projected.families >= PROMOTION_GATE.families && a.projected.productionDecisions >= PROMOTION_GATE.productionDecisions;
  console.log(`    ${ok ? '✓ executing the full plan CLEARS the gate.' : '✗ plan still short of the gate.'}`);

  console.log('\n  Until the gate opens, every row above is an HONEST HYPOTHESIS awaiting volume —');
  console.log('  not a proven organizational pattern. That restraint is the deliverable.');
}
