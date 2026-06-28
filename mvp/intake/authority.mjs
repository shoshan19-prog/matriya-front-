// Entity Authority Registry (#1) — "which entity do I believe?"
//
// Not every entity is equal. A Formula/Batch/Experiment id is a near-certain
// anchor; an Operator or a File Name is weak. Authority is per ENTITY TYPE and
// LEARNED over time from human feedback (see feedback.mjs). This registry is the
// single source of truth the whole Knowledge Identity Engine relies on — and the
// same table can serve MATRIYA, PROTEUS, Router, Search, RAG, Benchmark.

export const DEFAULT_AUTHORITY = {
  formula_id: 0.99,
  batch_id: 0.98,
  experiment_id: 0.98,
  lab_sample: 0.95,
  product_code: 0.95,
  version: 0.90,
  date: 0.80,
  operator: 0.45,
  path: 0.35,
  name: 0.20,
  measurement: 0.10,
};

export const authorityOf = (type, registry = DEFAULT_AUTHORITY) => registry[type] ?? 0.5;
