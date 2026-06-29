// Evidence Qualification (3 authorities) + the intake seam that stops at REVIEW.
//   run: node evidence-qualification-demo.mjs
import { runQualificationTests, qualificationGateSummary } from './evidence-qualification.mjs';
import { intakeDocument, SAMPLE_DOC } from './intake.mjs';

console.log('\n═══ EVIDENCE QUALIFICATION — three AUTHORITIES, not three checks ═══\n');
console.log('  Units    — is the claim INTELLIGIBLE?           authority: the unit & type system');
console.log('  Baseline — is it ANOMALOUS vs measured-so-far?  authority: the Fresco corpus');
console.log('  Physics  — is it POSSIBLE at all?               authority: general physical/chemical law\n');
console.log('  the three results are stored SEPARATELY; decision ∈ {ACCEPT, REVIEW}; never auto-reject.\n');

for (const r of runQualificationTests())
  console.log(`  ${r.pass ? '✓' : '✗'} {U:${r.record.units.padEnd(13)} B:${r.record.baseline.padEnd(12)} P:${r.record.physics.padEnd(9)}} → ${r.record.decision.padEnd(6)} ${r.label}`);

const g = qualificationGateSummary();
console.log(`\n  false claims all stopped (→REVIEW): ${g.falseStopped}  ·  no auto-reject anywhere: ${g.noAutoReject}  ·  ${g.classified}/${g.total}`);
console.log(`  PHYSICS caught beyond the corpus (impossible yet corpus couldn't judge): ${g.physicsCaughtBeyondBaseline}`);
console.log(`    ↳ e.g. absorption 130%: {U:PASS, B:INSUFFICIENT, P:VIOLATION} — "intelligible; no corpus history; but impossible".`);
const a = g.stats.byAuthority;
console.log(`\n  WHY claims went to review, by authority (each review one dominant cause — analysable, improvable):`);
console.log(`    units ${a.units} · physics ${a.physics} · corpus-outlier ${a.corpusOutlier} · corpus-insufficient ${a.corpusInsufficient}   (accepted ${g.stats.accepted} / ${g.stats.total})`);

console.log('\n═══ INTAKE SEAM — Document → Extraction → Claim → Qualification → REVIEW (stop) ═══\n');
const r = intakeDocument(SAMPLE_DOC);
console.log(`  document: "${r.document}"  → extracted ${r.extracted} measured claims`);
for (const [q, items] of Object.entries(r.queues))
  if (items.length) console.log(`    ${q.padEnd(22)} ${items.length}  ${items.map((x) => `${x.claim.asset.split(' ')[0]} ${x.claim.value}${x.claim.unit}`).join(' · ')}`);
console.log(`  review cause by authority: units ${r.byAuthority.units} · physics ${r.byAuthority.physics} · corpus-outlier ${r.byAuthority.corpusOutlier} · corpus-insufficient ${r.byAuthority.corpusInsufficient}`);
console.log(`\n  downstream: ${r.downstream}`);
console.log(`  auto-created events: ${r.autoCreatedEvents}  ← a REVIEW record is NOT a Knowledge Event; nothing crosses the seam without a human.`);
console.log('\n  ⇒ this layer is Evidence QUALIFICATION: it decides a claim\'s fitness to become evidence —');
console.log('    the boundary between "what enters" and "what may affect the knowledge model".\n');
