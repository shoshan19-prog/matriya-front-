// Organizational process model — the STAGES an episode passed through.
//
// The Learning Pattern Engine does not reason about the material (cement, lime).
// It reasons about Fresco's *process*: which stages a decision cycle went
// through, and how those stages relate to outcomes. This module turns an
// Episode (+ its docs) into a set of process STAGES and an OUTCOME — the raw
// material the pattern miner consumes. Built on Episodes + evidence, never on
// assumptions: every stage is asserted only from a marker actually present.

// Canonical stage vocabulary (the "moves" an R&D cycle can make).
export const STAGE = {
  FIELD_REPORT:        'FIELD_REPORT',        // feedback from a real wall / site
  MEETING:             'MEETING',             // a decision / summary meeting
  SUPPLIER_CHANGE:     'SUPPLIER_CHANGE',     // a raw-material / supplier swap
  LAB_TRIAL:           'LAB_TRIAL',           // a mix prepared in the lab
  MEASURE_COMPRESSION: 'MEASURE_COMPRESSION', // 28-day strength etc.
  MEASURE_VISCOSITY:   'MEASURE_VISCOSITY',
  MEASURE_SEM:         'MEASURE_SEM',         // microstructure
  DECISION:            'DECISION',
  PRODUCTION:          'PRODUCTION',
};

// canonical ordering, used only to render a stage SET as a readable path
export const STAGE_ORDER = [
  STAGE.FIELD_REPORT, STAGE.MEETING, STAGE.SUPPLIER_CHANGE, STAGE.LAB_TRIAL,
  STAGE.MEASURE_COMPRESSION, STAGE.MEASURE_VISCOSITY, STAGE.MEASURE_SEM,
  STAGE.DECISION, STAGE.PRODUCTION,
];

const any = (re, t) => re.test(t);

/** Derive the process stages an episode passed through, from real markers only. */
export function extractStages(ep, docs = []) {
  const epDocs = docs.filter((d) => (ep.documents || []).includes(d.id));
  const text = epDocs.map((d) => d.content || '').join('  ');
  const s = new Set();

  // measurements — from extracted result units (hard evidence) or text
  for (const r of ep.results || []) {
    if (/MPa/i.test(r.unit)) s.add(STAGE.MEASURE_COMPRESSION);
    if (/cps/i.test(r.unit)) s.add(STAGE.MEASURE_VISCOSITY);
    if (/µm|um/i.test(r.unit)) s.add(STAGE.MEASURE_SEM);
  }
  if (any(/SEM|מיקרוסקופ|microstructure/i, text)) s.add(STAGE.MEASURE_SEM);
  if (any(/צמיגות|viscosit|brookfield|cps/i, text)) s.add(STAGE.MEASURE_VISCOSITY);
  if (any(/לחיצה|compress|חוזק|MPa/i, text)) s.add(STAGE.MEASURE_COMPRESSION);

  if (any(/קיר|בחוץ|בשטח|סדק|field|wall|application/i, text)) s.add(STAGE.FIELD_REPORT);
  if (any(/ישיב|meeting|סיכום|אריק|נפגש/i, text)) s.add(STAGE.MEETING);
  if (any(/ספק|supplier|החלפת|צמיתות|כפר גלעדי|COA/i, text)) s.add(STAGE.SUPPLIER_CHANGE);
  if (any(/פיילוט|ערבוב|מנה|mix|trial|מרשם|premix|פרמיקס/i, text) || epDocs.length) s.add(STAGE.LAB_TRIAL);
  if (any(/ייצור|production|אושר לייצור|תפזורת|לשק/i, text)) s.add(STAGE.PRODUCTION);
  if (ep.decision && ep.decision.outcome !== 'open') s.add(STAGE.DECISION);

  return [...s].sort((a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b));
}

/** Outcome label the pattern miner uses. retrial = rejected with a successor trial. */
export function classifyOutcome(ep, { hasSuccessor = false } = {}) {
  const o = ep.decision?.outcome;
  if (o === 'accepted') return 'accepted';
  if (o === 'rejected') return hasSuccessor ? 'retrial' : 'rejected';
  return 'open';
}

/** Render a stage set as a readable path. */
export const renderPath = (stages) =>
  [...stages].sort((a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b)).join(' → ');
