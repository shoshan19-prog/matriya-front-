# The Knowledge Stack — Representation as the guardian of the model

*Prepared 2026-06-29. The fire-test files added one layer to MATRIYA's epistemology, and it changes the system's job. Most knowledge systems ask "is the information correct?". MATRIYA now asks first: "do I even know how to represent this kind of knowledge?". This note fixes the full stack and the single universal path every new measurement type travels. Code: `stack.mjs` + `schema/asset-schema.mjs`. Run: `matriya stack`.*

---

## The stack

```
Reality → Evidence → Episode → Representation → Human Review → Knowledge → Decision
```

| layer | what it is | guard |
|-------|-----------|-------|
| **Reality** | what happened in the world | — |
| **Evidence** | a measured *fact* — sound? | Evidence Qualification (units · baseline · physics) |
| **Episode** | the full *context* of that fact (who · when · which standard · what conditions) | — |
| **Representation** | does a *model* exist for this kind of knowledge? | schema `recognize()` |
| **Human Review** | do we accept it? | a person |
| **Knowledge** | the meaning derived *after* the event is accepted | — |
| **Decision** | what we do about it | — |

**Representation** is the new layer. It does not protect the datum — it protects **the language the system thinks in**. The earlier layers ask "is this evidence trustworthy?"; Representation asks "can I describe this kind of thing at all?".

## Why it matters — Smoke Toxicity, tomorrow

A weaker system, meeting a `Smoke Toxicity` test, does one of two bad things:

```
Smoke Toxicity → Fire Resistance → "probably the same" → ACCEPT   (silent error, forever)
Smoke Toxicity → "don't recognize" → DROP                          (knowledge lost)
```

MATRIYA does neither:

```
Smoke Toxicity → I see it belongs to the Fire family → but I have no model for it → REVIEW
```

`matriya stack` proves the same path serves every type:

```
Fire test 043 @ 2000µm (modeled)        → stops at Human Review (PENDING)
Smoke Toxicity (NEW kind — unmodeled)   → stops at Representation (REVIEW)
UV Aging (NEW asset — no model yet)     → stops at Representation (REVIEW)
Compression 30.71 MPa @ 50d (modeled)   → stops at Human Review (PENDING)
```

A recognized measurement reaches Human Review; an unrecognized one stops at Representation so a human can **extend the model first**. The system can absorb Fire, Smoke Toxicity, Weathering, UV Aging, or any future test **without changing its philosophy** — it only grows the representation model after review, and never writes new knowledge silently.

## Episode, not document

The second decision: a PDF is a *container*; an Episode is a *unit of knowledge*.

```
PDF  → "Fire Test Report"            (must be re-opened to use)
Episode → sample 043 · DFT 2000µm · 123 min · DIN 4102-8   (compare · search · connect · learn from)
```

So the Control Room now counts **Episodes by asset**, the way a scientist thinks — not "236 documents":

```
EPISODES BY ASSET   21 Workability · 15 Color · 8 Compression · 7 Fire · 6 Granulometry · … · 4 Fire·pending
```

## What was deliberately NOT done

The discipline that makes the stack trustworthy is where it *stops*: at the end of the evidence. No `Knowledge++`, no `Best Formula`, no `New Law`, no Knowledge-Score change. Those live above Human Review, and only after the new model is approved — so the system never manufactures certainty it does not have.

## Status & next

- Built & runnable: `stack.mjs` (`LAYERS` · `routeMeasurement` · demo across measurement types), wired as `matriya stack`; Episodes-by-asset added to the Control Room (HTML + React tab + `public/control-room.json`).
- The principle fixed: **Representation guards the model.** When a new kind of knowledge appears, the correct answer is "I don't yet know how to represent this" → REVIEW — never a silent ACCEPT, never a DROP.
- Next, only on approval: extend a model (e.g. add Smoke Toxicity dimensions), then route its episodes through Human Review into Knowledge — the same path, every time.
