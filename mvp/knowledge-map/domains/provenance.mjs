// PROVENANCE — the methodological fence between "knowledge source" and
// "validation project".
//
// MATRIYA's Knowledge Assets are scale-invariant: they accept evidence from ANY
// source — internal projects, raw-material QC, even external/vendor data. That is
// correct and stays correct (a ΔE record from a competitor deck is still a real
// colorimetry measurement). But VALIDATING the system's metrics is a different
// act: a law must be reproduced on the DEFINED REFERENCE CORPUS — real Fresco
// projects with their own decision cycles — or you are mixing the internal corpus
// with external data and biasing the validation.
//
//   evidence  → any origin may feed a Knowledge Asset
//   validation → ONLY origin:'fresco' role:'project' counts toward reproducibility
//
// Honest correction logged here: GRANITAL was questioned as possibly-external, but
// its own reconstruction states it IS "Fresco's silicate facade paint, the
// internal counterpart to KEIM Granital" — so GRANITAL is internal and eligible;
// the genuinely external things are the vendor/competitor references (KEIM decks,
// commercial-densifier benchmarks) and anything whose origin we have NOT verified.

// origin: 'fresco' (internal) | 'external' (vendor/competitor) | 'unverified' (not confirmed)
// role:   'project' (decision cycles → validation-eligible) | 'qc-source' (measurement only) | 'reference'
export const PROVENANCE = {
  // ── the eight reconstructed Fresco R&D projects (have decision corpora) ──
  'טיח תל אביב':            { origin: 'fresco', role: 'project', note: 'restoration plaster — full decision arc' },
  'תרמי':                   { origin: 'fresco', role: 'project', note: 'thermal plaster (halted) — decisions present' },
  'INT-TFX':                { origin: 'fresco', role: 'project', note: 'intumescent coating — Stage-0/POC' },
  'MPZ':                    { origin: 'fresco', role: 'project', note: 'cementitious render — measured strength' },
  'GRANITAL':               { origin: 'fresco', role: 'project', note: "Fresco's silicate paint, internal counterpart to KEIM Granital (KEIM read as reference only)" },
  'fire-retardant plaster': { origin: 'fresco', role: 'project', note: 'SFRM — density-match stage' },
  'BETONIZE':               { origin: 'fresco', role: 'project', note: 'silicate coating — directives/decisions' },
  'PROTECH A1':             { origin: 'fresco', role: 'project', note: 'Fresco Tech-A1 — measured Workability + A1 Fire' },

  // ── internal Fresco measurement / QC sources (evidence, NOT a project) ──
  'raw-material QC':        { origin: 'fresco', role: 'qc-source', note: 'incoming sieve/PSD QC programs' },
  'field-stone QC':         { origin: 'fresco', role: 'qc-source', note: 'field-stone compression QC' },
  'spectro QC':             { origin: 'fresco', role: 'qc-source', note: 'spectrophotometer ΔE/L*a*b* (440 records)' },
  'MP-1000 primer':         { origin: 'fresco', role: 'qc-source', note: 'primer viscosity/density (no decision corpus reconstructed)' },
  'CC primer':              { origin: 'fresco', role: 'qc-source', note: 'primer viscosity/density (no decision corpus reconstructed)' },

  // ── genuinely external / benchmark references (knowledge source ONLY) ──
  'concrete densifiers':    { origin: 'external', role: 'reference', note: 'commercial densifier benchmarks (Top-Inhibitor/Haddener/Consolidator/FCI) measured for comparison' },

  // ── provenance not yet confirmed → excluded from validation until verified ──
  'F.SILICATO':             { origin: 'unverified', role: 'qc-source', note: 'silicate sibling — internal-likely but no decision corpus confirmed' },
  'Sloxan/LASUR':           { origin: 'unverified', role: 'reference', note: 'tint-match decks — brand origin not confirmed' },
  'Italian/Acryl-Plus':     { origin: 'unverified', role: 'reference', note: 'tint-match decks — brand origin not confirmed' },
};

export function provenanceOf(product) {
  return PROVENANCE[product] || { origin: 'unverified', role: 'reference', note: 'not in the provenance registry' };
}

/** May this product be used to VALIDATE the system's metrics? Only confirmed
 *  Fresco projects with decision cycles qualify. Everything else can still feed
 *  Knowledge Assets as evidence — it just cannot validate a law. */
export function validationEligible(product) {
  const p = provenanceOf(product);
  return p.origin === 'fresco' && p.role === 'project';
}

/** Roll-up for reporting: how the corpus splits across the fence. */
export function provenanceSummary(products) {
  const uniq = [...new Set(products)];
  const by = (pred) => uniq.filter(pred);
  return {
    frescoProjects: by((p) => validationEligible(p)),
    frescoSources:  by((p) => provenanceOf(p).origin === 'fresco' && provenanceOf(p).role !== 'project'),
    external:       by((p) => provenanceOf(p).origin === 'external'),
    unverified:     by((p) => provenanceOf(p).origin === 'unverified'),
    note: 'evidence may come from any of these; validation counts ONLY frescoProjects',
  };
}
