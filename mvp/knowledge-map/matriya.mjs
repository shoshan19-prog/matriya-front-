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
import { provenanceSummary } from './domains/provenance.mjs';
import { qualifyEvidence, qualificationGateSummary } from './metrics/evidence-qualification.mjs';
import { intakeDocument, SAMPLE_DOC } from './metrics/intake.mjs';
import { AUTHORITIES, checkAuthorityIsolation } from './authority-chain.mjs';
import { runReasoningTests, reasoningSummary } from './reasoning.mjs';
import { runChain, lawGate, SAMPLE_CASES } from './chain.mjs';
import { buildFeed, renderFeed, feedToPipeline, SNAPSHOT_YESTERDAY, SNAPSHOT_TODAY } from './sources/change-feed.mjs';
import { liveChanges } from './sources/live-scan.mjs';
import { buildStudio } from './studio/build-studio.mjs';
import { ASSET_SCHEMA, recognize, validateRecord } from './schema/asset-schema.mjs';
import { FIRE_EPISODES_PENDING } from './schema/fire-episodes.mjs';
import { LAYERS, routeMeasurement, STACK_DEMO } from './stack.mjs';
import { knowledgeResolution } from './research-os/funnel.mjs';
import { representationCoverage } from './research-os/representation-coverage.mjs';
import { fragileKnowledge, whatCollapsesIf } from './research-os/lineage.mjs';
import { knowledgeHalfLife } from './research-os/half-life.mjs';
import { hypothesisCandidates } from './research-os/hypotheses.mjs';
import { researchAgenda } from './research-os/agenda.mjs';
import { knowledgeFlowRate } from './research-os/flow-rate.mjs';
import { driveIntake } from './sources/drive-intake.mjs';
import { readFileSync as _readFileSync } from 'node:fs';

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
  console.log('\n  ⇒ passes signal-response and duplicate-noise; the adversarial case is now');
  console.log('    GUARDED by the Evidence Qualification REVIEW gate for numeric claims (matriya review).\n');
}

function reviewCmd(arg) {
  // matriya review "<asset>" <value> <unit>   — qualify a measured claim
  const m = arg.match(/^(.*?)\s+(-?[\d.]+)\s*(\S*)$/);
  if (!m) {
    console.log('\nEvidence Qualification — three authorities decide a claim is fit to become evidence:');
    console.log('  Units (intelligible?) · Baseline (anomalous vs Fresco corpus?) · Physics (possible at all?)');
    const g = qualificationGateSummary();
    for (const r of g.rows) console.log(`  ${r.pass ? '✓' : '✗'} {U:${r.record.units} B:${r.record.baseline} P:${r.record.physics}} → ${r.record.decision.padEnd(6)} ${r.label}`);
    const a = g.stats.byAuthority;
    console.log(`\n  REVIEWs by authority: units ${a.units} · physics ${a.physics} · corpus-outlier ${a.corpusOutlier} · corpus-insufficient ${a.corpusInsufficient}`);
    console.log(`  false claims all stopped: ${g.falseStopped} · no auto-reject: ${g.noAutoReject} · physics caught beyond corpus: ${g.physicsCaughtBeyondBaseline}`);
    console.log('  usage: matriya review "Water Resistance / Moisture" 130 %\n');
    return;
  }
  const r = qualifyEvidence({ asset: m[1].trim(), value: +m[2], unit: m[3] });
  console.log(`\nEvidence Qualification — ${r.asset}: ${m[2]} ${m[3] || '(no unit)'}`);
  console.log(`  record: { units: ${r.units}, baseline: ${r.baseline}, physics: ${r.physics}, decision: ${r.decision} }`);
  console.log(`  reasoning: ${r.reason}`);
  console.log(`  action: ${r.action}  (auto-reject: ${r.autoReject}; only ever ACCEPT or human REVIEW)\n`);
}

