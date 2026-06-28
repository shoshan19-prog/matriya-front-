// Episode Builder → observe() → Trust Engine — the matrix learns itself.
// run: node demo-learn.mjs
//
// Same shape as the real טיח תל אביב corpus: a formula sheet (inputs), a lab
// sheet that EXISTS but has no strength number (empty), an R&D report + weekly
// log carrying the WHY, a two-route version (contradiction), and a decision
// logged with no reason (low confidence). We DON'T hand-set trust — the Episode
// Builder reports outcomes and the Trust Engine learns Fresco's real ecology.

import { buildEpisodes } from '../episodes/episode.mjs';
import { makeTrustEngine } from './trust.mjs';
import { observeEpisodes, deriveObservations } from './episode-bridge.mjs';
import { whereToLook } from './router.mjs';
import { KTYPE } from './sources.mjs';

const TLV = 'טיח תל אביב';
// Docs already through the Identity Engine: each carries an anchor + source_type.
const docs = [
  // ── production version 002: inputs present, but the lab strength field is EMPTY ──
  { id: 'f1', name: 'פורמולציות טיח תל אביב.xlsx', source_type: 'formula_sheet',
    anchor: { version: 'v002', product: TLV }, content: 'v002 NHL 5.0: 25 ק"ג, חול זכוכית 3 ק"ג, COMBIZELL 0.2%.' },
  { id: 'l1', name: 'בדיקת לחיצה.xlsx', source_type: 'lab_sheet',
    anchor: { version: 'v002', product: TLV }, content: 'v002 משקל סגולי: ___   חוזק 28 יום: ___   גוון: ___' }, // present, blank
  { id: 'r1', name: 'דוח-טיח תל אביב.docx', source_type: 'rd_report',
    anchor: { version: 'v002', product: TLV }, content: 'v002 החלטה: אושר לייצור כי ההרטבה טובה לאחר תוספת TCO. ספק גיר הוחלף לכפר גלעדי.' },
  { id: 'w1', name: 'מעקב משימות.docx', source_type: 'weekly_report',
    anchor: { version: 'v002', product: TLV }, content: 'v002 הוחלט להעלות NHL ל-5.0 כי צריך לשפר את החוזק.' },

  // ── failed field pilot v020: a real dead-end, with the reason on record ──
  { id: 'r2', name: 'דוח-טיח תל אביב.docx', source_type: 'rd_report',
    anchor: { version: 'v020', product: TLV }, content: 'v020 נכשל: התקבלו סדקים רבים בחוץ כי התוצאה לא שוחזרה מהמעבדה.' },

  // ── version 001: two decision-bearing sources disagree on the route → CONTRADICTION ──
  { id: 'a1', name: 'דוח-טיח תל אביב.docx', source_type: 'rd_report',
    anchor: { version: 'v001', product: TLV }, content: 'v001 מסלול אריק (premix): אושר כי נתן אחידות.' },
  { id: 'a2', name: 'מעקב משימות.docx', source_type: 'weekly_report',
    anchor: { version: 'v001', product: TLV }, content: 'v001 מסלול רגיל: נכשל, לא נדבק.' },

  // ── version 050: a decision logged with NO reason → LOW_CONFIDENCE ──
  { id: 's1', name: 'SharePoint project note', source_type: 'sharepoint',
    anchor: { version: 'v050', product: TLV }, content: 'v050 אושר.' },
];

const { episodes } = buildEpisodes(docs);

// Mark a version as contradicted when its docs disagree on the decision polarity.
for (const ep of episodes) {
  const epDocs = docs.filter((d) => ep.documents.includes(d.id));
  const approved = epDocs.some((d) => /אושר|approved|הצליח/.test(d.content));
  const failed = epDocs.some((d) => /נכשל|fail|פסול/.test(d.content));
  ep.contradiction = approved && failed;
}

const eng = makeTrustEngine();

console.log('═══ EPISODE BUILDER → observe() — outcomes derived per episode ═══\n');
for (const ep of episodes) {
  const obs = deriveObservations(ep, docs);
  console.log(`  ${ep.episode_id} [${ep.anchor.version}]${ep.contradiction ? '  ⚠ contradiction' : ''}`);
  for (const o of obs) console.log(`      ${o.source_type.padEnd(14)} × ${o.knowledge_type.padEnd(12)} → ${o.outcome}`);
}

// route snapshots BEFORE learning
const routeBefore = {
  MEASUREMENT: whereToLook(eng, KTYPE.MEASUREMENT).best_bet,
  REASON: whereToLook(eng, KTYPE.REASON).best_bet,
};

// ── the one connective call: feed every episode's outcomes into the Trust Engine ──
const { observations, changed } = observeEpisodes(eng, episodes, docs);

console.log('\n═══ OUTPUT 1 — TRUST MATRIX UPDATED ═══');
console.log(`  ${observations} observations fed from ${episodes.length} episodes.\n`);
console.log('  cell (source × knowledge)              trust   calibrated?');
for (const c of changed.sort((a, b) => a.cell.localeCompare(b.cell)))
  console.log(`    ${c.cell.padEnd(34)} ★${c.from ?? '·'}→★${c.to}   ${c.calibrated ? 'yes' : 'not yet'}`);

console.log('\n═══ OUTPUT 2 — SOURCE RELIABILITY CHANGED ═══');
const lab = eng.trust('lab_sheet', KTYPE.MEASUREMENT);
const rd = eng.trust('rd_report', KTYPE.REASON);
const sp = eng.trust('sharepoint', KTYPE.DECISION);
console.log(`  lab_sheet × MEASUREMENT : prior ★${lab.prior_stars} → learned ★${lab.stars}   (${lab.observed} obs, present-but-EMPTY → unreliable here)`);
console.log(`  rd_report × REASON      : prior ★${rd.prior_stars} → learned ★${rd.stars}   (${rd.observed} obs, delivered the WHY → trusted)`);
console.log(`  sharepoint × DECISION   : prior ★${sp.prior_stars} → learned ★${sp.stars}   (decision logged with no reason → LOW_CONFIDENCE)`);

console.log('\n═══ OUTPUT 3 — NEXT SEARCH ROUTE CHANGED ═══');
for (const k of [KTYPE.MEASUREMENT, KTYPE.REASON]) {
  const after = whereToLook(eng, k);
  console.log(`  "${k}":  before → ${routeBefore[k] || '(prior guess)'}    after learning → ${after.best_bet || '(none reachable)'}`);
  if (k === KTYPE.MEASUREMENT)
    console.log(`        ↳ the lab sheet is no longer trusted blindly for strength — it was empty every time.`);
}

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('The Router is no longer a hand-written matrix. Every episode the lab builds');
console.log('teaches MATRIYA where Fresco\'s knowledge REALLY lives — and where it doesn\'t.');
