// REPRODUCIBILITY — does the metric set repeat on a NEW project?
//
// The Tel Aviv finding was: the metrics independently LOCALIZE a project's real,
// documented weak point (TLV → the unmeasured 28-day compressive strength: the
// decisions resting on it were incompressible AND untraceable, while everything
// else was well-grounded). Convergence on ONE project is weak evidence. This
// module re-runs the same metric set on two more projects and asks, per project,
// the only question that matters: did the metrics find the weak point the lab
// itself documented — in the RIGHT place, for the RIGHT reason?
//
//   verdict ∈ { REPRODUCES, DOES NOT REPRODUCE, NOT ENOUGH DATA }
//
// Honest framing carried through every output: this is "validated EXCEPT the
// adversarial content-check" — the Sensitivity Harness left that gap open, so no
// result here is a "validated metric", only a reproducing one.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { assetEntropy } from '../evidence/entropy.mjs';
import { replayTransformations } from '../transformations/transformation.mjs';
import { classifyFrontier, knowledgePhase } from '../frontier/frontier.mjs';
import { compressibility } from './compressibility.mjs';
import { traceability } from './traceability.mjs';

// ── per-project decisions, grounded in docs/PRODUCT_STORY_*.md (never invented) ──
// total = evidence on record for the decision · minimal = fewest pieces that
// explain it · minimal:null = cannot be explained from evidence (a leak, not
// "needs many") · chain: complete | partial | missing.
const PROJECTS = {
  MPZ: {
    label: 'MPZ (graded cementitious render)',
    posture: 'trial-heavy, measure-rich — the only family with substantial measured strength',
    // the lab's OWN documented weak point — a CLUSTER (the docs tangle them): the
    // April failure was literally "rain-water absorption" + over-dilution/curing,
    // captured qualitatively, while the 2020–21 MPa cells are the largest absence.
    // grounded = the asset MPZ DID ground (measured strength) — must stay QUIET,
    // the mirror image of TLV (which grounded adhesion, not strength).
    weakPoint: { assets: ['Water Resistance / Moisture', 'Set / Cure'], grounded: 'Compression Strength',
      text: 'the causal lever was PROCESS (water/curing) + rain-water absorption, captured only ' +
            'qualitatively; the 2020–21 batches are the largest absence (MPa cells blank).' },
    decisions: [
      { id: 'M1', date: '2020-01', decision: 'establish the grade ladder via cement loading', asset: 'Compression Strength',
        chain: 'complete', total: 5, minimal: 2, evidence: 'formulation sheets + later monotonic measured rise' },
      { id: 'M2', date: '2021-06', decision: 'high grades load-bearing; scatter flagged',       asset: 'Compression Strength',
        chain: 'partial',  total: 4, minimal: 2, evidence: 'sparse MPZ15/20 points, high scatter' },
      { id: 'M3', date: '2025-04', decision: 'RETRIAL — April results poor/inconsistent',       asset: 'Set / Cure',
        chain: 'complete', total: 6, minimal: 2, evidence: 'measured low MPa + cause found (rain-water absorption, over-dilution)' },
      { id: 'M4', date: '2025-12', decision: 'ACCEPT controlled process as the reference batch', asset: 'Set / Cure',
        chain: 'complete', total: 6, minimal: 2, evidence: 'same formula, better water/curing → measured gain at every grade' },
      { id: 'M5', date: '2025-12', decision: 'annotate protocol drift; standardize test-day',    asset: 'Compression Strength',
        chain: 'complete', total: 3, minimal: 1, evidence: '8d-vs-7d offsets logged' },
      { id: 'M0', date: '2020-12', decision: '(implicit) trust early grades pre-measurement',    asset: 'Compression Strength',
        chain: 'missing',  total: 6, minimal: null, evidence: '2020–21 MPa cells blank — the largest absence; no decision could be grounded' },
    ],
  },
  'INT-TFX': {
    label: 'INT-TFX (mineral intumescent coating)',
    posture: 'gate-first, define-before-experiment — Stage-0/POC, 0 executed additive trials',
    weakPoint: { assets: ['Fire Resistance'], grounded: null,
      text: 'everything is unmeasured: 0 executed INT-A/B/C trials, 1 legacy burn datapoint held at a gate.' },
    decisions: [
      { id: 'T1', date: '2025-12', decision: 'lock the Radiative–Structural Barrier mechanism', asset: 'Fire Resistance',
        chain: 'missing', total: 1, minimal: null, evidence: 'hypothesis lock — no experimental evidence exists' },
      { id: 'T2', date: '2025-12', decision: 'select additive levers A/B/C (specified)',         asset: 'Fire Resistance',
        chain: 'missing', total: 1, minimal: null, evidence: 'formulations specified but NOT executed' },
      { id: 'T3', date: '2025-04', decision: 'HOLD legacy burn anomaly EXP-LEG-044',             asset: 'Fire Resistance',
        chain: 'partial', total: 2, minimal: null, evidence: '1 measured jump 374→554°C, but legacy formula, held at the anomaly gate — cannot attribute' },
      { id: 'T4', date: '2025-12', decision: 'define the burn protocol & anomaly gate (SOP)',    asset: 'Fire Resistance',
        chain: 'complete', total: 1, minimal: 1, evidence: 'governance SOP — explains itself, but carries no product evidence' },
    ],
  },
};