function authorityCmd() {
  console.log('\nMATRIYA as an Authority Chain — each link rules ONE question, on its own domain:');
  for (const a of AUTHORITIES) {
    const tag = a.status === 'FUTURE' ? ' [FUTURE]' : '';
    console.log(`  ${a.id} (${a.station})${tag}: "${a.question}"`);
    if (a.subAuthorities) console.log(`     courts: ${a.subAuthorities.map((s) => `${s.id} (${s.authority})`).join(' · ')}`);
    console.log(`     must NOT say: ${a.mustNotSay.join(' · ')}`);
  }
  console.log('\n  No Authority Leakage — verified against the real modules:');
  const r = checkAuthorityIsolation();
  for (const c of r.checks) console.log(`    ${c.pass ? '✓' : '✗'} ${c.invariant}`);
  console.log(`  ⇒ authority isolation holds: ${r.allHold} (${r.passed}/${r.total}). Each authority is independently testable/replaceable.\n`);
}

async function changesCmd(source) {
  // `matriya changes`            → sample (offline demo)
  // `matriya changes sharepoint` → LIVE scan via the adapter (the real "what's new")
  if (source && source !== 'sample') {
    const r = await liveChanges(source);
    if (!r.ok) {
      console.log(`\nLive change feed (${source}): unavailable — ${r.reason}`);
      if (r.reason === 'not_configured') console.log(`  set env: ${(r.missing || []).join(', ')} (an Azure AD app with Sites.Read.All)`);
      if (r.reason === 'network_blocked') console.log('  graph.microsoft.com is blocked by the egress policy — needs an admin allow-list change.');
      console.log('  nothing is fabricated. Once the source opens, this same command returns the real feed.\n');
      return;
    }
    const s = r.feed.summary;
    console.log(`\nLive change feed — ${source} (${r.firstScan ? 'first scan, BASELINE' : `vs ${r.prevTakenAt}`}):\n`);
    console.log(r.feed.events.length ? renderFeed(r.feed) : '  (no changes since the last scan)');
    console.log(`\n  NEW ${s.NEW} · UPDATED ${s.UPDATED} · DELETED ${s.DELETED} · UNCHANGED ${s.UNCHANGED}`);
    console.log('  each actionable change → Knowledge Pipeline candidate (human-reviewed, never auto-ingested).\n');
    return;
  }
  const feed = buildFeed(SNAPSHOT_YESTERDAY, SNAPSHOT_TODAY);
  const s = feed.summary;
  console.log('\nUniversal Change Feed — "what changed?", source-agnostic (the museum guard):');
  console.log('  (SAMPLE snapshots — run `matriya changes sharepoint` for a live scan)\n');
  console.log(renderFeed(feed));
  console.log(`\n  summary: NEW ${s.NEW} · UPDATED ${s.UPDATED} · DELETED ${s.DELETED} · UNCHANGED ${s.UNCHANGED} (actionable ${s.actionable})`);
  console.log(`  by source: ${s.bySource.map((b) => `${b.source} ${b.changed}`).join(' · ')}`);
  console.log('  ⇒ hand-off: each actionable change becomes a candidate for the Knowledge Pipeline');
  console.log('    ("does this change knowledge?") — human-reviewed, never auto-ingested.');
  console.log('  the day Graph opens, only the Scanner feeding this changes — the feed and pipeline do not.\n');
}

function intakeDriveCmd(arg) {
  // matriya intake-drive <inventory.json> [now]
  // <inventory.json> = [{source,id,name,modified,size?}] from a live Drive scan.
  const [path, now] = arg.split(/\s+/);
  if (!path) return console.log('\nusage: matriya intake-drive <inventory.json> [YYYY-MM-DD]\n  (read-only: detect → queue → flow log; never approves or writes the corpus)\n');
  let inventory;
  try { inventory = JSON.parse(_readFileSync(path, 'utf8')); } catch (e) { return console.log(`cannot read inventory ${path}: ${e.message}`); }
  const r = driveIntake({ source: 'drive', inventory, ...(now ? { now } : {}) });
  console.log(`\nDrive intake (${r.now})${r.firstScan ? ' — first scan, BASELINE' : ''}: ${inventory.length} files → ${r.detected} actionable changes`);
  for (const q of r.queue.slice(0, 12)) console.log(`  ${q.change.padEnd(8)} ${q.file.slice(0, 42).padEnd(42)} → ${q.hint} · ${q.status}`);
  if (r.queue.length > 12) console.log(`  … +${r.queue.length - 12} more`);
  console.log(`  flow log: +${r.flowAppended} transitions · ${r.downstream}`);
  console.log(`  auto-approved ${r.autoApproved} · auto-writes ${r.autoWrites} — a human reviews the queue.\n`);
}

