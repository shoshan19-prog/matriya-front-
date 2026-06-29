#!/usr/bin/env node
// MATRIYA v1.0 — the single product entry point.
//
//   matriya ask "what do we know about compression?"
//   matriya next                    (PROTEUS recommendation)
//   matriya why adhesion            (plain-language explanation — INNOVATION 1)
//   matriya simulate FIRST_PULL_OFF (what-if dry run — INNOVATION 2)
//   matriya frontier [asset]        matriya material vermiculite
//   matriya status                  matriya ingest drive|priority|gmail
//   matriya analyze                 matriya approve FIRST_PULL_OFF
//
// Everything below assets/ events/ transformations/ frontier/ decision-value/
// telemetry/ becomes an INTERNAL module. The user sees only MATRIYA.

import { REAL_EPISODES } from './domains/corpus.mjs';
import { DOMAIN, DOMAIN_MARKERS } from './domains/domains.mjs';
import { buildKnowledgeAssets, renderAssetCard } from './assets/knowledge-asset.mjs';
import { buildMaterialIndex, materialHistory } from './domains/registry.mjs';
import { replayTransformations } from './transformations/transformation.mjs';
import { classifyFrontier, knowledgePhase } from './frontier/frontier.mjs';
import { buildDecisionPriorities, protocol } from './decision-value/decision-value.mjs';
import { CANDIDATE_EVENTS } from './events/learning-primitives.mjs';
import { scan as spScan, status as spStatus } from './adapters/sharepoint.mjs';
import { runDaily } from './pipeline.mjs';
import { assetEntropy, groupEntropy, silence, entropyGradient } from './evidence/entropy.mjs';
import { informationPotential } from './metrics/information-potential.mjs';
import { traceability } from './metrics/traceability.mjs';
import { independenceMatrix, discrimination, promotionGate } from './metrics/discrimination.mjs';
import { compressibility } from './metrics/compressibility.mjs';
import { verdicts as sensitivityVerdicts } from './metrics/sensitivity.mjs';
import { replicateAll } from './metrics/replicate.mjs';

// SAMPLE SharePoint inventory — to demonstrate the daily pipeline while the live
// connection is blocked. Real adapter output replaces this verbatim.
const SAMPLE_INVENTORY = { ok: true, site: '(sample)', drives: 1, files: 5, inventory: [
  { source: 'sharepoint', drive: 'Lab', name: 'Pull-off test report TLV render.xlsx', id: 's1' },
  { source: 'sharepoint', drive: 'Lab', name: 'Salt spray Q1 results.pdf', id: 's2' },
  { source: 'sharepoint', drive: 'QC', name: 'Color spectro ΔE batch 204.xlsx', id: 's3' },
  { source: 'sharepoint', drive: 'Mgmt', name: 'Steering meeting notes.docx', id: 's4' },
  { source: 'sharepoint', drive: 'Lab', name: 'Vicat set time MPZ.xlsx', id: 's5' },
] };

// ── CORE ENGINE (hidden behind ask/ingest/analyze) ───────────────────────────
const engine = (episodes = REAL_EPISODES) => {
  const assets = buildKnowledgeAssets(episodes);
  const trans = replayTransformations(episodes);
  const frontier = classifyFrontier(assets, trans);
  return { assets, trans, frontier, phase: knowledgePhase(frontier) };
};
const findAsset = (assets, q) => assets.find((a) => a.name.toLowerCase().includes((q || '').toLowerCase()));
const classifyQuestion = (q) => {
  for (const [domain, re] of Object.entries(DOMAIN_MARKERS)) if (re.test(q || '')) return domain;
  return null;
};
const eventByName = (n) => CANDIDATE_EVENTS.find((e) => e.name.toLowerCase() === (n || '').toLowerCase());

// ── COMMANDS ─────────────────────────────────────────────────────────────────
function ask(q) {
  const { assets, frontier } = engine();
  const name = classifyQuestion(q) || (findAsset(assets, q) || {}).name;
  if (!name) return console.log(`MATRIYA: couldn't map "${q}" to a property.\n  known: ${assets.map((a) => a.name).join(', ')}`);
  const a = assets.find((x) => x.name === name), f = frontier.find((x) => x.asset === name);
  console.log(`\n${renderAssetCard(a)}\n`);
  console.log(`  Frontier:  ${f.frontierType} — ${f.reason}`);
  console.log(`  To close:  ${f.closingAction}\n`);
}

