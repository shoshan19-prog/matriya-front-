// SAMPLE telemetry feed — illustrative events of the 7 allowed types, to exercise
// the recorder + aggregators. Real Router/PROTEUS/lab events replace this verbatim
// (same shapes). Marked SAMPLE; nothing here is real traffic.

export const SAMPLE_EVENTS = [
  // router_miss / hit — what users actually asked for and whether the asset answered
  { type: 'router_miss', asset: 'Adhesion', query: 'pull-off strength of TLV render?' },
  { type: 'router_miss', asset: 'Adhesion', query: 'does it crack on concrete?' },
  { type: 'router_miss', asset: 'Adhesion', query: 'bond strength vs substrate' },
  { type: 'router_miss', asset: 'Adhesion', query: 'adhesion after freeze-thaw' },
  { type: 'router_miss', asset: 'Adhesion', query: 'why returns on exterior job' },
  { type: 'router_miss', asset: 'Adhesion', query: 'cross-cut rating' },
  { type: 'router_miss', asset: 'Adhesion', query: 'wet adhesion' },
  { type: 'router_miss', asset: 'Adhesion', query: 'primer needed?' },
  { type: 'router_miss', asset: 'Adhesion', query: 'adhesion spec for tender' },
  { type: 'router_miss', asset: 'Set / Cure', query: 'set time MPZ 10?' },
  { type: 'router_miss', asset: 'Set / Cure', query: 'open time of the paint' },
  { type: 'router_miss', asset: 'Set / Cure', query: 'cure schedule winter' },
  { type: 'router_miss', asset: 'Set / Cure', query: 'when can second coat go on' },
  { type: 'router_miss', asset: 'Set / Cure', query: 'Vicat result' },
  { type: 'router_miss', asset: 'Compression Strength', query: 'sulfate resistance' },
  { type: 'router_miss', asset: 'Compression Strength', query: 'marine durability' },
  { type: 'router_miss', asset: 'Water Resistance / Moisture', query: 'w-value' },
  { type: 'router_miss', asset: 'Color / Shade', query: 'fade after 1 year sun' },
  { type: 'router_miss', asset: 'Color / Shade', query: 'batch-to-batch ΔE' },
  { type: 'router_hit',  asset: 'Compression Strength', query: 'MPZ20 28-day strength' },
  { type: 'router_hit',  asset: 'Color / Shade', query: 'KEIM 9457 match ΔE' },
  { type: 'router_hit',  asset: 'Workability / Flow', query: 'viscosity PROTECH A1' },
  { type: 'router_hit',  asset: 'Granulometry / Fractions', query: 'Kfar Giladi sieve' },

  // governance funnel: shown → approved/rejected → generated
  { type: 'recommendation_shown', event: 'FIRST_PULL_OFF', asset: 'Adhesion', priority: 4.23 },
  { type: 'human_approved',       event: 'FIRST_PULL_OFF', asset: 'Adhesion' },
  { type: 'experiment_generated', event: 'FIRST_PULL_OFF', asset: 'Adhesion' },
  { type: 'recommendation_shown', event: 'SALT_SPRAY', asset: 'Water Resistance / Moisture', priority: 0.50 },
  { type: 'human_rejected',       event: 'SALT_SPRAY', asset: 'Water Resistance / Moisture', reason: 'cost ₪18k, low business impact this year' },

  // outcome_recorded — real decisions + their results (becomes the real Decision Ledger)
  { type: 'outcome_recorded', decisionId: 'D-101', decision: 'TLV approved to bag', asset: 'Adhesion', mode: 'qualitative', outcome: 'success', businessValue: 0.80, note: 'no field cracks' },
  { type: 'outcome_recorded', decisionId: 'D-102', decision: 'MPZ Dec-2025 production reference', asset: 'Compression Strength', mode: 'measured', outcome: 'success', businessValue: 0.85 },
  { type: 'outcome_recorded', decisionId: 'D-103', decision: 'PROTECH A1 productized', asset: 'Fire Resistance', mode: 'measured', outcome: 'success', businessValue: 0.90 },
  // a decision that CHANGED because of newly generated knowledge (pull-off)
  { type: 'outcome_recorded', decisionId: 'D-104', decision: 'exterior render spec', asset: 'Adhesion', mode: 'measured',
    outcome: 'success', businessValue: 0.70, changedFrom: 'ship as-is', changedTo: 'require primer coat below 2.5 MPa pull-off',
    viaKnowledge: 'FIRST_PULL_OFF', note: 'pull-off data flipped the spec; returns expected to drop' },
];
