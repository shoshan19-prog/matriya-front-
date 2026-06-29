// AUTHORITY CHAIN — MATRIYA is not a pipeline, it is a chain of AUTHORITIES.
//
// A pipeline moves data through steps. An authority chain moves a claim through
// COURTS, and the architectural rule is that each court is authorised to decide
// exactly ONE kind of question, using only the information in its own domain — and
// may NOT speak for the next court. Like a courthouse:
//
//   reception clerk → forensic lab → judge → historian
//   ─────────────    ────────────   ─────   ─────────
//   Provenance       Qualification  Human   Knowledge Event
//   "may it be       "is the claim  Review  "what changed in
//    submitted?"      valid?"       "do we   our understanding?"
//                                    accept?"
//
// The clerk never says "the evidence is true". The lab never says "the suspect is
// guilty". The judge never writes history. The historian never re-tests the
// evidence. That discipline is the whole point — it is what keeps every link
// independently testable, improvable and replaceable.
//
//   PRINCIPLE 1 — Multi-Authority: there is no single truth, there are independent
//                 authorities, each ruling in its own domain (Qualification itself
//                 is THREE such courts: Units, Baseline, Physics).
//   PRINCIPLE 2 — Authority Isolation / No Authority Leakage: each authority sees
//                 only its own question and may emit only its own vocabulary.
//
// This module DECLARES the chain and VERIFIES the isolation against the real code.

import { provenanceOf } from './domains/provenance.mjs';
import { qualifyEvidence } from './metrics/evidence-qualification.mjs';
import { intakeDocument, SAMPLE_DOC } from './metrics/intake.mjs';
import { qualifyInference } from './reasoning.mjs';
import { detectChanges } from './sources/change-detector.mjs';

// ── the chain, as a registry of authorities (each: one question, one vocabulary) ─
export const AUTHORITIES = [
  { id: 'Change Detector', station: 'museum guard', question: 'WHAT changed since last time?',
    judges: 'the inventory (not the content)', blindTo: ['the content', 'the source policy', 'the value', 'knowledge'],
    mayEmit: ['NEW | UPDATED | DELETED | UNCHANGED'],
    mustNotSay: ['this source is allowed', 'the claim is valid', 'this matters / changes knowledge'],
    why: 'source-agnostic: SharePoint, Drive, Gmail, a local folder all answer "what changed?" the same way — only the Scanner differs, never this authority.' },

  { id: 'Provenance', station: 'reception clerk', question: 'may this SOURCE be used at all?',
    judges: 'the source', blindTo: ['the claim value', 'the human decision', 'the inference'],
    mayEmit: ['origin: fresco | external | unverified', 'role: project | qc-source | reference', 'eligible: true | false'],
    mustNotSay: ['the claim is true', 'the value is plausible', 'we accept it', 'the system learned'] },

  { id: 'Qualification', station: 'forensic lab', question: 'is the CLAIM fit to enter as evidence?',
    judges: 'the measured claim', blindTo: ['the source identity', 'the human decision', 'the inference'],
    subAuthorities: [
      { id: 'Units',    question: 'is the claim INTELLIGIBLE?',          authority: 'the unit & type system', emits: 'PASS | UNINTELLIGIBLE' },
      { id: 'Baseline', question: 'is it ANOMALOUS vs measured-so-far?', authority: 'the Fresco corpus',       emits: 'WITHIN | OUTLIER | INSUFFICIENT' },
      { id: 'Physics',  question: 'is it POSSIBLE at all?',              authority: 'general physical law',    emits: 'PASS | VIOLATION | NA' },
    ],
    mayEmit: ['units, baseline, physics (separately)', 'decision: ACCEPT | REVIEW'],
    mustNotSay: ['the source is allowed', 'we accept it', 'a knowledge event occurred', 'the inference follows'] },

  { id: 'Human Review', station: 'judge', question: 'do we ACCEPT this claim as evidence?',
    judges: 'acceptance', blindTo: ['—'],
    mayEmit: ['accepted', 'needs-more-work'],
    mustNotSay: ['the source is/ isn\'t allowed', 'a knowledge event was created', 'ΔK = …'] },

  { id: 'Knowledge Event', station: 'historian', question: 'WHAT changed in our knowledge?',
    judges: 'the change to the knowledge model', blindTo: ['—'],
    mayEmit: ['event', 'ΔK'],
    mustNotSay: ['the source is allowed', 're-qualify the evidence', 'the value is/ isn\'t valid'] },

  // ── the fourth authority — now ACTIVE ──
  { id: 'Reasoning Qualification', station: 'appeals court', question: 'does the CONCLUSION follow from the evidence?',
    judges: 'the inference (not the evidence)', blindTo: ['the source', 'the raw value'],
    mayEmit: ['inference: SUPPORTED | NON_SEQUITUR | UNSUPPORTED'],
    mustNotSay: ['re-judge the evidence value', 'the source is allowed'],
    why: 'Units/Baseline/Physics can all PASS yet "therefore fire resistance improved" is a non-sequitur — a different authority judges the inference, not the evidence.' },
];

