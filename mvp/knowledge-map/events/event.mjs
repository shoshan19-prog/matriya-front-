// Knowledge Event — the ATOM of learning (below the Transformation).
//
// A Transformation says "confidence changed". A Knowledge Event says WHAT caused
// it. Each transformation is COMPOSED OF events; the event is primary. With this
// atom we can finally measure: which experiments actually produce knowledge,
// which decisions changed understanding, and the ROI of each learning event.
//
//   ... Episodes → KNOWLEDGE EVENTS → Knowledge Assets → Transformations → ...
//
// ΔKnowledge is REAL (from the transformation replay). Cost/duration are an
// explicit ESTIMATE (a cost model) until wired to real Priority/procurement data.

import { replayTransformations, transformationType } from '../transformations/transformation.mjs';

// learning-type taxonomy (the kind of event, not the specific test)
export const EVENT_TYPE = {
  'opens-asset': 'OPEN_ASSET',
  'first-measured': 'FIRST_MEASUREMENT',
  'more-measured': 'MORE_MEASURED',
  'new-product-qualitative': 'NEW_PRODUCT_QUALITATIVE',
  'more-of-same': 'DUPLICATE_QUALITATIVE',
};

// Cost model — ILLUSTRATIVE ₪ per learning-event type (typical experiment behind it).
// Replace with real procurement/Priority data via the same governance.
export const COST_MODEL = {
  OPEN_ASSET:              { ils: 2000, days: 10 },
  FIRST_MEASUREMENT:       { ils: 4500, days: 21 },
  MORE_MEASURED:           { ils: 3000, days: 14 },
  NEW_PRODUCT_QUALITATIVE: { ils: 800,  days: 4 },
  DUPLICATE_QUALITATIVE:   { ils: 300,  days: 2 },
};

// curated: did this (product × asset) evidence actually change a production decision?
// (from the PRODUCT_STORY reconstructions — honest, sourced.)
const DECISION_CHANGED = new Set([
  'MPZ|Compression Strength',          // Dec-2025 controlled batch → production reference
  'GRANITAL|Color / Shade',            // per-shade tinting recipes approved
  'PROTECH A1|Fire Resistance',        // A1 cert → productized + 400 kg pilot
  'PROTECH A1|Workability / Flow',     // antifoam 162 → final formula
  'טיח תל אביב|Adhesion',              // cured, no cracks → approved to bag
]);

const REASON = {
  OPEN_ASSET: 'first evidence for this property',
  FIRST_MEASUREMENT: 'first quantitative evidence',
  MORE_MEASURED: 'additional measured evidence',
  NEW_PRODUCT_QUALITATIVE: 'same property seen in another product (qualitative)',
  DUPLICATE_QUALITATIVE: 'more of the same qualitative evidence',
};

/** Derive Knowledge Events (enriched atoms) from the real transformation replay. */
export function buildKnowledgeEvents(episodes) {
  const trans = replayTransformations(episodes);
  return trans.map((t, i) => {
    const type = EVENT_TYPE[transformationType(t)];
    const cost = COST_MODEL[type] || { ils: 1000, days: 5 };
    return {
      id: `EV-${String(i).padStart(3, '0')}`,
      type, asset: t.asset, evidence: t.product,
      conf_before: t.conf_before, conf_after: t.conf_after, dK: t.dConf,
      reason: REASON[type],
      costILS: cost.ils, durationDays: cost.days,
      decisionChanged: DECISION_CHANGED.has(`${t.product}|${t.asset}`),
      productsAffected: t.evidence_after && t.dProducts >= 0 ? undefined : undefined, // see asset.products
      surprise: t.surprise,
      // ROI of THIS event: knowledge produced per ₪1,000 spent (cost is an estimate)
      roiPer1k: +(t.dConf / (cost.ils / 1000)).toFixed(3),
    };
  });
}

export function renderEventCard(e) {
  return [
    'Knowledge Event',
    '────────────────────────────',
    `Type:              ${e.type}`,
    `Asset:             ${e.asset}`,
    `Evidence:          ${e.evidence}`,
    `Previous conf:     ${e.conf_before.toFixed(2)}`,
    `New conf:          ${e.conf_after.toFixed(2)}`,
    `ΔKnowledge:        ${e.dK >= 0 ? '+' : ''}${e.dK.toFixed(2)}`,
    `Reason:            ${e.reason}`,
    `Cost (est.):       ₪${e.costILS.toLocaleString()}`,
    `Duration (est.):   ${e.durationDays} days`,
    `Decision changed:  ${e.decisionChanged ? 'YES' : 'no'}`,
    `ROI (ΔK / ₪1,000): ${e.roiPer1k}`,
  ].join('\n');
}
