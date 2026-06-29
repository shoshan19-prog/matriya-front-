// THE COMPLETE MODEL — one case walked end-to-end through the Authority Chain.
//
//   Source → Provenance → Qualification → Human Review → Knowledge Event → ΔK
//          → Reasoning Qualification → Decision → Law
//
// Each authority rules in turn and emits ONLY its own verdict; the case advances
// only while green and STOPS at the first authority that needs a human (Review) or
// raises a flag. The output is an auditable TRACE: at every stop you can read which
// authority ruled, and why. Nothing crosses Human Review without a person — so the
// runner returns "PENDING_HUMAN" rather than fabricating an approval (pass
// approved:true to simulate the post-approval tail for demonstration).

import { provenanceOf } from './domains/provenance.mjs';
import { qualifyEvidence } from './metrics/evidence-qualification.mjs';
import { qualifyInference } from './reasoning.mjs';
import { checkAuthorityIsolation } from './authority-chain.mjs';

/** Run one case through the full chain. case = {source, claim, conclusion, approved?} */
export function runChain({ source, claim, conclusion, approved = false }) {
  const trace = [];
  const step = (authority, question, verdict, ruling) => { trace.push({ authority, question, verdict, ruling }); return verdict; };

  // 1. Provenance — may this source be used? (evidence may come from any origin;
  //    only the eligibility *label* is recorded — Provenance never judges truth)
  const p = provenanceOf(source);
  step('Provenance', 'may this source be used?', p.origin, `origin:${p.origin} · role:${p.role}`);

  // 2. Qualification — is the claim fit? (three courts: units/baseline/physics)
  const q = qualifyEvidence(claim);
  step('Qualification', 'is the claim fit?', q.decision, `{units:${q.units} baseline:${q.baseline} physics:${q.physics}} — ${q.reason}`);
  if (q.decision !== 'ACCEPT')
    return { stoppedAt: 'Qualification', status: 'REVIEW', trace, note: 'claim not auto-fit → human review before it can become evidence' };

  // 3. Human Review — the seam. No auto-approval.
  if (!approved) {
    step('Human Review', 'do we accept it?', 'PENDING', 'awaiting a person — the chain does not self-approve');
    return { stoppedAt: 'Human Review', status: 'PENDING_HUMAN', trace, note: 'pass approved:true to walk the post-approval tail' };
  }
  step('Human Review', 'do we accept it?', 'ACCEPTED', 'a person approved the claim → it is now Evidence');

  // 4. Knowledge Event + ΔK — what changed? (the historian; never re-judges evidence)
  step('Knowledge Event', 'what changed?', 'EVENT', `evidence on ${claim.asset} recorded as a Knowledge Event → ΔK on that asset`);

  // 5. Reasoning Qualification — does the conclusion follow from the evidence?
  const r = qualifyInference(conclusion);
  step('Reasoning Qualification', 'does the conclusion follow?', r.verdict, r.reason);
  if (r.verdict !== 'SUPPORTED' || r.decision !== 'ACCEPT')
    return { stoppedAt: 'Reasoning Qualification', status: 'REVIEW', trace, note: `inference is ${r.verdict} → a person must review before any Law` };

  // 6. Decision → Law (still a human act — see lawGate)
  step('Decision', 'promote to a Law?', 'ELIGIBLE', 'all authorities green → eligible; promotion remains a human judgement (lawGate)');
  return { stoppedAt: 'Decision', status: 'ELIGIBLE_FOR_LAW', trace, note: 'every authority ruled green; a human still makes the Law' };
}

/** LAW GATE — the capstone. Gathers ALL accumulated validation evidence and the
 *  live authority-isolation check into ONE promotion verdict. Honest by design:
 *  even when everything is green it does NOT auto-declare a law — promotion stays
 *  a human judgement, consistent with the whole governance stance. */
export function lawGate() {
  const iso = checkAuthorityIsolation();
  const criteria = [
    { test: 'Reproducibility (≥3 Fresco projects)', status: 'PASS', detail: 'TLV ✓ + MPZ ✓ + PROTECH A1 ✓ (INT-TFX correctly NOT ENOUGH DATA)' },
    { test: 'Discrimination (negative control)',     status: 'PASS', detail: 'Business ⟂ Order diverge where they should' },
    { test: 'Independence (mechanism matrix)',       status: 'PASS', detail: 'Information≈Gradient redundant exposed; Business⟂Order independent' },
    { test: 'Sensitivity (signal/noise/adversarial)',status: 'PASS', detail: 'signal ✓ · duplicate ✓ · adversarial GUARDED for numeric (Evidence Qualification)' },
    { test: 'Authority Isolation (no leakage)',      status: iso.allHold ? 'PASS' : 'FAIL', detail: `${iso.passed}/${iso.total} invariants hold against the real modules` },
    { test: 'Reasoning Qualification (active)',      status: 'PASS', detail: 'inferences judged SUPPORTED/NON_SEQUITUR/UNSUPPORTED, separate from evidence' },
  ];
  const allPass = criteria.every((c) => c.status === 'PASS');
  return {
    criteria, allPass,
    promote: false, // ← deliberate: a green board makes a metric PROMOTABLE, not promoted
    verdict: allPass
      ? 'ALL VALIDATION GREEN — promotable. Promotion to a Law remains a human decision (the system never declares its own laws).'
      : 'NOT READY — one or more validation tests are open.',
  };
}

// ── sample cases for the demo ────────────────────────────────────────────────
export const SAMPLE_CASES = [
  { name: 'good claim, sound inference (stops for human)',
    source: 'MPZ', claim: { asset: 'Compression Strength', value: 23.83, unit: 'MPa' },
    conclusion: { evidenceAssets: ['Set / Cure', 'Compression Strength'], conclusionAsset: 'Compression Strength', claim: 'process control raised strength' } },
  { name: 'impossible value (stops at Qualification)',
    source: 'MPZ', claim: { asset: 'Water Resistance / Moisture', value: 130, unit: '%' },
    conclusion: { evidenceAssets: ['Water Resistance / Moisture'], conclusionAsset: 'Water Resistance / Moisture' } },
  { name: 'good evidence, BAD inference (stops at Reasoning)', approved: true,
    source: 'PROTECH A1', claim: { asset: 'Compression Strength', value: 20, unit: 'MPa' },
    conclusion: { evidenceAssets: ['Compression Strength'], conclusionAsset: 'Fire Resistance', claim: 'strong ⇒ fire improved' } },
  { name: 'all green → eligible for Law', approved: true,
    source: 'MPZ', claim: { asset: 'Compression Strength', value: 23.83, unit: 'MPa' },
    conclusion: { evidenceAssets: ['Compression Strength'], conclusionAsset: 'Compression Strength', claim: 'measured strength supports the strength claim' } },
];
