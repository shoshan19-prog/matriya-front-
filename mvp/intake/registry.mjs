// Known-entity registry (the "existing relationships" signal — highest weight).
// SEED/DEMO data: in production this IS the MATRIYA graph (products ↔ codes ↔
// versions ↔ experiments ↔ operators ↔ batch dates). Here, a small seed so the
// resolver can demonstrate relationship-based identity. Values are identifiers,
// not compositions.

export const REGISTRY = {
  products: [
    { name: 'טיח מעכב בעירה', codes: ['INT-TFX', 'IGNIVER'], experiments: ['INT-TFX-045', 'INT-TFX-044'], versions: ['v044', 'v045'], operators: ['Rachel', 'רחל', 'דוד'], batch_dates: ['2024-03-11', '11.03.2024'] },
  { name: 'שליכט W100', codes: ['W100'], experiments: [], versions: ['v001', 'v002', 'v003'], operators: ['רחל'], batch_dates: [] },
    { name: 'F.SILICATO system', codes: ['F.SILICATO', 'PROTECH-A1', 'BETONIZE2030A', 'BETONIZE2030B'], experiments: [], versions: ['f1', 'f9'], operators: ['דוד'], batch_dates: ['30.09.2021'] },
    { name: 'MPZ hydraulic line', codes: ['MPZ2.5', 'MPZ5', 'MPZ10', 'MPZ15', 'MPZ20'], experiments: [], versions: [], operators: ['דוד'], batch_dates: ['14.12.2025', '15.12.2025'] },
  ],
};

/** Reverse lookup: does this entity value belong to a known product? */
export function productForEntity(type, value, registry = REGISTRY) {
  const v = String(value).toUpperCase();
  for (const p of registry.products) {
    if (type === 'product_code' && p.codes.some((c) => c.toUpperCase() === v)) return p;
    if (type === 'experiment_id' && p.experiments.some((e) => e.toUpperCase() === v)) return p;
    if (type === 'version' && p.versions.some((x) => x.toUpperCase() === v)) return p;
    if (type === 'date' && p.batch_dates.some((d) => d.toUpperCase() === v)) return p;
    if (type === 'operator' && p.operators.some((o) => o.toUpperCase() === v)) return p;
  }
  return null;
}
