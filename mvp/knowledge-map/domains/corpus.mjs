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

  // ── טיח מעכב בעירה (fire-retardant plaster, SFRM) — 2nd Fire source, 2nd measured Density ──
  { id:'FP-01', product:'fire-retardant plaster', domains:[sig(D.DENSITY,'measured','0.30–0.55 g/cm³ vs IGNIVER 0.35'), sig(D.FIRE,'qualitative','no test yet, density-match stage')],
    materials:[mat('vermiculite V2','positive','lowers density to target'), mat('gypsum','positive','base')] },
  { id:'FP-02', product:'fire-retardant plaster', domains:[sig(D.FIRE,'qualitative','2-min burner screen F002/F005: no smoke, no disintegration (no rating/time)')],
    materials:[mat('vermiculite V2','positive',''), mat('gypsum','positive',''), mat('SX68A/mica','neutral','')] },
  { id:'FP-03', product:'fire-retardant plaster', domains:[sig(D.FIRE,'empty','cement variants 012–014: no fire result recorded')],
    materials:[mat('white cement','neutral','effect unknown')] },
  { id:'FP-04', product:'fire-retardant plaster', domains:[sig(D.FIRE,'empty','ATH/Mg(OH)₂ variants 015–017: no result recorded')],
    materials:[mat('ATH','neutral','role label only, not measured'), mat('Mg(OH)2','neutral','role label only'), mat('LAPINUS C10','positive','anti-crack fiber')] },

  // ── BETONIZE 2030 (silicate coating) — 2nd Color source (qualitative) + measured Workability + field report ──
  { id:'BZ-01', product:'BETONIZE', domains:[sig(D.WORKABILITY,'measured','50°C viscosity 3×→unmeasurable at 4wk'), sig(D.COLOR,'qualitative','oven samples lighter, BLACK worst')],
    materials:[mat('BO pigment','negative','heat shade shift')] },
  { id:'BZ-02', product:'BETONIZE', domains:[sig(D.WORKABILITY,'measured','additive screen baseline (wk1/wk4 absent)')],
    materials:[mat('ropac','neutral','undetermined'), mat('open-titan','neutral',''), mat('A11','neutral','')] },
  { id:'BZ-03', product:'BETONIZE', domains:[sig(D.WORKABILITY,'measured','2030-B coagulation wk1, disintegrated wk2')],
    materials:[mat('clear silicate base','negative','coagulates at 50°C')] },
  { id:'BZ-04', product:'BETONIZE', domains:[sig(D.WORKABILITY,'measured','titanium 10% drives viscosity up'), sig(D.COLOR,'qualitative','whiteness not significantly higher')],
    materials:[mat('TiO2 698','positive','coverage'), mat('TiO2 TIONA 826','positive','coverage, ++viscosity'), mat('chalk','negative','reduced')] },
  { id:'BZ-05', product:'BETONIZE', domains:[sig(D.WORKABILITY,'measured','formulas 187/188 stabilize ~×2–3 after ~10 days')],
    materials:[mat('thickeners','negative','reduce to fix flow'), mat('dispersant D27','neutral','vs Orotan 731')] },
  { id:'BZ-06', product:'BETONIZE', domains:[sig(D.COLOR,'qualitative','floating-pigment shade change "not significant"'), sig(D.WORKABILITY,'qualitative','pigment-wetting/dispersant')],
    materials:[mat('black pigment','negative','floats')] },
  { id:'BZ-07', product:'BETONIZE', domains:[sig(D.COLOR,'qualitative','raise titanium for coverage (directive)'), sig(D.WORKABILITY,'qualitative','lower thickeners (directive)')],
    materials:[mat('titanium','positive','coverage'), mat('thickeners','negative','')] },

  // ── PROTECH A1 (silicate coating) — measured Workability + measured Fire (Class A1) + measured Water ──
  { id:'PT-A', product:'PROTECH A1', domains:[sig(D.WORKABILITY,'measured','binder/emulsion viscosity 24h–1mo + SG'), sig(D.COLOR,'qualitative','')],
    materials:[mat('SA-1 styrene-acrylic','positive','chosen binder'), mat('EM-58','negative','rubbed off pre-cure'), mat('OPTIGEL WX','positive','thickener'), mat('KSIL34','positive','silicate')] },
  { id:'PT-B', product:'PROTECH A1', domains:[sig(D.COLOR,'qualitative','pigment compatibility 1–5'), sig(D.WORKABILITY,'qualitative','')],
    materials:[mat('Betolin A11','positive','stabilizer to 2%'), mat('Calgon','neutral','partial')] },
  { id:'PT-C', product:'PROTECH A1', domains:[sig(D.WORKABILITY,'measured','50°C viscosity rise to creamy at 4wk'), sig(D.WATER,'measured','oven stability/PH'), sig(D.COLOR,'qualitative','black shifts lighter')],
    materials:[] },
  { id:'PT-D', product:'PROTECH A1', domains:[sig(D.WORKABILITY,'qualitative','dries too fast → +1% propylene glycol opens time')],
    materials:[mat('propylene glycol','positive','open time'), mat('Texanol','negative','raises VOC')] },
  { id:'PT-E', product:'PROTECH A1', domains:[sig(D.WORKABILITY,'measured','antifoam 0.45% (162) → no foam/separation'), sig(D.WATER,'measured','separation tracked')],
    materials:[mat('antifoam','positive','0.45% removes entrapped air'), mat('thickeners','negative','over-thicken route')] },
  { id:'PT-F', product:'PROTECH A1', domains:[sig(D.FIRE,'measured','Class A1: ISO 1182 ΔT 5.1°C, mass loss 16.4%, 0s flaming; ISO 1716 0.0 MJ/kg')],
    materials:[mat('alkali silicate base','positive','non-combustible <5% organic')] },

  // ── raw-material QC granulometry (FIRST_MEASUREMENT acquired by RETRIEVAL, ROI-scout) ──
  // Incoming raw-material sieve/PSD QC — real measured granulometry, cross-product.
  { id:'QC-GR-1', product:'raw-material QC', domains:[sig(D.GRANULOMETRY,'measured','Kfar Giladi 003 sieve curve (0.6→0.025mm) + multi-supplier QC 2021–2024')],
    materials:[mat('Kfar Giladi aggregate','neutral','sieve %'), mat('Negev Mineralim','neutral',''), mat('Tzmitut','neutral','')] },
  { id:'QC-GR-2', product:'raw-material QC', domains:[sig(D.GRANULOMETRY,'measured','Malvern laser PSD Dv50 102µm (Dv10 50.6/Dv90 174); Repra-60 sieve table')],
    materials:[mat('Repra-60 filler','neutral','PSD'), mat('H150 filler','neutral','laser PSD')] },
];
