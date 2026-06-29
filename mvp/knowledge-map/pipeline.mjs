// Daily Knowledge Pipeline — scan → understand → index → review.  GOVERNED.
//
// The recurring process the user asked for. Source-agnostic (SharePoint, Drive,
// …). It NEVER writes to the corpus on its own: it produces a REVIEW report and
// waits for human approval — the audit ("ביקורת") stage is the gate.
//
//   scan       pull a read-only inventory from a source adapter
//   understand classify each file → which Knowledge Asset / measured vs qualitative
//   index      STAGE candidate episodes (dry — not committed)
//   review     show what would change (assets, confidence, frontier, phase) for sign-off

import { REAL_EPISODES } from './domains/corpus.mjs';
import { DOMAIN, DOMAIN_MARKERS } from './domains/domains.mjs';
import { buildKnowledgeAssets } from './assets/knowledge-asset.mjs';
import { replayTransformations } from './transformations/transformation.mjs';
import { classifyFrontier, knowledgePhase } from './frontier/frontier.mjs';

const MEASURED_RE = /test|report|בדיקת|לחיצה|pull-?off|vicat|sieve|ניפוי|viscos|צמיגות|ΔE|dE|spectro|ספקטרו|salt.?spray|psd|compression|חוזק|density|משקל סגולי/i;

// Map a file (by its name) to a Knowledge Asset — test-type names first (a
// "Pull-off report" → Adhesion), then the content markers as a fallback.
const TEST_ASSET = [
  [/pull-?off|cross-?cut|bond strength|הידבקות|מאמץ ניתוק/i, DOMAIN.ADHESION],
  [/salt.?spray|freeze.?thaw|w-?value|water.?uptake|ספיגת מים|driving.?rain/i, DOMAIN.WATER],
  [/vicat|set.?time|setting|זמן התקשרות|אשפרה|cure/i, DOMAIN.SETCURE],
  [/compress|לחיצה|חוזק|\bMPa\b|strength/i, DOMAIN.COMPRESSION],
  [/sieve|ניפוי|\bpsd\b|granulom|מסרק|malvern/i, DOMAIN.GRANULOMETRY],
  [/ΔE|\bdE\b|spectro|ספקטרו|colou?r|גוון|lab\*/i, DOMAIN.COLOR],
  [/viscos|צמיגות|brookfield|rheolog/i, DOMAIN.WORKABILITY],
  [/fire|burn|שריפה|\bאש\b|EN.?13381|intumesc/i, DOMAIN.FIRE],
  [/density|משקל סגולי|g\/cm/i, DOMAIN.DENSITY],
];

// ── understand: classify one file to a Knowledge Asset + a signal level ──────
function understandFile(f) {
  let asset = TEST_ASSET.find(([re]) => re.test(f.name))?.[1] || null;
  if (!asset) for (const [domain, re] of Object.entries(DOMAIN_MARKERS)) if (re.test(f.name)) { asset = domain; break; }
  const signal = asset && MEASURED_RE.test(f.name) ? 'measured' : asset ? 'qualitative' : null;
  return asset ? { ...f, asset, signal } : { ...f, asset: null, signal: null, skipped: 'no property match' };
}

// ── index: STAGE candidate episodes (dry — nothing committed) ───────────────
function stageEpisodes(understood, source) {
  return understood.filter((u) => u.asset).map((u, i) => ({
    id: `STAGE-${i}`, product: `${source}:${u.drive || 'root'}`,
    domains: [{ domain: u.asset, signal: u.signal, note: u.name }], materials: [],
    _file: u.name,
  }));
}

const phaseOf = (eps) => {
  const assets = buildKnowledgeAssets(eps);
  return { assets, phase: knowledgePhase(classifyFrontier(assets, replayTransformations(eps))) };
};

// ── review: what WOULD change if the staged episodes were approved ──────────
export function review(staged) {
  const base = phaseOf(REAL_EPISODES);
  const next = phaseOf([...REAL_EPISODES, ...staged]);
  const byName = (arr) => Object.fromEntries(arr.map((a) => [a.name, a]));
  const b = byName(base.assets), n = byName(next.assets);
  const moved = [];
  for (const name of Object.keys(n)) {
    const d = +(n[name].confidence - (b[name]?.confidence ?? 0)).toFixed(2);
    if (d !== 0) moved.push({ asset: name, from: b[name]?.confidence ?? 0, to: n[name].confidence, delta: d,
      via: staged.filter((s) => s.domains[0].domain === name).map((s) => s._file) });
  }
  return {
    staged: staged.length,
    measured: staged.filter((s) => s.domains[0].signal === 'measured').length,
    assetsMoved: moved.sort((a, b) => b.delta - a.delta),
    phaseBefore: base.phase.phaseIndex, phaseAfter: next.phase.phaseIndex,
    gate: 'PENDING HUMAN REVIEW — nothing written to the corpus until you approve',
  };
}

/** Run the full daily pipeline on a scan result (inventory). Review-only. */
export function runDaily(scanResult, source = 'sharepoint') {
  if (!scanResult?.ok) return { ok: false, stage: 'scan', reason: scanResult?.reason || 'no inventory' };
  const understood = scanResult.inventory.map(understandFile);
  const classified = understood.filter((u) => u.asset);
  const staged = stageEpisodes(understood, source);
  return {
    ok: true,
    scan: { files: scanResult.inventory.length, source },
    understand: { classified: classified.length, skipped: understood.length - classified.length,
      byAsset: classified.reduce((m, u) => ((m[u.asset] = (m[u.asset] || 0) + 1), m), {}) },
    index: { staged: staged.length },
    review: review(staged),
  };
}