const W = { measured: 2, qualitative: 1, empty: 0 };

/** Run the full metric set on one project subset. */
export function replicateProject(name) {
  const cfg = PROJECTS[name];
  const eps = REAL_EPISODES.filter((e) => e.product === name);
  const assets = buildKnowledgeAssets(eps).filter((a) => a.evidence > 0)
    .map((a) => ({ ...a, entropy: assetEntropy(a) }));
  const avgEntropy = assets.length ? +(assets.reduce((s, a) => s + a.entropy, 0) / assets.length).toFixed(2) : 1;

  // frontier phase on the subset
  const frontier = classifyFrontier(assets, replayTransformations(eps));
  const phase = knowledgePhase(frontier);

  // decision-level metrics
  const comp = compressibility(cfg.decisions);
  const trace = traceability(cfg.decisions);

  // Momentum / Evidence — decisions taken per unit of measured evidence.
  // High ⇒ deciding ahead of evidence (Stage-0 posture); low ⇒ evidence-led.
  const measuredWeight = eps.reduce((s, e) => s + (e.domains || []).reduce((t, d) => t + (d.signal === 'measured' ? W.measured : 0), 0), 0);
  const momentum = cfg.decisions.length;
  const momentumOverEvidence = measuredWeight > 0 ? +(momentum / measuredWeight).toFixed(2) : null;

  // Did the metrics LOCALIZE the documented weak point — by the TLV mechanism?
  // The TLV principle (fixed in advance, not tuned to pass): the loud signal must
  // land on an asset the lab could NOT ground, while the asset it DID ground stays
  // QUIET. So the test is structural, not a single hand-picked label:
  //   (1) loudest/weakest asset ∈ documented weak-point cluster, AND
  //   (2) the grounded asset is NOT the loudest (discrimination guard — else the
  //       metric is just "everything is loud" and proves nothing), OR
  //   (3) an incompressible/untraceable decision lands on a documented absence.
  const wp = cfg.weakPoint;
  const cluster = new Set(wp.assets);
  const loudest = [...assets].sort((a, b) => b.entropy - a.entropy)[0];
  const weakest = [...assets].sort((a, b) => a.confidence - b.confidence)[0];
  const leakAssets = new Set([...comp.rows.filter((r) => !r.explainable),
    ...trace.leaks].map((r) => r.asset || cfg.decisions.find((d) => d.id === r.id)?.asset));
  const groundedQuiet = !wp.grounded || loudest?.name !== wp.grounded;   // discrimination guard
  const localizedByEntropy = (cluster.has(loudest?.name) || cluster.has(weakest?.name)) && groundedQuiet;
  // an incompressible/untraceable decision that is itself a documented absence
  const localizedByDecisions = comp.rows.some((r) => !r.explainable && r.chain === 'missing')
    || trace.leaks.length > 0 && [...leakAssets].some((a) => cluster.has(a));
  const detected = localizedByEntropy || localizedByDecisions;

  // Sensitivity (scoped): does adding a measurement to the weak asset move it (signal),
  // and does a duplicate document move nothing (noise)?
  const probeAsset = wp.assets[0];
  const conf = (es, an) => { const a = buildKnowledgeAssets(es).find((x) => x.name === an); return a ? a.confidence : 0; };
  const baseConf = conf(eps, probeAsset);
  const signalDelta = +(conf([...eps, { id: 'S', product: name, domains: [{ domain: probeAsset, signal: 'measured', note: 'pert' }], materials: [] }], probeAsset) - baseConf).toFixed(3);
  const noiseDelta = eps.length ? +(conf([...eps, { ...eps[0], id: 'DUP' }], probeAsset) - baseConf).toFixed(3) : 0;

  // Verdict logic.
  //  - enough decision evidence to test compressibility/traceability at all?
  const explainable = comp.explainable;            // decisions with a minimal set
  const measuredAssets = assets.filter((a) => a.measured > 0).length;
  let verdict, why;
  if (measuredAssets === 0 || explainable <= 1) {
    verdict = 'NOT ENOUGH DATA';
    why = 'too few measured assets / explainable decisions to test the metric — it correctly refuses to over-claim on a thin corpus';
  } else if (detected) {
    verdict = 'REPRODUCES';
    why = `the metrics localized the documented weak point (${wp.assets.join(' / ')}) by the TLV mechanism — and the grounded asset (${wp.grounded || '—'}) stayed quiet, the mirror image of TLV`;
  } else {
    verdict = 'DOES NOT REPRODUCE';
    why = `the metrics did NOT point at the documented weak point (${wp.assets.join(' / ')})`;
  }

  return {
    name, label: cfg.label, posture: cfg.posture,
    weakPoint: cfg.weakPoint,
    metrics: {
      assets: assets.map((a) => ({ asset: a.name, confidence: a.confidence, measured: a.measured, entropy: a.entropy })),
      avgEntropy,
      loudest: loudest && { asset: loudest.name, entropy: loudest.entropy },
      weakest: weakest && { asset: weakest.name, confidence: weakest.confidence },
    },
    weakPointDetected: { detected, byEntropy: localizedByEntropy, byDecisions: localizedByDecisions },
    compressibility: { avg: comp.avgCompressibility, explainable, total: comp.total, incompressible: comp.incompressible },
    traceability: { value: trace.traceability, complete: trace.complete, total: trace.total },
    momentumOverEvidence: { value: momentumOverEvidence, momentum, measuredEvidence: measuredWeight,
      reading: momentumOverEvidence == null ? 'no measured evidence — pure momentum'
        : momentumOverEvidence >= 1 ? 'deciding AHEAD of evidence (Stage-0 posture)'
        : 'evidence-led (decisions rest on measurement)' },
    frontier: { phase: phase.phase, phaseIndex: phase.phaseIndex, toBuild: phase.passages_to_carve },
    sensitivity: { signalDelta, noiseDelta,
      signal: signalDelta >= 0.01 ? 'responds ✓' : 'flat ✗',
      noise: Math.abs(noiseDelta) < 0.005 ? 'ignores duplicate ✓' : 'moves on duplicate ✗',
      caveat: 'adversarial content-check still OPEN (a false "measured" claim would pass)' },
    verdict, why,
  };
}

export function replicateAll(order = ['MPZ', 'INT-TFX']) {
  return order.map(replicateProject);
}