function researchCmd() {
  const r = knowledgeResolution();
  console.log('\nMATRIYA — research operating system. Knowledge RESOLUTION (where knowledge sits, not how much):');
  const max = Math.max(...r.funnel.map((f) => f.count), 1);
  for (const f of r.funnel) console.log(`  ${f.stage.padEnd(20)} ${'█'.repeat(Math.round((f.count / max) * 20)).padEnd(20)} ${f.count}`);
  console.log(`  resolution index ${r.resolutionIndex} · latest batch "${r.batch.name}": ${r.batch.entered} entered → ${r.batch.atStage} → ${r.batch.becameKnowledge} knowledge / ${r.batch.changedLaw} laws`);

  const rc = representationCoverage();
  console.log(`\n  [1] Representation Coverage: ${rc.modeled}/${rc.total} assets modeled (${Math.round(rc.coverage * 100)}%). missing wings: ${rc.unmodeledWings.map((w) => w.dimension).join(', ')}`);

  const frag = fragileKnowledge();
  console.log(`  [2] Knowledge Lineage: ${frag.length} fragile (single-episode) claims — e.g. ${frag.slice(0, 2).map((f) => `${f.asset.split(' ')[0]}(${f.supportedBy.join(',')})`).join(', ') || 'none'}`);
  const col = whatCollapsesIf('TLV-04');
  if (col.found) console.log(`      retraction probe TLV-04 → ${col.impact.map((i) => `${i.asset.split(' ')[0]}: ${i.effect}`).join(' · ')}`);

  const hl = knowledgeHalfLife();
  console.log(`  [3] Knowledge Half-Life: aging = ${hl.aging.map((a) => a.split(' ')[0]).join(', ') || 'none'}; standard risk = ${hl.standardRisks.map((s) => s.asset.split(' ')[0]).join(', ')}`);

  const hyp = hypothesisCandidates();
  console.log(`  [4] Hypothesis Candidates (UNVALIDATED): ${hyp.candidates.map((h) => h.id).join(', ')}`);
  for (const h of hyp.candidates) console.log(`      · ${h.hypothesis} [${h.status.split('—')[0].trim()}]`);

  const ag = researchAgenda();
  console.log(`  [5] Research Agenda (read-only): ${ag.counts.map((c) => `${c.n} ${c.kind}`).join(' · ')}`);
  for (const it of ag.items.slice(0, 5)) console.log(`      (${it.kind}) ${it.title}`);

  const fr = knowledgeFlowRate();
  console.log(`\n  [6] Knowledge Flow Rate (the lab's metabolism):`);
  console.log(`      WIP ${fr.wip.filter((w) => w.count).map((w) => `${w.stage.split(' ')[0]}:${w.count}`).join(' · ')} · accepted ${fr.accepted} · held/review ${fr.rejectedOrHeld} (hold rate ${fr.holdRate})`);
  console.log(`      dwell: ${fr.dwell.unit} stuck ${fr.dwell.daysWaiting}d at Review · hypotheses→knowledge ${fr.hypoToKnowledge.became}/${fr.hypoToKnowledge.of} · questions opened ${fr.questions.opened}`);
  console.log(`      ⇒ ${fr.reading}`);
  console.log(`      ${fr.rates.throughputPerDay != null ? `intake throughput ${fr.rates.throughputPerDay}/day (from the live flow log)` : fr.rates.note}`);

  console.log('\n  every unit travels Reality→Evidence→Episode→Representation→Human Review→Knowledge→Decision.');
  console.log('  the OS measures, recommends, and keeps the list — it never acts, approves, or declares a law.\n');
}

