// Knowledge Episode — the central unit of MATRIYA (not the file, not the product).
//
// An episode is one decision cycle a lab actually remembers:
//   Question → Hypothesis → Experiment → Results → Decision → Why → Next Action
// Many files (Compression.xlsx, Brookfield.xlsx, SEM.jpg, an email, a Priority doc)
// belong to ONE episode, unified by their shared identity anchor (experiment/
// version/batch) from the Knowledge Identity Engine. Decision Memory closes it:
//   Decision → Reason → Evidence → Confidence.

const j = (docs) => docs.map((d) => d.content || '').join('  \n');

// the anchor that unifies files into an episode (strongest identity first)
export function anchorKey(d) {
  const a = d.anchor || {};
  return a.experiment || (a.product && a.version ? `${a.product}|${a.version}` : null) || a.batch || a.version || null;
}

const grab = (re, t) => { const m = re.exec(t); return m ? (m[1] || m[0]).trim() : null; };

function extractResults(docs) {
  const out = [];
  for (const d of docs) for (const m of (d.content || '').matchAll(/(\d+(?:\.\d+)?)\s?(MPa|cps|CPS|µm|um|%RH|°C|g\/cm3)/g))
    out.push({ value: +m[1], unit: m[2], source: d.id, source_name: d.name });
  return out;
}

function extractDecision(text, results, docs) {
  const neg = /(לא מספיק|נכשל|קרס|פסול|insufficient|fail|rejected|not enough|too low)/i.exec(text);
  const pos = /(מספיק|הצליח|production|אושר|approved|success|passed)/i.exec(text);
  const outcome = neg ? 'rejected' : pos ? 'accepted' : 'open';
  const reason = grab(/(?:כי|בגלל|because|due to)\s+([^.;\n]{3,80})/i, text);
  const explicit = !!(neg || pos);
  return {
    outcome, reason: reason || null,
    evidence: [...results.map((r) => `${r.value}${r.unit} (${r.source_name})`), ...docs.map((d) => d.id)],
    confidence: explicit ? (reason ? 0.9 : 0.7) : 0.4,   // higher when a reason is recorded
  };
}

export function assembleEpisode(docs, idx) {
  const text = j(docs);
  const results = extractResults(docs);
  const decision = extractDecision(text, results, docs);
  const product = docs.map((d) => d.anchor?.product).find(Boolean) || null;
  const anchor = { experiment: docs.map((d) => d.anchor?.experiment).find(Boolean) || null, version: docs.map((d) => d.anchor?.version).find(Boolean) || null, batch: docs.map((d) => d.anchor?.batch).find(Boolean) || null, product };
  return {
    episode_id: `EP-${String(idx).padStart(3, '0')}`,
    anchor, product,
    question: grab(/([^.\n]*\?)/, text),
    hypothesis: grab(/(?:השערה|hypothesis)\s*[:\-]\s*([^.;\n]{3,80})/i, text) || grab(/\b(?:להגדיל|להעלות|להחליף|raise|increase|replace)\s+([^.;\n]{3,60})/i, text),
    experiment: { id: anchor.experiment || anchor.version || anchor.batch },
    results,
    decision,                      // Decision Memory
    why: decision.reason,
    next_action: grab(/(?:next|לנסות|להעלות בהמשך|פעולה הבאה|next action)\s*[:\-]?\s*([^.;\n]{3,80})/i, text),
    documents: docs.map((d) => d.id),
    doc_types: [...new Set(docs.map((d) => (d.name || '').split('.').pop()))],
  };
}

/** Group normalized docs into episodes by their identity anchor. */
export function buildEpisodes(docs) {
  const groups = new Map();
  let unassigned = 0;
  for (const d of docs) { const k = anchorKey(d); if (!k) { unassigned++; continue; } (groups.get(k) || groups.set(k, []).get(k)).push(d); }
  const episodes = [...groups.values()].map((g, i) => assembleEpisode(g, 248 + i)); // demo numbering
  return { episodes, unassigned };
}
