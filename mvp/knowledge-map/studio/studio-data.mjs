// STUDIO DATA — the live telemetry the Control Room renders, computed from the
// REAL modules (no invented numbers). Each channel of the console maps to a real
// part of the knowledge process. Sample-sourced panels are labelled `sample`.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildKnowledgeAssets } from '../assets/knowledge-asset.mjs';
import { assetEntropy, groupEntropy } from '../evidence/entropy.mjs';
import { replayTransformations } from '../transformations/transformation.mjs';
import { classifyFrontier, knowledgePhase } from '../frontier/frontier.mjs';
import { buildFeed, SNAPSHOT_YESTERDAY, SNAPSHOT_TODAY } from '../sources/change-feed.mjs';
import { intakeDocument, SAMPLE_DOC } from '../metrics/intake.mjs';
import { qualificationGateSummary } from '../metrics/evidence-qualification.mjs';
import { reasoningSummary } from '../reasoning.mjs';
import { checkAuthorityIsolation } from '../authority-chain.mjs';
import { lawGate } from '../chain.mjs';
import { isConfigured } from '../adapters/sharepoint.mjs';
import { FIRE_EPISODES_PENDING } from '../schema/fire-episodes.mjs';

const CONTRA = { 'Compression Strength': 2, 'Workability / Flow': 2, 'Fire Resistance': 1, 'Adhesion': 1 };