// vocabularies each authority is allowed to emit (for the leakage check) — disjoint by design
const VOCAB = {
  'Change Detector': ['NEW', 'UPDATED', 'DELETED', 'UNCHANGED'],
  Provenance:      ['fresco', 'external', 'unverified', 'project', 'qc-source', 'reference'],
  Qualification:   ['PASS', 'UNINTELLIGIBLE', 'WITHIN', 'OUTLIER', 'INSUFFICIENT', 'VIOLATION', 'NA', 'ACCEPT', 'REVIEW'],
  'Knowledge Event': ['event', 'ΔK', 'knowledge-changed'],
};

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const disjoint = (a, b) => !a.some((x) => b.includes(x));

/** Verify NO AUTHORITY LEAKAGE against the real modules. Each invariant is a way
 *  the architecture could rot; each test is runnable, not a comment. */
export function checkAuthorityIsolation() {
  const checks = [];

  // 1. Vocabularies are pairwise disjoint — no authority can emit another's verdict.
  checks.push({ invariant: 'vocabularies are disjoint (Change ⟂ Provenance ⟂ Qualification ⟂ Event)',
    pass: disjoint(VOCAB['Change Detector'], VOCAB.Provenance) && disjoint(VOCAB['Change Detector'], VOCAB.Qualification)
      && disjoint(VOCAB.Provenance, VOCAB.Qualification) && disjoint(VOCAB.Qualification, VOCAB['Knowledge Event']) && disjoint(VOCAB.Provenance, VOCAB['Knowledge Event']) });

  // 1b. Change Detector is BLIND to content/knowledge — injecting content fields
  //     changes nothing (the museum guard only sees the signature, not the painting).
  const prev = [{ source: 'x', id: 'a', name: 'f.pdf', modified: '2026-06-28T10:00', size: 10 }];
  const curPlain = [{ source: 'x', id: 'a', name: 'f.pdf', modified: '2026-06-28T10:00', size: 10 }];
  const curWithContent = [{ source: 'x', id: 'a', name: 'f.pdf', modified: '2026-06-28T10:00', size: 10, asset: 'Compression Strength', value: 23.83, secret: 'xyz' }];
  checks.push({ invariant: 'Change Detector is blind to content (same UNCHANGED verdict with content/value fields injected)',
    pass: detectChanges(prev, curPlain)[0].status === 'UNCHANGED' && detectChanges(prev, curWithContent)[0].status === 'UNCHANGED' });

  // 2. Provenance says nothing about truth — its record keys are only origin/role/note.
  const prov = provenanceOf('MPZ');
  checks.push({ invariant: 'Provenance emits only {origin, role, note} — never a truth/acceptance verdict',
    pass: Object.keys(prov).every((k) => ['origin', 'role', 'note'].includes(k)) && !VOCAB.Qualification.includes(prov.origin) });

  // 3. Qualification is BLIND to the source — injecting provenance fields changes nothing.
  const claim = { asset: 'Compression Strength', value: 23.83, unit: 'MPa' };
  const plain = qualifyEvidence(claim);
  const withSource = qualifyEvidence({ ...claim, origin: 'external', source: 'a competitor lab', role: 'reference' });
  checks.push({ invariant: 'Qualification is blind to the source (same verdict with/without provenance fields)',
    pass: eq({ u: plain.units, b: plain.baseline, p: plain.physics, d: plain.decision },
             { u: withSource.units, b: withSource.baseline, p: withSource.physics, d: withSource.decision }) });

  // 4. Qualification emits only ACCEPT/REVIEW — never an acceptance or event word.
  checks.push({ invariant: 'Qualification decision ∈ {ACCEPT, REVIEW} — never "accepted"/"event"/"learned"',
    pass: ['ACCEPT', 'REVIEW'].includes(plain.decision) && !['accepted', 'event', 'learned'].includes(plain.decision) });

  // 5. The Event layer does NOT change Qualification — qualify is pure/idempotent
  //    before and after the chain runs (no shared mutable state leaks back).
  const before = qualifyEvidence(claim);
  intakeDocument(SAMPLE_DOC);                 // exercise the chain (extraction → qualification → review)
  const after = qualifyEvidence(claim);
  checks.push({ invariant: 'Knowledge Event / intake never mutates a Qualification result (idempotent)',
    pass: eq(before, after) });

  // 6. The intake seam stops at REVIEW — no Event is created without a human.
  const intake = intakeDocument(SAMPLE_DOC);
  checks.push({ invariant: 'Human Review is required — intake auto-creates 0 Knowledge Events',
    pass: intake.autoCreatedEvents === 0 });

  // 7. Reasoning judges the INFERENCE, never the evidence value — its verdict
  //    depends only on the asset linkage, not on the measured number.
  const inf = { evidenceAssets: ['Adhesion'], conclusionAsset: 'Fire Resistance' };
  const r1 = qualifyInference({ ...inf, claim: 'value 2.8' });
  const r2 = qualifyInference({ ...inf, claim: 'value 999' });
  checks.push({ invariant: 'Reasoning judges the inference, not the evidence value (same verdict regardless of the number)',
    pass: r1.verdict === r2.verdict && r1.verdict === 'NON_SEQUITUR' });

  return { checks, allHold: checks.every((c) => c.pass), passed: checks.filter((c) => c.pass).length, total: checks.length };
}