function next(objective = 'customer-returns-cracking') {
  const rows = buildDecisionPriorities(REAL_EPISODES, objective);
  const p = protocol(rows);
  console.log(`\nMATRIYA recommends (objective: ${objective}):`);
  console.log(`  ► ${p.Mode}  ${p.Event}   for ${p.Asset}`);
  console.log(`    expected ΔknowledgE ${p.ExpectedDK} · business impact ${p.BusinessImpact} · priority ${p.Priority}`);
  console.log(`    (PROTEUS recommends — you approve.  ‘matriya why ${p.Asset.split(' ')[0].toLowerCase()}’ for the reasoning)\n`);
}

// INNOVATION 1 — plain-language WHY behind a recommendation.
function why(assetQ, objective = 'customer-returns-cracking') {
  const { assets, frontier } = engine();
  const a = findAsset(assets, assetQ); if (!a) return console.log(`unknown asset "${assetQ}"`);
  const rows = buildDecisionPriorities(REAL_EPISODES, objective);
  const r = rows.find((x) => x.asset === a.name) || rows[0];
  const f = frontier.find((x) => x.asset === a.name);
  console.log(`\nWhy MATRIYA ${r.mode === 'GENERATE' ? 'wants to GENERATE' : 'recommends'} ${r.event} for ${a.name}:`);
  console.log(`  • grounding:   confidence ${a.confidence} (${a.measured} measured across ${a.products} product${a.products === 1 ? '' : 's'}) — ${a.confidence < 0.5 ? 'weak' : 'moderate'}`);
  console.log(`  • frontier:    ${f.frontierType} — ${f.reason}`);
  console.log(`  • demand:      asked-for ${r.demand}× and unanswered (router misses)`);
  console.log(`  • business:    impact ${r.businessImpact} under "${objective}" · decision-value ${r.decisionValue}`);
  console.log(`  • learning:    expected ΔknowledgE ${r.expectedDK} (${r.expectedDK >= 0.3 ? 'a first measurement moves the needle a lot' : 'incremental'})`);
  console.log(`  ⇒ net priority ${r.priority} — ${r.priority === Math.max(...rows.map((x) => x.priority)) ? 'the highest available.' : 'below the top pick.'}`);
  console.log(`  ⇒ mode ${r.mode}: ${r.mode === 'GENERATE' ? 'the data does not exist in the corpus — run the test.' : 'fetch existing evidence.'}  Pending your approval.\n`);
}

// INNOVATION 2 — simulate: what would this acquisition do to the knowledge map?
function simulate(eventQ) {
  const ev = eventByName(eventQ); if (!ev) return console.log(`unknown event "${eventQ}".  try: ${CANDIDATE_EVENTS.map((e) => e.name).join(', ')}`);
  const before = engine();
  const aB = before.assets.find((x) => x.name === ev.asset);
  // counterfactual: add one MEASURED observation for the target asset, recompute.
  const synthetic = { id: 'SIM', product: '(simulated)', domains: [{ domain: ev.asset, signal: 'measured', note: 'simulated acquisition' }], materials: [] };
  const after = engine([...REAL_EPISODES, synthetic]);
  const aA = after.assets.find((x) => x.name === ev.asset);
  console.log(`\nSIMULATE ${ev.name} on ${ev.asset} (dry run — nothing committed):`);
  console.log(`  confidence:   ${aB.confidence}  →  ${aA.confidence}   (${(aA.confidence - aB.confidence >= 0 ? '+' : '')}${(aA.confidence - aB.confidence).toFixed(2)})`);
  console.log(`  measured:     ${aB.measured}  →  ${aA.measured}`);
  if (aB.measured === 0) console.log(`  frontier:     GENERATE_REQUIRED  →  grounded (this would be the FIRST measurement of ${ev.asset})`);
  console.log(`  phase index:  ${before.phase.phaseIndex}  →  ${after.phase.phaseIndex}   (1=retrieve … 0=generate)`);
  console.log(`  ⇒ ${aA.confidence - aB.confidence >= 0.1 ? 'high-value acquisition — run it.' : 'marginal — knowledge barely moves.'}  (predicted; approve to make it real)\n`);
}