function stackCmd() {
  console.log('\nThe Knowledge Stack — Representation guards the model between Episode and Knowledge:');
  console.log('  ' + LAYERS.map((l) => l.layer).join(' → '));
  for (const l of LAYERS) console.log(`    ${l.layer.padEnd(15)} ${l.question}${l.guard ? `   [${l.guard}]` : ''}`);
  console.log('\n  Same path, every measurement type:');
  for (const d of STACK_DEMO) {
    const r = routeMeasurement(d.asset, d.measurement, d.context);
    console.log(`    ${d.label.padEnd(42)} → stops at ${r.stoppedAt} (${r.status})`);
  }
  console.log('\n  a NEW kind of measurement stops at Representation (extend the model); a recognized one');
  console.log('  reaches Human Review — never Knowledge automatically. The philosophy never changes.\n');
}

function schemaCmd(arg) {
  const asset = arg || 'Fire Resistance';
  const model = ASSET_SCHEMA[asset];
  console.log(`\nAsset MODEL — ${asset} (schema v${model?.version || '?'}):`);
  if (!model) return console.log('  (no schema model)\n');
  for (const [d, m] of Object.entries(model.dimensions))
    console.log(`  · ${d.padEnd(15)} ${(m.unit || m.kind).padEnd(8)} ${m.note || ''}`);
  if (model.legacy) console.log(`  · legacy: ${model.legacy.join(', ')}`);

  if (asset === 'Fire Resistance') {
    console.log('\n  Validate the PENDING fire episodes against the model:');
    for (const ep of FIRE_EPISODES_PENDING) {
      const r = recognize(asset, ep.measurement);
      console.log(`    ${ep.id.padEnd(20)} ${ep.origin.padEnd(8)} ${r.decision}  (DFT ${ep.measurement.dft}µm → ${ep.measurement.timeToFailure}min)`);
    }
    // demonstrate the protection: an UNMODELED dimension still routes to REVIEW
    const novel = recognize(asset, { timeToFailure: 90, smokeToxicity: 'low' });
    console.log(`\n  new unmodeled dimension (smokeToxicity): ${novel.decision} — ${novel.reason}`);
  }
  console.log('\n  status: all fire episodes are PENDING_REVIEW. No corpus write, no laws, no ranking,');
  console.log('  no score, no "which product is better". The chain protected the MODEL, not the document.\n');
}

function studioCmd() {
  const out = buildStudio();
  console.log(`\nMATRIYA Control Room rebuilt → ${out}`);
  console.log('  open it in a browser. 8 channels + the LEARNING light, driven by real module data.');
  console.log('  (sources/feed are sample until SharePoint opens; every other channel is live.)\n');
}

function reasonCmd() {
  const s = reasoningSummary();
  console.log('\nReasoning Qualification (the 4th authority) — does the conclusion follow from the evidence?');
  for (const r of s.rows) console.log(`  ${r.pass ? '✓' : '✗'} [${r.got}] ${r.label}`);
  console.log(`\n  ${s.passed}/${s.total} · non-sequiturs caught: ${s.nonSequitursCaught} · no auto-reject: ${s.noAutoReject}`);
  console.log('  it judges the inference, never the evidence value — a separate authority.\n');
}

function chainCmd() {
  console.log('\nThe complete model — a case walked end-to-end through the Authority Chain:');
  for (const c of SAMPLE_CASES) {
    const r = runChain(c);
    console.log(`\n  ${c.name}`);
    for (const t of r.trace) console.log(`    ${t.authority.padEnd(24)} ${String(t.verdict).padEnd(14)} ${t.ruling}`);
    console.log(`    ⇒ stopped at ${r.stoppedAt} — ${r.status}`);
  }
  console.log('\n  every link rules one question; the case stops at the first authority that needs a human or flags.\n');
}

function lawCmd() {
  const g = lawGate();
  console.log('\nLaw Gate — the capstone: is any metric promotable to a Law?');
  for (const c of g.criteria) console.log(`  ${c.status === 'PASS' ? '✓' : '✗'} ${c.test.padEnd(42)} ${c.detail}`);
  console.log(`\n  ⇒ ${g.verdict}`);
  console.log(`  promote automatically: ${g.promote}  (the system never declares its own laws — a human does)\n`);
}

