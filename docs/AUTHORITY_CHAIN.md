# MATRIYA is an Authority Chain, not a pipeline

*Prepared 2026-06-29. The Evidence Qualification work split one "smart filter" into three independent authorities (Units, Baseline, Physics). This generalises that move to the whole system: every layer of MATRIYA is an **authority** that rules on exactly one question, in its own domain, and may not speak for the next. The chain is verifiable — `authority-chain.mjs` declares it and runs the **No Authority Leakage** invariants against the real code. Run: `matriya authority` or `node authority-chain-demo.mjs`.*

---

## The courthouse

A pipeline moves data through steps. An **authority chain** moves a claim through *courts*, and each court is authorised to decide one kind of question only:

```
        Source
          │
   ┌──────────────┐   reception clerk
   │ Provenance   │   "may this source be used at all?"        → origin / role / eligible
   └──────────────┘
          │
   ┌──────────────┐   forensic lab
   │ Qualification│   "is the claim fit to enter as evidence?" → units · baseline · physics → ACCEPT/REVIEW
   └──────────────┘   (itself three courts — see below)
          │
   ┌──────────────┐   judge
   │ Human Review │   "do we accept this claim as evidence?"    → accepted / needs-more
   └──────────────┘
          │
   ┌──────────────┐   historian
   │Knowledge Event│  "what changed in our understanding?"      → event / ΔK
   └──────────────┘
          │
          ▼
     Knowledge Model
          ┊
   ┌──────────────┐   appeals court   [FUTURE — declared, not active]
   │  Reasoning   │   "does the conclusion follow from the evidence?" → SUPPORTED / NON_SEQUITUR
   │ Qualification│
   └──────────────┘
```

The clerk never says "the evidence is true". The forensic lab never says "the suspect is guilty". The judge never writes history. The historian never re-tests the evidence. That discipline *is* the architecture.

## Principle 1 — Multi-Authority (no single truth)

There is no one verdict. There are independent authorities, each ruling in its own domain — and **Qualification is itself three courts**, each with a different source of authority:

| court | the question | source of authority | level of knowledge |
|-------|--------------|---------------------|--------------------|
| Units | is the claim *intelligible*? | the unit & type system | representation |
| Baseline | is it *anomalous* vs measured-so-far? | the Fresco corpus | local knowledge |
| Physics | is it *possible at all*? | general physical/chemical law | the world |

`Units: PASS` says nothing about physics. `Baseline: OUTLIER` does not say the measurement is wrong. `Physics: VIOLATION` does not depend on anything Fresco measured. Three rulings, three domains, kept separate.

## Principle 2 — Authority Isolation / No Authority Leakage

Each authority sees only its own question and may emit only its own vocabulary. Stated as the rules that must never be broken:

- **Provenance** never says *"the claim is true"* (only: may the source be used?).
- **Qualification** never says *"the system learned"* (only: is the claim fit?).
- **Human Review** never says *"a Knowledge Event was created"* (only: do we accept it?).
- **Knowledge Event** never changes a Qualification result (only: what changed?).

These are not comments — they are **runnable invariants** (`checkAuthorityIsolation`) checked against the real modules:

```
✓ vocabularies are disjoint (Provenance ⟂ Qualification ⟂ Event)
✓ Provenance emits only {origin, role, note} — never a truth/acceptance verdict
✓ Qualification is blind to the source (same verdict with/without provenance fields injected)
✓ Qualification decision ∈ {ACCEPT, REVIEW} — never "accepted"/"event"/"learned"
✓ Knowledge Event / intake never mutates a Qualification result (idempotent)
✓ Human Review is required — intake auto-creates 0 Knowledge Events
⇒ authority isolation holds: true (6/6)
```

The third one is the sharpest: `qualifyEvidence` is *blind to the source* — passing `origin: 'external'` into the claim changes nothing, proving Qualification cannot be swayed by Provenance's question. The fifth proves the historian can't reach back and edit the lab's report.

## The future fourth authority — Reasoning Qualification

Declared in the chain, deliberately **not active yet**. Even when all three evidence courts PASS, a separate authority is needed to judge the *inference*, not the evidence:

```
measurement: Pull-off = 2.8 MPa     Units PASS · Baseline PASS · Physics PASS
conclusion:  "therefore fire resistance improved"
```

The evidence is impeccable; the inference is a non-sequitur (adhesion says nothing about fire). That is a different question — *does the conclusion follow from the evidence?* — and it belongs to a different court, downstream of the Knowledge Event, before a Decision becomes a Law. Building it now would itself be authority leakage (Qualification judging inferences), so it stays a declared, inactive station until its turn.

## Why this matters

Because each authority is authorised for one decision on one domain, each can be **tested, improved, or replaced independently** without changing the meaning of the others: enrich the Physics laws, swap the corpus baseline, tighten the type system, or later switch the human-review UI — and every other link still means exactly what it meant. That is what makes the chain scientifically auditable end to end: at any failure you can ask *which authority ruled wrongly*, and fix only that one.

## Status & next

- Built & runnable: `authority-chain.mjs` (the `AUTHORITIES` registry + `checkAuthorityIsolation` invariants), `authority-chain-demo.mjs`, wired as `matriya authority`. All 6 isolation invariants hold against the live modules.
- The chain is now explicit and self-checking: Provenance · Qualification (Units/Baseline/Physics) · Human Review · Knowledge Event · ΔK — with Reasoning Qualification declared for the future.
- Natural next step (future): activate **Reasoning Qualification** — a court that takes {evidence, conclusion} and rules SUPPORTED / NON_SEQUITUR / UNSUPPORTED, sitting after ΔK and before a Law. It judges inferences, never evidence — keeping the no-leakage rule intact.