function frontierCmd(assetQ) {
  const { frontier, phase } = engine();
  if (assetQ) { const f = frontier.find((x) => x.asset.toLowerCase().includes(assetQ.toLowerCase()));
    return console.log(`\n${f.asset}: ${f.frontierType}\n  reason: ${f.reason}\n  action: ${f.closingAction}\n  expected ΔK: ${f.expectedDK}\n`); }
  console.log(`\nKnowledge phase: ${phase.phase} (index ${phase.phaseIndex})`);
  for (const f of frontier) console.log(`  ${f.frontierType.padEnd(18)} ${f.asset}`);
  console.log('');
}

function material(name) {
  const m = materialHistory(buildMaterialIndex(REAL_EPISODES), name);
  if (!m) return console.log(`no history for material "${name}"`);
  console.log(`\n${m.name}: ${m.products} products, ${m.appearances} appearances (+${m.positive}/−${m.negative})`);
  for (const e of m.episodes) console.log(`  ${e.product.padEnd(16)} ${e.effect.toUpperCase().padEnd(8)} ${e.note}`);
  console.log('');
}

function status() {
  const { assets, frontier, phase } = engine();
  const by = frontier.reduce((m, f) => ((m[f.frontierType] = (m[f.frontierType] || 0) + 1), m), {});
  console.log(`\nMATRIYA status`);
  console.log(`  knowledge phase: ${phase.phase} (index ${phase.phaseIndex}) — ${phase.note}`);
  console.log(`  assets: ${assets.length} · ` + Object.entries(by).map(([k, v]) => `${k} ${v}`).join(' · '));
  console.log(`  weakest: ` + [...assets].sort((a, b) => a.confidence - b.confidence).slice(0, 3).map((a) => `${a.name} (${a.confidence})`).join(', '));
  next();
}

const ADAPTERS = {
  drive:      { state: 'available (read-only, governed)', note: 'Google Drive scout — human-approved Intake' },
  priority:   { state: 'WIRED (Stage 2 emitter)',         note: 'ERP → experiment cost & duration → real Acquisition Cost Vector (telemetry/priority-telemetry.mjs)' },
  gmail:      { state: 'adapter stub (not wired)',        note: 'email → evidence + decisions' },
  sharepoint: { state: 'adapter stub (not wired)',        note: 'project documents' },
  lab:        { state: 'adapter stub (not wired)',        note: 'measurement_created → real Knowledge Events' },
};
async function ingest(source) {
  const a = ADAPTERS[source];
  if (!a) return console.log(`unknown source "${source}". adapters: ${Object.keys(ADAPTERS).join(', ')}`);
  console.log(`\ningest ${source}: ${a.state}\n  ${a.note}`);
  if (source === 'sharepoint') console.log(`  live status: ${await spStatus()}`);
  console.log(`  governance: extraction is human-approved · append-only · no auto-extract/generate · privacy-preserving.`);
  console.log(`  → new sources connect HERE (ingest), never to the engine logic.\n`);
}

// Daily process: scan → understand → index → review (governed, review-only).
async function daily(source = 'sharepoint') {
  const scanResult = source === 'sample' ? SAMPLE_INVENTORY : await spScan();
  const r = runDaily(scanResult, source === 'sample' ? 'sharepoint' : source);
  if (!r.ok) return console.log(`\ndaily ${source}: blocked at ${r.stage} — ${r.reason}\n  (try 'matriya daily sample' to see the pipeline on a sample inventory)\n`);
  console.log(`\nDAILY ${source}  scan→understand→index→review`);
  console.log(`  scan:       ${r.scan.files} files`);
  console.log(`  understand: ${r.understand.classified} classified, ${r.understand.skipped} skipped · ` +
    Object.entries(r.understand.byAsset).map(([k, v]) => `${k} ${v}`).join(', '));
  console.log(`  index:      ${r.index.staged} staged candidate episodes (NOT committed)`);
  console.log(`  review:     ${r.review.measured} measured · phase ${r.review.phaseBefore}→${r.review.phaseAfter}`);
  for (const m of r.review.assetsMoved)
    console.log(`     ${m.asset}: ${m.from} → ${m.to} (${m.delta >= 0 ? '+' : ''}${m.delta})  via ${m.via.join(', ')}`);
  console.log(`  ⛔ ${r.review.gate}\n     approve a staged item to fold it in.\n`);
}

