// INTAKE CHAIN — one responsibility per stage, no layer doing another's job.
//
//   Document → Evidence Extraction → Measured Claim → Content Check → REVIEW
//                                                                       │
//                                              (human approves) ────────┘
//                                                       ↓
//                                            Evidence → Event → ΔK
//
// The point of this module is the SEAM, not the plumbing. Content Check validates
// CLAIMS and nothing else; it hands a classified claim to a REVIEW queue and
// STOPS. Evidence, Events and ΔK are downstream and are reached ONLY after a human
// approves — so a REVIEW_OUTLIER is never silently turned into a Knowledge Event.
// They are different objects at different layers:
//   • Measured Claim — "the document asserts X = 23.8 MPa"   (unverified)
//   • Content verdict — ACCEPT / REVIEW_OUTLIER / …          (a judgement about the claim)
//   • Evidence       — a claim a human has accepted           (now trusted)
//   • Event          — evidence that changed an asset's state (atom of learning)
//   • ΔK             — how much the event moved the knowledge model
// Conflating the verdict with the Event is the exact mistake this seam prevents.

import { classifyClaim } from './content-check.mjs';

/** Stage 1 — Evidence Extraction: a raw document → measured claims.
 *  (Responsibility: pull structured {asset,value,unit} claims out of a document.
 *  It does NOT judge them — that is the content check's job.) */
export function extractClaims(document) {
  return (document.measurements || []).map((mraw, i) => ({
    id: `${document.id || 'DOC'}-c${i + 1}`,
    source: document.source || document.name,
    asset: mraw.asset, value: mraw.value, unit: mraw.unit,
  }));
}

/** Stage 2+3 — run each claim through the Content Check and bucket into a REVIEW
 *  queue. Returns the queue only. Does NOT create Evidence or Events. */
export function intakeDocument(document) {
  const claims = extractClaims(document);
  const checked = claims.map((c) => ({ claim: c, verdict: classifyClaim(c) }));
  const bucket = (cls) => checked.filter((x) => x.verdict.classification === cls);
  return {
    document: document.name,
    extracted: claims.length,
    queues: {
      ACCEPT: bucket('ACCEPT'),                       // candidate evidence — still needs human sign-off
      REVIEW_OUTLIER: bucket('REVIEW_OUTLIER'),       // unusual — human looks
      CONTRADICTS_EXISTING: bucket('CONTRADICTS_EXISTING'), // impossible — strong flag, human looks
      INSUFFICIENT_BASELINE: bucket('INSUFFICIENT_BASELINE'),// can't judge — human looks
    },
    // the seam, made explicit and inert until a human acts:
    downstream: 'STOPPED at REVIEW. Evidence → Event → ΔK happen only after human approval; a REVIEW verdict is NOT a Knowledge Event.',
    autoCreatedEvents: 0,
  };
}

/** Stage 4 — the ONLY way past the seam: a human approves a claim, which becomes
 *  Evidence. (Event/ΔK creation lives in the event/transformation engines — this
 *  just marks the hand-off, it does not perform it.) */
export function approveClaimToEvidence(checkedItem, approver = 'human') {
  if (!checkedItem || !checkedItem.verdict) return null;
  return {
    evidence: { ...checkedItem.claim, normalized: checkedItem.verdict.normalized, approvedBy: approver },
    note: 'now Evidence — eligible to feed the Event engine; ΔK is computed there, not here',
  };
}

// ── a sample document mixing good, unusual and impossible claims ──────────────
export const SAMPLE_DOC = {
  id: 'LAB-2026-014', name: 'MPZ Dec-2025 strength + a typo + a bad absorption row', source: 'sharepoint:Lab',
  measurements: [
    { asset: 'Compression Strength',        value: 23.83, unit: 'MPa' },   // real → ACCEPT (candidate)
    { asset: 'Compression Strength',        value: 500,   unit: 'MPa' },   // typo → CONTRADICTS (physics)
    { asset: 'Density',                     value: 1.41,  unit: 'g/cm³' }, // real → ACCEPT
    { asset: 'Water Resistance / Moisture', value: 130,   unit: '%' },     // impossible → CONTRADICTS (physics)
    { asset: 'Compression Strength',        value: 80,    unit: 'MPa' },   // unusual → REVIEW_OUTLIER
  ],
};