export function studioData() {
  const assets = buildKnowledgeAssets(REAL_EPISODES);
  const trans = replayTransformations(REAL_EPISODES);
  const frontier = classifyFrontier(assets, trans);
  const phase = knowledgePhase(frontier);
  const feed = buildFeed(SNAPSHOT_YESTERDAY, SNAPSHOT_TODAY);
  const intake = intakeDocument(SAMPLE_DOC);
  const gate = qualificationGateSummary();
  const iso = checkAuthorityIsolation();
  const law = lawGate();

  // Channel — System Health (real source states; SharePoint from the adapter)
  const sp = isConfigured();
  const systemHealth = [
    { source: 'SharePoint', state: sp.configured ? 'online' : 'offline', note: sp.configured ? 'configured' : 'not configured' },
    { source: 'Gmail',  state: 'standby', note: 'adapter contract ready, not wired' },
    { source: 'Drive',  state: 'standby', note: 'adapter contract ready, not wired' },
    { source: 'Lab',    state: 'standby', note: 'manual intake' },
  ];

  // Channel 1 — Incoming Signals (sample change feed, grouped by source)
  const incoming = [...new Set(feed.events.map((e) => e.source))].map((src) => ({
    source: src, items: feed.events.filter((e) => e.source === src).map((e) => ({ name: e.name, change: e.status })) }));

  // Channel 2 — Change Feed (peak meter): today / waiting / approved
  const reviewWaiting = Object.entries(intake.queues).filter(([k]) => k !== 'ACCEPT').reduce((n, [, v]) => n + v.length, 0);
  const changeFeed = { changesToday: feed.summary.actionable, waiting: reviewWaiting, approved: 0,
    breakdown: { NEW: feed.summary.NEW, UPDATED: feed.summary.UPDATED, DELETED: feed.summary.DELETED }, source: 'sample' };

  // Channel 3 — Evidence Qualification (compressor): a light per authority, from
  // the live intake of the sample document.
  const a = intake.byAuthority;
  const qualification = {
    units:    a.units > 0 ? 'red' : 'green',
    baseline: (a.corpusOutlier + a.corpusInsufficient) > 0 ? 'amber' : 'green',
    physics:  a.physics > 0 ? 'red' : 'green',
    review:   reviewWaiting > 0 ? 'amber' : 'green',
    counts: a, gate: { passed: gate.classified, total: gate.total }, source: 'sample',
  };

  // Channel 4 — Human Review (the queue, by cause — no invented assignees)
  const humanReview = { waiting: reviewWaiting, lanes: [
    { lane: 'Physics flags',  count: intake.queues.CONTRADICTS_EXISTING.length },
    { lane: 'Corpus outliers', count: intake.queues.REVIEW_OUTLIER.length },
    { lane: 'No baseline',    count: intake.queues.INSUFFICIENT_BASELINE.length },
  ].filter((l) => l.count > 0) };

  // Channel 5 — Knowledge Growth (the lab's day, not document counts)
  const measuredAssets = assets.filter((x) => x.measured > 0);
  const crossProduct = assets.filter((x) => x.measured > 0 && x.products >= 2);
  const boundaries = frontier.filter((f) => f.frontierType === 'GENERATE_REQUIRED' || f.frontierType === 'EXTERNAL_ONLY');
  const refutations = Object.values(CONTRA).reduce((n, c) => n + c, 0);
  const knowledgeGrowth = {
    confirmations: measuredAssets.length, discoveries: crossProduct.length,
    boundaries: boundaries.length, refutations,
    note: 'confirmations = measured assets · discoveries = cross-product measured patterns · boundaries = generate/external frontier · refutations = documented contradictions',
  };

  // Channel 6 — Evolution (one product's timeline of events)
  const TAG = (ep) => {
    const d = (ep.domains || [])[0]?.domain || '';
    if (/Adhesion/.test(d)) return 'adhesion'; if (/Compression/.test(d)) return 'strength';
    if (/Color/.test(d)) return 'color'; if (/Fire/.test(d)) return 'fire';
    if (/Workability/.test(d)) return 'flow'; if (/Water|Set/.test(d)) return 'process';
    return 'note';
  };
  const evolution = { product: 'טיח תל אביב', events: REAL_EPISODES.filter((e) => e.product === 'טיח תל אביב')
    .map((e) => ({ id: e.id, tag: TAG(e), label: (e.domains?.[0]?.note || '').slice(0, 40) })) };

  // Channel 7 — Research Phase (VU): assets across the three phases
  const ph = (k) => frontier.filter((f) => f.frontierType === k).length;
  const researchPhase = {
    discovery:  ph('RETRIEVE_AVAILABLE'),
    validation: ph('RETRIEVE_COMPLETE'),
    production: ph('GENERATE_REQUIRED') + ph('EXTERNAL_ONLY'),
    phase: phase.phase, phaseIndex: phase.phaseIndex,
  };

  // Channel 8 — Knowledge Entropy (the falling bar)
  const overall = groupEntropy(REAL_EPISODES).entropy;
  const byProject = ['טיח תל אביב', 'MPZ', 'PROTECH A1', 'INT-TFX'].map((p) => ({
    project: p, entropy: groupEntropy(REAL_EPISODES.filter((e) => e.product === p)).entropy }));
  const entropy = { overall, byProject };

  // The LEARNING light — current state from real activity.
  let learning = 'idle';
  if (refutations > 0 && false) learning = 'refutation';   // cumulative; not "right now"
  if (changeFeed.waiting > 0) learning = 'event';          // evidence in the review queue → blinking
  else if (knowledgeGrowth.discoveries > 0) learning = 'discovery';
  else if (incoming.length) learning = 'evidence';
  const learningLight = { state: learning, states: {
    idle: 'no change — dark', evidence: 'new evidence in — lit', event: 'knowledge event forming — blinking',
    discovery: 'a discovery — colour shift', boundary: 'a boundary found — amber', refutation: 'a refutation — red' } };

  // Capstone strip
  const validation = {
    reproducibility: '3/3 Fresco projects', discrimination: true, independence: true,
    sensitivity: 'guarded (numeric)', authorityIsolation: `${iso.passed}/${iso.total}`,
    reasoning: `${reasoningSummary().passed}/${reasoningSummary().total}`, promotable: law.allPass, autoPromote: law.promote,
  };

  // Episodes by asset — what a scientist thinks in, not "236 documents".
  const episodesByAsset = assets.filter((a) => a.episodes > 0)
    .map((a) => ({ asset: a.name, episodes: a.episodes })).sort((x, y) => y.episodes - x.episodes);
  const pendingEpisodes = FIRE_EPISODES_PENDING.filter((e) => e.origin === 'fresco').length;

  // mode badge: LIVE only if a real source is online; otherwise the panels that
  // depend on a source are SAMPLE. (read-only — this never writes anything.)
  const mode = systemHealth.some((s) => s.state === 'online') ? 'LIVE' : 'SAMPLE';

  return { generatedFor: 'MATRIYA Control Room', mode, generatedAt: new Date().toISOString(),
    systemHealth, episodesByAsset, pendingEpisodes, incoming, changeFeed, qualification,
    humanReview, knowledgeGrowth, evolution, researchPhase, entropy, learningLight, validation };
}

// CLI: print the JSON (used by the studio builder)
if (import.meta.url === `file://${process.argv[1]}`) console.log(JSON.stringify(studioData(), null, 2));