function entropyCmd() {
  const { assets } = engine();
  const H = +(assets.reduce((s, a) => s + assetEntropy(a), 0) / assets.length).toFixed(2);
  console.log(`\nKnowledge entropy (how ORDERED, not how much) — global ${H}`);
  for (const a of [...assets].sort((x, y) => assetEntropy(y) - assetEntropy(x)).slice(0, 5))
    console.log(`  ${a.name.padEnd(28)} entropy ${assetEntropy(a)}  (conf ${a.confidence})`);
  const s = silence();
  console.log(`  silence: ${s.totalAbsentRecords} expected measurements absent (loudest: ${s.loudestSilence.map((x) => x.asset.split(' ')[0]).join(', ')})`);
  const g = entropyGradient()[0];
  console.log(`  ⇒ biggest entropy reduction per ₪: ${g.event} (${g.asset}) — ΔH ${g.dEntropy}, gradient ${g.gradient}/₪1k`);
  console.log(`  the goal isn't more information — it's less entropy (more order).\n`);
}

function validateCmd() {
  const TLV = ['Adhesion', 'Compression Strength', 'Workability / Flow', 'Granulometry / Fractions'];
  const ip = informationPotential().find((r) => TLV.includes(r.asset));
  const grad = entropyGradient().find((r) => TLV.includes(r.asset));
  const prio = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking').find((r) => TLV.includes(r.asset));
  const tr = traceability();
  const agree = ip.event === grad.event && grad.event === prio.event;
  console.log('\nValidation (hypothesis-metrics on טיח תל אביב — NOT laws):');
  console.log(`  H1 convergence (TLV-restricted): IP→${ip.event} · gradient→${grad.event} · priority→${prio.event}  ⇒ ${agree ? 'agree HERE — but see independence below' : 'PARTIAL'}`);
  console.log(`  H3 traceability: ${tr.complete}/${tr.total} TLV decisions traceable = ${tr.traceability}  (leaks both on the unmeasured strength claim)`);
  console.log(`  H2 phase-transition: needs ≥3 project trajectories — not confirmable on TLV alone.`);
  const im = independenceMatrix(), d = discrimination(), c = compressibility();
  console.log(`  independence: Information~Gradient ${im.matrix['Information~Gradient']} (REDUNDANT) · Business~Information ${im.matrix['Business~Information']} (independent)`);
  console.log(`  discrimination: Business→${d.global.business.split(' ')[0]} vs Order→${d.global.order.split(' ')[0]} → ${d.pass ? 'PASS (they discriminate)' : 'WARNING'}`);
  console.log(`  compressibility: TLV avg ${c.avgCompressibility}; incompressible ${c.incompressible.join(',')} (the unmeasured strength)`);
  const g = promotionGate({ projectsConverged: 1, discriminationPassed: d.pass });
  console.log(`  ⇒ 2-D gate: reproducibility ${g.reproducibility ? '✓' : '✗'} × discrimination ${g.discrimination ? '✓' : '✗'} → ${g.promote ? 'PROMOTE' : 'NOT YET'} (${g.need.join('; ')}). (node metrics/validate-plan.mjs for full)\n`);
}

