# MATRIYA knowledge-map — how to use it

Everything is zero-dependency Node ESM. Run any layer's demo to see it on the real
Fresco corpus, or import its functions into your own script. All commands run from
the repo root.

```bash
node mvp/knowledge-map/assets/demo.mjs          # what we know (Knowledge Assets)
node mvp/knowledge-map/frontier/demo.mjs        # why a gap exists + phase
node mvp/knowledge-map/decision-value/demo.mjs  # what to do next (business-weighted)
```

The single source of truth is `mvp/knowledge-map/domains/corpus.mjs` (`REAL_EPISODES`).
Add a new product/measurement = add an episode there; every layer recomputes.

---

## 1. "What do we actually know about compression strength?"

```bash
node mvp/knowledge-map/assets/demo.mjs
```
or in code:
```js
import { REAL_EPISODES } from './mvp/knowledge-map/domains/corpus.mjs';
import { buildKnowledgeAssets, renderAssetCard } from './mvp/knowledge-map/assets/knowledge-asset.mjs';

const assets = buildKnowledgeAssets(REAL_EPISODES);
console.log(renderAssetCard(assets.find(a => a.name === 'Compression Strength')));
// → Evidence 15 (measured 7) · 3 products · Confidence 0.94 · Patterns OLH-5,OLH-8
//   Frontier: marine/sulfate · aging · pull-off correlation · External: ASTM C109…
```
**Use it for:** a one-screen scientific status of any property — what's measured, how
sure we are, which materials, what's still missing, where to get it.

## 2. "Where is the evidence for X — which products, and where are the gaps?"

```js
import { buildDomainRegistry, domainEvidence } from './mvp/knowledge-map/domains/registry.mjs';
const reg = buildDomainRegistry(REAL_EPISODES);
console.log(domainEvidence(reg, 'Compression Strength'));
// → bars per product: MPZ ██████ measured · concrete densifiers ███ · field-stone █
```
**Use it for:** answering "do we have data on this, and from which products?" instead
of hunting files.

## 3. "What's the history of a raw material across all our products?"

```js
import { buildMaterialIndex, materialHistory } from './mvp/knowledge-map/domains/registry.mjs';
const mats = buildMaterialIndex(REAL_EPISODES);
console.log(materialHistory(mats, 'vermiculite'));
// → 2 products, +0/−2: dropped from TLV (poor adhesion), failed in thermal (drinks water)
//   ⇒ never in a frozen success
```
**Use it for:** "everywhere we used Microsilica / vermiculite / a binder, what happened?"
— a question a product-by-product file system can't answer.

## 4. "What should we do next — and why?" (the R&D recommendation)

```bash
node mvp/knowledge-map/decision-value/demo.mjs
```
```js
import { buildDecisionPriorities, protocol } from './mvp/knowledge-map/decision-value/decision-value.mjs';
const rows = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking');
console.log(protocol(rows));
// → { Asset:'Adhesion', Mode:'GENERATE', Event:'FIRST_PULL_OFF',
//     ExpectedDK:0.48, BusinessImpact:1, DecisionValue:0.79, Priority:4.3 }
```
Change the business objective to re-rank for a different strategy:
```js
buildDecisionPriorities(REAL_EPISODES, 'regulatory-certification'); // pulls Fire forward
buildDecisionPriorities(REAL_EPISODES, 'win-new-sales');           // pulls Color forward
```
**Use it for:** the next experiment to run, ranked by value to the business — with the
reason. PROTEUS recommends; **you approve** (no auto-execution).

## 5. "Why don't we know X — should we search more, or run a test?"

```bash
node mvp/knowledge-map/frontier/demo.mjs
```
```js
import { buildKnowledgeAssets } from './mvp/knowledge-map/assets/knowledge-asset.mjs';
import { replayTransformations } from './mvp/knowledge-map/transformations/transformation.mjs';
import { classifyFrontier, knowledgePhase } from './mvp/knowledge-map/frontier/frontier.mjs';

const f = classifyFrontier(buildKnowledgeAssets(REAL_EPISODES), replayTransformations(REAL_EPISODES));
console.log(f.find(x => x.asset === 'Adhesion'));
// → GENERATE_REQUIRED · "0 measured pull-off; corpus scanned, none exists" · Run first Pull-Off
console.log(knowledgePhase(f)); // → phase TRANSITION, phaseIndex 0.2
```
**Use it for:** before you spend a day searching SharePoint, ask the Frontier — if it
says `GENERATE_REQUIRED`, the document doesn't exist; book the lab instead.

