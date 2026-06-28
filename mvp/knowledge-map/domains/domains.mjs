// Knowledge Domains — the super-layer that inverts the index.
//
// Until now knowledge was organized around PRODUCTS ("what we made"). The bigger
// unit is the KNOWLEDGE DOMAIN ("what we learned"): Adhesion, Compression, Fire…
// Then טיח תל אביב / MPZ / INT-TFX / Thermal are no longer products — they are
// EVIDENCE SOURCES for the same domains. The index becomes:
//     Knowledge Domains → Products → Episodes → Documents   (not the reverse).

export const DOMAIN = {
  ADHESION:        'Adhesion',
  COMPRESSION:     'Compression Strength',
  WORKABILITY:     'Workability / Flow',
  WATER:           'Water Resistance / Moisture',
  FIRE:            'Fire Resistance',
  GRANULOMETRY:    'Granulometry / Fractions',
  SETCURE:         'Set / Cure',
  DENSITY:         'Density',
  COLOR:           'Color / Shade',
  HYDROPHOBICITY:  'Hydrophobicity',
};

// Markers for future AUTO-tagging of an episode into domains (the demo passes
// explicit, source-traced tags; these let the registry self-populate later).
export const DOMAIN_MARKERS = {
  [DOMAIN.ADHESION]:       /הדבק|נדבק|הידבק|adhesion|חיבור|מחבר|נשבר|cohes/i,
  [DOMAIN.COMPRESSION]:    /לחיצה|חוזק|compress|strength|MPa/i,
  [DOMAIN.WORKABILITY]:    /עבידות|זרימה|workab|flow|מרקם|ספטולה/i,
  [DOMAIN.WATER]:          /שותה.?מים|ספיגת.?מים|מים מהגשם|moisture|water.?absorb|הרטבה/i,
  [DOMAIN.FIRE]:           /אש|שריפה|burn|fire|char|intumesc|עמידות אש/i,
  [DOMAIN.GRANULOMETRY]:   /פרקצי|ניפוי|אגרגט|granul|fraction|אבקות|חול/i,
  [DOMAIN.SETCURE]:        /אשפרה|התקשות|cur(e|ing)|set.?time|דילול/i,
  [DOMAIN.DENSITY]:        /צפיפות|density|משקל סגולי|g\/cm/i,
  [DOMAIN.COLOR]:          /גוון|צבע|color|shade|pigment/i,
  [DOMAIN.HYDROPHOBICITY]: /הידרופוב|דחיית מים|hydrophob|water.?repel/i,
};