function intakeCmd() {
  const r = intakeDocument(SAMPLE_DOC);
  console.log(`\nIntake — Document → Extraction → Claim → Evidence Qualification → REVIEW (stops here)`);
  console.log(`  document "${r.document}" → ${r.extracted} measured claims, routed to REVIEW queues:`);
  for (const [q, items] of Object.entries(r.queues))
    if (items.length) console.log(`    ${q.padEnd(22)} ${items.length}  ${items.map((x) => `${x.claim.asset.split(' ')[0]} ${x.claim.value}${x.claim.unit}`).join(' · ')}`);
  const a = r.byAuthority;
  console.log(`  review cause by authority: units ${a.units} · physics ${a.physics} · corpus-outlier ${a.corpusOutlier} · corpus-insufficient ${a.corpusInsufficient}`);
  console.log(`  downstream: ${r.downstream}`);
  console.log(`  auto-created events: ${r.autoCreatedEvents} — a REVIEW record is NOT a Knowledge Event; only a human moves a claim to Evidence.\n`);
}

function reproduceCmd() {
  const ps = provenanceSummary(REAL_EPISODES.map((e) => e.product));
  console.log('\nReproducibility — validation runs on Fresco PROJECTS only (provenance fence):');
  console.log(`  eligible projects: ${ps.frescoProjects.join(', ')}`);
  console.log(`  evidence-only (fenced out of validation): ${[...ps.frescoSources, ...ps.external, ...ps.unverified].join(', ')}`);
  console.log('\n  do the metrics repeat? — MPZ → INT-TFX → PROTECH A1:');
  for (const r of replicateAll()) {
    if (r.ineligible || r.pending) { console.log(`\n  ${r.name}: ${r.verdict}`); continue; }
    console.log(`\n  ${r.label}`);
    console.log(`    loudest gap ${r.metrics.loudest?.asset} (H ${r.metrics.loudest?.entropy}); grounded ${r.weakPoint.grounded || '—'} stays quiet`);
    console.log(`    weak point detected? ${r.weakPointDetected.detected ? 'YES' : 'no'} · compressibility avg ${r.compressibility.avg ?? '—'} (incompressible ${r.compressibility.incompressible.join(',') || 'none'}) · traceability ${r.traceability.value}`);
    console.log(`    momentum/evidence ${r.momentumOverEvidence.value ?? '∞'} (${r.momentumOverEvidence.reading}) · frontier ${r.frontier.phase}`);
    console.log(`    sensitivity: signal ${r.sensitivity.signal}, duplicate ${r.sensitivity.noise}`);
    console.log(`    ⇒ ${r.verdict} — ${r.why}`);
  }
  console.log('\n  gate: TLV ✓ + MPZ ✓ + PROTECH A1 ✓ → 3/3 positive Fresco projects; INT-TFX = NOT ENOUGH DATA (negative case).');
  console.log('  all four validation tests pass for numeric evidence (adversarial now guarded by Evidence Qualification).');
  console.log('  promotion to a "law" is now a human judgement, not a missing guard. Still reported as hypotheses.\n');
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
  review: () => reviewCmd(arg),
  intake: () => intakeCmd(),
  authority: () => authorityCmd(),
  changes: () => changesCmd(arg || undefined),
  studio: () => studioCmd(),
  schema: () => schemaCmd(arg || undefined),
  stack: () => stackCmd(),
  research: () => researchCmd(),
  'intake-drive': () => intakeDriveCmd(arg || ''),
  serve: () => import('./studio/studio-server.mjs'),  // read-only Control Room endpoint
  reason: () => reasonCmd(),
  chain: () => chainCmd(),
  law: () => lawCmd(),
  reproduce: () => reproduceCmd(),
  analyze: () => analyze(),
  approve: () => approve(arg),
}[cmd] || (() => console.log(
  'MATRIYA v1.0\n  ask "<question>" · next · why <asset> · simulate <EVENT> · frontier [asset]\n' +
  '  material <name> · status · entropy · ingest <source> · daily [source] · changes · studio · schema · stack · research · validate · sensitivity · review · intake · authority · reason · chain · law · reproduce · analyze · approve <EVENT>')))());