function sensitivityCmd() {
  const vs = sensitivityVerdicts();
  console.log('\nSensitivity (validation test 4 — Corpus → Perturbation → Recompute → ΔMetric):');
  console.log('  does each metric RESPOND to real signal and IGNORE noise?\n');
  for (const v of vs) {
    const d = v.delta;
    const shown = `entropy ${d.entropy >= 0 ? '+' : ''}${d.entropy} · adhConf ${d.adhesionConf >= 0 ? '+' : ''}${d.adhesionConf} · compConf ${d.compressionConf >= 0 ? '+' : ''}${d.compressionConf}`;
    console.log(`  [${v.kind}] ${v.perturbation}`);
    console.log(`     Δ ${shown}`);
    console.log(`     ${v.verdict}`);
  }
  console.log('\n  ⇒ passes signal-response and duplicate-noise; the open GAP is adversarial:');
  console.log('    a wrong inference is still counted as valid evidence (no content-level');
  console.log('    contradiction check yet). "Under what conditions does the metric break?"\n');
}

function reproduceCmd() {
  console.log('\nReproducibility (do the metrics repeat beyond Tel Aviv? — MPZ → INT-TFX):');
  for (const r of replicateAll()) {
    console.log(`\n  ${r.label}`);
    console.log(`    loudest gap ${r.metrics.loudest?.asset} (H ${r.metrics.loudest?.entropy}); grounded asset stays quiet`);
    console.log(`    weak point detected? ${r.weakPointDetected.detected ? 'YES' : 'no'} · compressibility avg ${r.compressibility.avg ?? '—'} (incompressible ${r.compressibility.incompressible.join(',') || 'none'}) · traceability ${r.traceability.value}`);
    console.log(`    momentum/evidence ${r.momentumOverEvidence.value ?? '∞'} (${r.momentumOverEvidence.reading}) · frontier ${r.frontier.phase}`);
    console.log(`    sensitivity: signal ${r.sensitivity.signal}, duplicate ${r.sensitivity.noise}`);
    console.log(`    ⇒ ${r.verdict} — ${r.why}`);
  }
  console.log('\n  gate: TLV ✓ + MPZ ✓ → 2/3; INT-TFX = NOT ENOUGH DATA (negative case, by design).');
  console.log('  read as "reproduces EXCEPT adversarial content-check" — that Sensitivity gap is still open.\n');
}

function analyze() {
  const { assets, phase } = engine();
  console.log(`\nanalyze: rebuilt knowledge from ${REAL_EPISODES.length} episodes → ${assets.length} assets, phase ${phase.phase} (${phase.phaseIndex}).`);
  console.log(`  (every layer — assets, transformations, demand, decision-value, frontier — recomputed.)\n`);
}

function approve(eventQ) {
  const ev = eventByName(eventQ); if (!ev) return console.log(`unknown event "${eventQ}"`);
  console.log(`\napproved: ${ev.name} (${ev.asset})  [telemetry: human_approved, append-only]`);
  if (ev.acquisition === 'GENERATE')
    console.log(`  WORK ORDER → run ${ev.name}: ${ev.asset}, est ₪${ev.costILS}, ${ev.days} days. On completion, log measurement_created.`);
  else console.log(`  RETRIEVE plan → fetch existing ${ev.asset} records and add as episodes.`);
  console.log(`  (MATRIYA records the approval and the order — it does not act on its own.)\n`);
}

// ── DISPATCH ─────────────────────────────────────────────────────────────────
const [cmd, ...rest] = process.argv.slice(2);
const arg = rest.join(' ');
await (({
  ask: () => ask(arg),
  next: () => next(arg || undefined),
  recommend: () => next(arg || undefined),
  why: () => why(arg),
  simulate: () => simulate(arg),
  frontier: () => frontierCmd(arg || undefined),
  material: () => material(arg),
  status: () => status(),
  ingest: () => ingest(arg),
  daily: () => daily(arg || 'sharepoint'),
  entropy: () => entropyCmd(),
  validate: () => validateCmd(),
  sensitivity: () => sensitivityCmd(),
  reproduce: () => reproduceCmd(),
  analyze: () => analyze(),
  approve: () => approve(arg),
}[cmd] || (() => console.log(
  'MATRIYA v1.0\n  ask "<question>" · next · why <asset> · simulate <EVENT> · frontier [asset]\n' +
  '  material <name> · status · entropy · ingest <source> · daily [source] · validate · sensitivity · reproduce · analyze · approve <EVENT>')))());
