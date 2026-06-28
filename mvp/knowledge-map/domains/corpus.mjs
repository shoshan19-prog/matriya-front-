// Single source of truth for the REAL extracted episodes (domain-tagged).
// Every tag is traceable to a docs/PRODUCT_STORY_*.md episode — nothing invented.
// Both the Domain Registry demo and the gap-targeting selector import this.

import { DOMAIN as D } from './domains.mjs';

const sig = (domain, signal, note) => ({ domain, signal, note });
const mat = (name, effect, note) => ({ name, effect, note });

export const REAL_EPISODES = [
  // ── טיח תל אביב (restoration plaster) ──
  { id:'TLV-01', product:'טיח תל אביב', domains:[sig(D.ADHESION,'qualitative','field pilot cracked outdoors')], materials:[] },
  { id:'TLV-02', product:'טיח תל אביב', domains:[sig(D.ADHESION,'qualitative','COMBIZELL+TCO → good adhesion'), sig(D.WORKABILITY,'qualitative','good workability mix19')],
    materials:[mat('vermiculite','negative','dropped — poor adhesion/drying'), mat('UFAPORE TCO','positive','adhesion+texture'), mat('COMBIZELL','positive','replaced ME15000')] },
  { id:'TLV-04', product:'טיח תל אביב', domains:[sig(D.COMPRESSION,'empty','strength was the goal but the field is blank')],
    materials:[mat('NHL','positive','3.5→5.0 MPa for strength')] },
  { id:'TLV-05', product:'טיח תל אביב', domains:[sig(D.GRANULOMETRY,'qualitative','Tzmitut fraction inconsistency → glass sand rebalance')],
    materials:[mat('glass sand','positive','balance fractions'), mat('NHL','neutral','')] },
  { id:'TLV-06', product:'טיח תל אביב', domains:[sig(D.ADHESION,'qualitative','plaster slid off spatula — wetting'), sig(D.WORKABILITY,'qualitative','viscosity good after +TCO')],
    materials:[mat('UFAPORE TCO','positive','+1kg fixed wetting')] },
  { id:'TLV-07', product:'טיח תל אביב', domains:[sig(D.ADHESION,'qualitative','cured 3d, strong, no cracks'), sig(D.COMPRESSION,'empty','no 28-day number recorded'), sig(D.COLOR,'empty','גוון field blank')],
    materials:[] },

  // ── טיח תל אביב תרמי (halted) ──
  { id:'TH-01', product:'תרמי', domains:[sig(D.WORKABILITY,'qualitative','no flow'), sig(D.WATER,'qualitative','vermiculite drinks the water'), sig(D.ADHESION,'qualitative','no cohesion, breaks'), sig(D.DENSITY,'measured','1.36 g/cm³')],
    materials:[mat('vermiculite','negative','drinks water, no flow, breaks')] },
  { id:'TH-02', product:'תרמי', domains:[sig(D.GRANULOMETRY,'qualitative','drop large aggregate (ref has none)')], materials:[] },
  { id:'TH-04', product:'תרמי', domains:[sig(D.WATER,'qualitative','perlite/pumice still absorb water')],
    materials:[mat('perlite','negative','absorbs water'), mat('pumice','negative','absorbs much water, poor bond')] },
  { id:'TH-06', product:'תרמי', domains:[sig(D.WATER,'qualitative','pumice drinks water'), sig(D.ADHESION,'qualitative','poor bonding, breaks')],
    materials:[mat('pumice','negative','poor bonding')] },
  { id:'TH-07', product:'תרמי', domains:[], materials:[mat('NHL','positive','reset plan: NHL5'), mat('PORAVER','neutral','lightweight aggregate to try')] },

  // ── INT-TFX (intumescent coating) ──
  { id:'TFX-01', product:'INT-TFX', domains:[sig(D.FIRE,'qualitative','radiative-structural barrier mechanism')], materials:[] },
  { id:'TFX-02', product:'INT-TFX', domains:[sig(D.FIRE,'qualitative','additive levers A/B/C defined (not run)')],
    materials:[mat('microsilica','neutral','skeleton builder (planned)'), mat('TiO2','neutral','radiation scatterer (planned)'), mat('zinc borate','neutral','planned'), mat('ATH','neutral','endothermic sink (planned)')] },
  { id:'TFX-03', product:'INT-TFX', domains:[sig(D.FIRE,'measured','legacy burn EXP-LEG-044: 374°C jump to 554°C, held at gate')], materials:[] },
  { id:'TFX-04', product:'INT-TFX', domains:[sig(D.FIRE,'qualitative','burn protocol + anomaly gate fixed')], materials:[] },

  // ── MPZ (cementitious) ──
  { id:'MPZ-01', product:'MPZ', domains:[sig(D.COMPRESSION,'qualitative','grade ladder = cement loading')], materials:[mat('white cement','positive','loading scales strength')] },
  { id:'MPZ-02', product:'MPZ', domains:[sig(D.COMPRESSION,'empty','2020–21 batches: MPa cells blank')], materials:[] },
  { id:'MPZ-03', product:'MPZ', domains:[sig(D.COMPRESSION,'measured','sparse high grades: MPZ15 4–12, MPZ20 ~20–27 MPa')], materials:[] },
  { id:'MPZ-04', product:'MPZ', domains:[sig(D.COMPRESSION,'measured','Apr-2025 all grades, low/inconsistent'), sig(D.WATER,'qualitative','rain-water absorption ruined cubes'), sig(D.SETCURE,'qualitative','over-dilution')],
    materials:[mat('white cement','neutral','')] },
  { id:'MPZ-05', product:'MPZ', domains:[sig(D.COMPRESSION,'measured','Dec-2025 beat April at every grade'), sig(D.SETCURE,'qualitative','water/curing control = the cause')],
    materials:[mat('white cement','positive','same formula, better process')] },
  { id:'MPZ-06', product:'MPZ', domains:[sig(D.COMPRESSION,'measured','protocol drift annotated (8d vs 7d)')], materials:[] },

  // ── GRANITAL (silicate paint) — chosen by domain gap to seed the empty Color domain ──
  { id:'GR-01', product:'GRANITAL', domains:[sig(D.COLOR,'measured','tinting F-167…182; ΔL/Δa/Δb/ΔC/ΔH (170-2 best match)')],
    materials:[mat('OC pigment','positive','primary tint'), mat('OG pigment','positive',''), mat('RO pigment','positive','')] },
  { id:'GR-02', product:'GRANITAL', domains:[sig(D.COLOR,'measured','lightness L1 58.89 / Lf 62.59 (ΔL +1.11)')], materials:[] },
  { id:'GR-03', product:'GRANITAL', domains:[sig(D.COLOR,'measured','~115 ΔE color-matches vs Weber/KEIM/Tambour decks, dE 0.10–1.78')],
    materials:[mat('OC pigment','positive','dominant in matches')] },
  { id:'GR-04', product:'GRANITAL', domains:[sig(D.WORKABILITY,'measured','50°C oven viscosity/PH series, ~2× rise at 4wk'), sig(D.COLOR,'qualitative','untinted came out "whiter"')],
    materials:[mat('BO pigment','neutral',''), mat('RO pigment','neutral',''), mat('OC pigment','neutral','')] },
  { id:'GR-05', product:'GRANITAL', domains:[sig(D.WORKABILITY,'measured','recipe 03222 stability, t1 viscosity (1wk/4wk incomplete)')], materials:[] },
  { id:'GR-06', product:'GRANITAL', domains:[sig(D.WORKABILITY,'qualitative','TEGO defoamer additive trials')],
    materials:[mat('TEGO','neutral','defoamer')] },
];
