// Knowledge Domain Registry — built from the REAL four-product reconstructions.
// run: node demo.mjs
//
// Inverts the index: Domains → Products → Episodes. Every tag below is traceable
// to a docs/PRODUCT_STORY_*.md episode — nothing invented. The registry numbers
// are therefore the TRUE current evidence, which is honestly thin.

import { DOMAIN } from './domains.mjs';
import { buildDomainRegistry, domainEvidence, buildMaterialIndex, materialHistory } from './registry.mjs';

const D = DOMAIN;
const sig = (domain, signal, note) => ({ domain, signal, note });
const mat = (name, effect, note) => ({ name, effect, note });

// ── REAL episodes (subset carrying domain signal), tagged from the reconstructions ──
const E = [
  // ── טיח תל אביב (restoration plaster) ──
  { id:'TLV-01', product:'טיח תל אביב', domains:[sig(D.ADHESION,'qualitative','field pilot cracked outdoors')],
    materials:[] },
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
  { id:'TH-02', product:'תרמי', domains:[sig(D.GRANULOMETRY,'qualitative','drop large aggregate (ref has none)')],
    materials:[] },
  { id:'TH-04', product:'תרמי', domains:[sig(D.WATER,'qualitative','perlite/pumice still absorb water')],
    materials:[mat('perlite','negative','absorbs water'), mat('pumice','negative','absorbs much water, poor bond')] },
  { id:'TH-06', product:'תרמי', domains:[sig(D.WATER,'qualitative','pumice drinks water'), sig(D.ADHESION,'qualitative','poor bonding, breaks')],
    materials:[mat('pumice','negative','poor bonding')] },
  { id:'TH-07', product:'תרמי', domains:[],
    materials:[mat('NHL','positive','reset plan: NHL5'), mat('PORAVER','neutral','lightweight aggregate to try')] },

  // ── INT-TFX (intumescent coating) ──
  { id:'TFX-01', product:'INT-TFX', domains:[sig(D.FIRE,'qualitative','radiative-structural barrier mechanism')],
    materials:[] },
  { id:'TFX-02', product:'INT-TFX', domains:[sig(D.FIRE,'qualitative','additive levers A/B/C defined (not run)')],
    materials:[mat('microsilica','neutral','skeleton builder (planned)'), mat('TiO2','neutral','radiation scatterer (planned)'), mat('zinc borate','neutral','planned'), mat('ATH','neutral','endothermic sink (planned)')] },
  { id:'TFX-03', product:'INT-TFX', domains:[sig(D.FIRE,'measured','legacy burn EXP-LEG-044: 374°C jump to 554°C, held at gate')],
    materials:[] },
  { id:'TFX-04', product:'INT-TFX', domains:[sig(D.FIRE,'qualitative','burn protocol + anomaly gate fixed')],
    materials:[] },

  // ── MPZ (cementitious) ──
  { id:'MPZ-01', product:'MPZ', domains:[sig(D.COMPRESSION,'qualitative','grade ladder = cement loading')],
    materials:[mat('white cement','positive','loading scales strength')] },
  { id:'MPZ-02', product:'MPZ', domains:[sig(D.COMPRESSION,'empty','2020–21 batches: MPa cells blank')],
    materials:[] },
  { id:'MPZ-03', product:'MPZ', domains:[sig(D.COMPRESSION,'measured','sparse high grades: MPZ15 4–12, MPZ20 ~20–27 MPa')],
    materials:[] },
  { id:'MPZ-04', product:'MPZ', domains:[sig(D.COMPRESSION,'measured','Apr-2025 all grades, low/inconsistent'), sig(D.WATER,'qualitative','rain-water absorption ruined cubes'), sig(D.SETCURE,'qualitative','over-dilution')],
    materials:[mat('white cement','neutral','')] },
  { id:'MPZ-05', product:'MPZ', domains:[sig(D.COMPRESSION,'measured','Dec-2025 beat April at every grade'), sig(D.SETCURE,'qualitative','water/curing control = the cause')],
    materials:[mat('white cement','positive','same formula, better process')] },
  { id:'MPZ-06', product:'MPZ', domains:[sig(D.COMPRESSION,'measured','protocol drift annotated (8d vs 7d)')],
    materials:[] },
];

const registry = buildDomainRegistry(E);
const materials = buildMaterialIndex(E);

console.log('═══ KNOWLEDGE DOMAIN REGISTRY (organized by what we LEARNED, not what we made) ═══\n');
console.log('  Domain                         Evidence  Products  Episodes  Gaps  Status');
for (const r of registry)
  console.log(`  ${r.domain.padEnd(30)} ${String(r.evidence).padStart(6)}   ${String(r.products).padStart(6)}   ${String(r.episodes).padStart(6)}   ${String(r.gaps).padStart(3)}   ${r.status}`);
console.log('\n  evidence weight: measured=2 · qualitative=1 · empty(known gap)=0');

console.log('\n═══ PROTEUS re-oriented — "what do we really know about Compression Strength?" ═══\n');
const comp = domainEvidence(registry, DOMAIN.COMPRESSION);
console.log(`  Domain: ${comp.domain}   status: ${comp.status}   (${comp.gaps} known gaps)`);
for (const b of comp.bars)
  console.log(`    ${b.product.padEnd(14)} ${b.bar.padEnd(10)} ${b.evidence}${b.measured ? '  (measured)' : ''}`);
console.log('    → the answer is no longer "ask MPZ" — it is "MPZ carries it, the others are gaps".');

console.log('\n═══ MATERIAL HISTORY — the life of a raw material across ALL products ═══\n');
const verm = materialHistory(materials, 'vermiculite');
console.log(`  vermiculite — ${verm.products} products, ${verm.appearances} appearances, +${verm.positive}/−${verm.negative}:`);
for (const e of verm.episodes) console.log(`    ${e.product.padEnd(14)} ${e.episode.padEnd(8)} ${e.effect.toUpperCase().padEnd(8)} ${e.note}`);
console.log('    ⇒ cross-product finding: vermiculite NEVER appears in a frozen success — every time, adhesion/flow failed.');

console.log('\n  Top materials by reach:');
for (const m of materials.slice(0, 6))
  console.log(`    ${m.name.padEnd(16)} ${m.products}p / ${m.appearances}ep   +${m.positive}/−${m.negative}`);

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('The index is inverted: Knowledge Domains → Products → Episodes → Documents.');
console.log('Products became evidence sources. Now Fresco can ask "what do we know about');
console.log('compression / adhesion / fire / a material" — questions a product-only system cannot answer.');
