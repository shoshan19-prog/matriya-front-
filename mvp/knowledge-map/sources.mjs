// Knowledge Source Map — replaces the static "Source Registry".
//
// A Source Registry says WHERE files are. A Knowledge Source Map says WHAT KIND
// OF KNOWLEDGE each *source type* holds, and where it is strong vs weak. The
// unit is the source TYPE (formula sheet, weekly report, Priority, email…),
// not the individual file — so a new source (Teams, Slack, a service desk) is
// added as one row + an adapter, with no change to the engines downstream.

// Canonical knowledge types — the things an R&D memory is actually made of.
export const KTYPE = {
  INPUT: 'INPUT',             // what we put in (formulation)
  MEASUREMENT: 'MEASUREMENT', // what was measured (strength, density, viscosity…)
  DECISION: 'DECISION',       // what was decided
  REASON: 'REASON',           // WHY / mechanism
  HYPOTHESIS: 'HYPOTHESIS',   // what we expected
  DEAD_END: 'DEAD_END',       // what was tried and failed, and why
  SUPPLIER: 'SUPPLIER',       // supplier / external-material knowledge
  BATCH: 'BATCH',             // operational production truth
  VISUAL: 'VISUAL',           // real-world physical state
};

// The map: per source TYPE — what it knows, its strength, its weakness, and the
// knowledge types it is *expected* to carry (the prior, before calibration).
// `expert` stars (0–5) encode the user's table + Fresco domain knowledge.
export const SOURCE_MAP = [
  { id: 'formula_sheet', label: 'פורמולציות', knows: 'what we put in',
    strength: 'high', weakness: 'never explains why',
    expert: { INPUT: 5, MEASUREMENT: 1, DECISION: 1, REASON: 0 } },

  { id: 'lab_sheet', label: 'דוחות מעבדה', knows: 'what happened (measured)',
    strength: 'high', weakness: 'rarely explains the decision',
    expert: { MEASUREMENT: 5, INPUT: 3, DECISION: 1, HYPOTHESIS: 1 } },

  { id: 'weekly_report', label: 'תוכניות/דוחות שבועיים', knows: 'why we decided',
    strength: 'very high for reasons', weakness: 'numbers sometimes missing',
    expert: { DECISION: 5, REASON: 5, DEAD_END: 4, MEASUREMENT: 2, SUPPLIER: 4 } },

  { id: 'rd_report', label: 'דו"ח מו"פ', knows: 'consolidated rationale',
    strength: 'very high', weakness: 'written late, one snapshot',
    expert: { REASON: 5, DECISION: 5, DEAD_END: 4, SUPPLIER: 4, MEASUREMENT: 2 } },

  { id: 'sharepoint', label: 'SharePoint', knows: 'project documents',
    strength: 'medium', weakness: 'duplicates',
    expert: { DECISION: 3, REASON: 2, INPUT: 2 } },

  { id: 'email', label: 'Email', knows: 'discussions & decisions',
    strength: 'very high', weakness: 'a lot of noise',
    expert: { DECISION: 5, REASON: 5, HYPOTHESIS: 4, SUPPLIER: 4 } },

  { id: 'priority', label: 'Priority (ERP)', knows: 'what is actually produced',
    strength: 'operational truth', weakness: 'explains nothing about development',
    expert: { BATCH: 5, INPUT: 4, DECISION: 1, REASON: 0 } },

  { id: 'hand_notes', label: 'מחברות יד', knows: 'insights never typed up',
    strength: 'very high', weakness: 'hard to search (needs OCR)',
    expert: { REASON: 5, HYPOTHESIS: 4, DECISION: 3, MEASUREMENT: 2 } },

  { id: 'image', label: 'תמונות', knows: 'real physical state',
    strength: 'medium', weakness: 'needs OCR / vision',
    expert: { VISUAL: 5, MEASUREMENT: 1 } },

  { id: 'supplier_doc', label: 'ספקים (COA/חיצוני)', knows: 'external material knowledge',
    strength: 'high', weakness: 'not tuned to Fresco',
    expert: { SUPPLIER: 5, MEASUREMENT: 3 } },
];

export const sourceById = Object.fromEntries(SOURCE_MAP.map((s) => [s.id, s]));