## 6. "Plan R&D for this quarter's budget and free lab time."

```bash
node mvp/knowledge-map/strategy/demo.mjs
```
```js
import { buildPriorities, rdPlan } from './mvp/knowledge-map/strategy/priority.mjs';
const rows = buildPriorities(REAL_EPISODES, 'customer-returns-cracking');
console.log(rdPlan(rows, { budgetILS: 6000, labDays: 30 }));
// → run { FIRST_SET_TIME, FIRST_PULL_OFF, … } spend ₪1800, expected ΣΔK ≈ 0.9
```
**Use it for:** a budget-and-lab-time-constrained portfolio of experiments that buys the
most knowledge per shekel.

## 7. "How much did a test actually teach us / what was the R&D ROI?"

```bash
node mvp/knowledge-map/transformations/demo.mjs   # ΔKnowledge per evidence, R&D ROI per product
node mvp/knowledge-map/events/demo.mjs            # Learning Primitives + ROI/₪ per event
```
```js
import { buildKnowledgeEvents } from './mvp/knowledge-map/events/event.mjs';
import { learningPrimitives } from './mvp/knowledge-map/events/learning-primitives.mjs';
console.log(learningPrimitives(buildKnowledgeEvents(REAL_EPISODES)));
// → FIRST_MEASUREMENT avg ΔK 0.45 (changes a decision 40% of the time); DUPLICATE ≈ 0
```
**Use it for:** proving which kinds of experiment generate knowledge (and which are
wasted), and the realized return of each acquisition.

## 8. "Wire the live Router so Demand stops being a guess." (telemetry)

```bash
node mvp/knowledge-map/telemetry/router-demo.mjs
```
```js
import { instrumentRouter, demandByAsset, topUnansweredAssets } from './mvp/knowledge-map/telemetry/router-telemetry.mjs';
let log = [];
const ask = instrumentRouter(realRouter, () => log, l => { log = l; }); // pass-through, records hit/miss
ask('pull-off strength?', { user_role: 'rnd' });   // returns the Router's answer UNCHANGED
console.log(demandByAsset(log), topUnansweredAssets(log));
```
**Use it for:** measuring what people actually ask and where the system fails to answer —
privacy-safe (no raw query stored), append-only, no behaviour change.

---

## How to grow the knowledge (the governed loop)

```
1. PROTEUS recommends (sections 4–6)         → "run FIRST_PULL_OFF, business value 1.0"
2. YOU approve  (governance: no auto-action)
3. Acquire:  RETRIEVE existing data  OR  GENERATE a new measurement (the Frontier tells you which)
4. Add the result as an episode in domains/corpus.mjs
5. Re-run any demo — assets, transformations, priority, frontier all recompute
```

Add one new measurement, e.g.:
```js
// in mvp/knowledge-map/domains/corpus.mjs
{ id:'PO-01', product:'TLV', domains:[ sig(D.ADHESION,'measured','pull-off 2.8 MPa on concrete') ], materials:[] },
```
Re-run `node mvp/knowledge-map/frontier/demo.mjs` → Adhesion flips from
`GENERATE_REQUIRED` (0.35) toward grounded, and the phase index moves.

---

## Map of the layers (which file answers which question)

| Question | Layer |
|----------|-------|
| What do we know about a property? | `assets/` |
| Where's the evidence / material history? | `domains/registry` |
| How did knowledge change over time / R&D ROI? | `transformations/`, `events/` |
| How often is it needed (demand)? | `strategy/demand`, `telemetry/` |
| What's the business value of knowing it? | `decision-value/` |
| What should we do next, and why? | `decision-value/`, `strategy/` |
| Retrieve or generate? Phase? | `frontier/` |
| Where do sources/trust come from? | `knowledge-map/` (Source Map + Trust) |
| Product development stories | `docs/PRODUCT_STORY_*.md` |

> Rule of thumb: ask **"what do we know?"** with `assets/`, **"what next?"** with
> `decision-value/`, and **"why is it missing?"** with `frontier/`. Everything else
> feeds those three.
