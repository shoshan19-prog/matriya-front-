// Knowledge Asset metadata — the FRONTIER and EXTERNAL map per scientific property.
//
// A Knowledge Asset separates the knowledge ITSELF from its sources. Internal
// evidence (episodes/products/materials/measured) is computed from the real
// corpus. This file holds the parts that are NOT Fresco data but define the
// asset's shape: its scientific category, the open sub-dimensions still missing
// (the frontier), where external evidence could come from, and which learned
// patterns (OLH) attach to it. Frontier/external are honest gaps & pointers —
// never claimed as evidence we have.

import { DOMAIN } from '../domains/domains.mjs';

export const ASSET_META = {
  [DOMAIN.COMPRESSION]: {
    category: 'Mechanical',
    frontier: ['marine / sulfate environment', 'aging & durability', 'freeze–thaw', 'pull-off correlation', 'early vs 28-day kinetics'],
    external: ['ASTM C109 / EN 196-1', 'Sika / BASF admixtures', 'cement-chemistry papers'],
    patterns: ['OLH-5', 'OLH-8'],
    deadEnds: 1,   // MPZ April-2025 campaign failed on process (rain/dilution) — docs/PRODUCT_STORY_MPZ
  },
  [DOMAIN.ADHESION]: {
    category: 'Mechanical / Surface',
    frontier: ['pull-off strength (MEASURED — none yet)', 'cross-cut rating', 'substrate range', 'wet adhesion', 'aged adhesion'],
    external: ['ASTM D4541 (pull-off)', 'EN 1542', 'adhesion-promoter suppliers'],
    patterns: ['OLH-4'],
    deadEnds: 2,   // TLV cracked field pilot; thermal "no cohesion, breaks"
  },
  [DOMAIN.WORKABILITY]: {
    category: 'Rheological',
    frontier: ['yield stress / thixotropy curves', 'open time', 'temperature dependence', 'pot life'],
    external: ['Brookfield / rheometry standards', 'Evonik (TEGO) & BASF rheology modifiers'],
    patterns: ['OLH-3', 'OLH-8'],
    deadEnds: 3,   // thermal no-flow; BETONIZE 2030-B coagulation; PROTECH foam/separation
  },
  [DOMAIN.COLOR]: {
    category: 'Optical',
    frontier: ['ΔE under UV / weathering', 'batch-to-batch consistency', 'metamerism', 'gloss'],
    external: ['CIE colorimetry standards', 'pigment suppliers (Lanxess/Bayferrox, Cathay)'],
    patterns: [],
    deadEnds: 1,   // BETONIZE floating-pigment field complaint (field vs lab, open)
  },
  [DOMAIN.WATER]: {
    category: 'Protective / Surface',
    frontier: ['water uptake (w-value)', 'vapor permeability (sd)', 'driving-rain', 'freeze–thaw'],
    external: ['EN 1062-3 (w) / EN ISO 7783 (sd)', 'Wacker / Evonik silicone water-repellents'],
    patterns: ['OLH-7'],
    deadEnds: 2,   // thermal fillers "drink water"; MPZ rain-water ruined cubes
  },
  [DOMAIN.FIRE]: {
    category: 'Protective',
    frontier: ['EN 13381-4 rating (minutes)', 'time-to-temperature curve', 'smoke', 'standardized furnace (vs burner)'],
    external: ['EN 13501-1 / ASTM E119', 'IGNIVER / Saint-Gobain reference', 'APP/ATH suppliers'],
    patterns: ['OLH-7'],
    deadEnds: 1,   // earlier FRESCO TECH-A1 fire sample failed (test stopped 5th min)
  },
  [DOMAIN.DENSITY]: {
    category: 'Mechanical',
    frontier: ['wet vs dry by grade', 'correlation to strength'],
    external: ['EN 1015-10', 'lightweight-aggregate suppliers (PORAVER)'],
    patterns: [],
    deadEnds: 0,
  },
  [DOMAIN.GRANULOMETRY]: {
    category: 'Granular',
    frontier: ['full sieve curves', 'supplier batch consistency (COA)'],
    external: ['EN 933 sieve standards', 'aggregate suppliers (Kfar Giladi, Negev Mineralim)'],
    patterns: ['OLH-6'],
    deadEnds: 0,
  },
  [DOMAIN.SETCURE]: {
    category: 'Process',
    frontier: ['set time', 'cure kinetics', 'temperature / humidity dependence'],
    external: ['EN 196-3 (setting time)', 'retarder/accelerator suppliers'],
    patterns: ['OLH-8'],
    deadEnds: 0,
  },
  [DOMAIN.HYDROPHOBICITY]: {
    category: 'Surface',
    frontier: ['contact angle', 'bead test', 'durability of repellency'],
    external: ['Wacker / Evonik silanes & siloxanes'],
    patterns: [],
    deadEnds: 0,
  },
};
