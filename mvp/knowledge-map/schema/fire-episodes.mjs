// FIRE EPISODES (PENDING) — knowledge UNITS from the Drive fire-test thread.
//
// Source: email thread "Fresco Intumescent paint fire test results", fire test at
// Clariant's R&D lab (~Nov 2023), DIN 4102-8 (≈ EN 13381-8), vertical steel panels,
// failure = steel reaches 500°C. Read-only extraction; nothing invented.
//
// These are CANDIDATES, structured per the Fire Resistance MODEL (v2). They are:
//   • NOT added to the corpus (REAL_EPISODES) — they await human review.
//   • NOT turned into laws, NOT ranked, NOT scored.
//   • An Episode, not "a PDF": Test → DFT → Result, as a knowledge unit.
//
// Provenance split, on purpose: 043 & 044 are Fresco (INT-TFX); 045 is a COMMERCIAL
// benchmark from another vendor — tagged external, and deliberately NOT compared
// here ("better/worse" is a later-stage judgement, not this stage's job).
// Honest status: the report is INTERMEDIATE (Saint-Gobain requires an official
// large-scale EN 13381-8 certificate) → certified: false. So this is a BOUNDARY,
// not a closed result.

const test = (id, sample, origin, dft, timeToFailure, charExpansion) => ({
  id, product: origin === 'fresco' ? 'INT-TFX' : 'competitor benchmark',
  sample, origin, status: 'PENDING_REVIEW', asset: 'Fire Resistance',
  measurement: {
    standard: 'DIN 4102-8', testGeometry: 'vertical steel panel', furnaceProfile: 'custom',
    failureTemp: 500, dft, timeToFailure, charExpansion, certified: false,
  },
});

export const FIRE_EPISODES_PENDING = [
  test('TFX-FIRE-043-1000', '12.09.2023-043', 'fresco', 1000, 85, 3.8),
  test('TFX-FIRE-043-2000', '12.09.2023-043', 'fresco', 2000, 123, 5.8),
  test('TFX-FIRE-044-1000', '12.09.2023-044', 'fresco', 1000, 79, 2.5),   // "innovative treated formulation"
  test('TFX-FIRE-044-2000', '12.09.2023-044', 'fresco', 2000, 127, 5.5),
  test('BENCH-045-1000', '12.09.2023-045', 'external', 1000, 76, 1.5),     // commercial BS476-certified paint
  test('BENCH-045-2000', '12.09.2023-045', 'external', 2000, 105, 3.5),
];
