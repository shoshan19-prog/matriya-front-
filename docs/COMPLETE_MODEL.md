# The complete MATRIYA model — end to end, with two enhancements

*Prepared 2026-06-29. This closes the architecture loop: the whole Authority Chain runs as one executable, a case is walked through every authority, and two enhancements complete the model — **(1) Reasoning Qualification** activated as the fourth authority, and **(2) the Law Gate** capstone. Code: `chain.mjs`, `reasoning.mjs`, `authority-chain.mjs`. Run: `matriya chain`, `matriya reason`, `matriya law`, or `node chain-demo.mjs`.*

---

## The model

```
Source → Provenance → Qualification(Units·Baseline·Physics) → Human Review
       → Knowledge Event → ΔK → Reasoning Qualification → Decision → Law
```

`runChain(case)` threads one case through every authority. Each link rules its own question and the case advances only while green, **stopping at the first authority that needs a human or raises a flag**. The four sample cases each stop somewhere different — which is the proof the chain works:

```
good claim, sound inference   → Provenance fresco · Qualification ACCEPT · Human Review PENDING
                                (stops for a human — the chain never self-approves)
impossible value (130%)       → Qualification REVIEW {U:PASS B:INSUFFICIENT P:VIOLATION}
                                (stops at the forensic lab — physically impossible)
good evidence, BAD inference  → … Knowledge Event EVENT · Reasoning NON_SEQUITUR
                                (evidence is fine; the conclusion about Fire doesn't follow)
all green                     → … Reasoning SUPPORTED · Decision ELIGIBLE_FOR_LAW
                                (every authority green → eligible; a human still makes the Law)
```

The trace is the deliverable: at any stop you can read *which* authority ruled and *why* — the system is auditable at every link.

## Enhancement 1 — Reasoning Qualification (the 4th authority, activated)

It asks one question: **does the conclusion follow from the evidence?** — never re-judging the evidence value. It rules over the *inference* using documented asset linkages (`reasoning.mjs`):

```
✓ [NON_SEQUITUR] Pull-off (Adhesion) → "fire improved"      adhesion says nothing about fire
✓ [SUPPORTED]    measured strength → strength claim          direct
✓ [SUPPORTED]    MPZ process (Set/Cure) → strength gain      documented causal link
✓ [UNSUPPORTED]  TLV NHL bump → strength (no data)           no evidence underlies it
✓ [SUPPORTED]    SFRM density → fire                         hypothesised link (flagged)
✓ [NON_SEQUITUR] color → strength                            unlinked domains
7/7 · non-sequiturs caught: 2 · no auto-reject: true
```

These are the corpus's real inferences: MPZ's *process→strength* is sound; TLV's *NHL→strength* was **unsupported** (the strength was never measured — the exact gap every earlier layer localized); *adhesion→fire* is a textbook non-sequitur. Like every court, a non-SUPPORTED verdict routes to human REVIEW, never an auto-reject. And the 7th isolation invariant proves it judges the inference, not the number: the verdict is the same whether the value is 2.8 or 999.

## Enhancement 2 — the Law Gate (capstone)

`lawGate()` gathers **all** the accumulated validation evidence plus the live authority-isolation check into one promotion verdict:

```
✓ Reproducibility (≥3 Fresco projects)     TLV ✓ + MPZ ✓ + PROTECH A1 ✓ (INT-TFX = NOT ENOUGH DATA)
✓ Discrimination (negative control)        Business ⟂ Order diverge where they should
✓ Independence (mechanism matrix)          Information≈Gradient redundant exposed; Business⟂Order independent
✓ Sensitivity (signal/noise/adversarial)   signal ✓ · duplicate ✓ · adversarial GUARDED (Evidence Qualification)
✓ Authority Isolation (no leakage)         7/7 invariants hold against the real modules
✓ Reasoning Qualification (active)         inferences judged separately from evidence
⇒ ALL VALIDATION GREEN — promotable. Promotion to a Law remains a human decision.
promote automatically: false
```

The deliberate point: even with the whole board green, `promote` is **false**. A green board makes a metric *promotable*, not promoted — the system never declares its own laws; it lays the entire auditable case in front of a human. That is the governance stance held consistently across the whole project, now expressed as the final gate.

## What we ended up with

| layer | authority | question | governance |
|-------|-----------|----------|------------|
| Provenance | reception clerk | may the source be used? | validation = Fresco projects only |
| Evidence Qualification | forensic lab (3 courts) | is the claim fit? | units/baseline/physics, no auto-reject |
| Human Review | judge | do we accept it? | required — 0 auto-events |
| Knowledge Event / ΔK | historian | what changed? | never re-judges evidence |
| Reasoning Qualification | appeals court | does the inference follow? | judges inference, not evidence |
| Law Gate | the bench | promotable to a Law? | never auto-promotes |

Every authority is isolated, independently testable, and routes uncertainty to a human rather than hiding it. The chain is verifiable end to end (7/7 isolation invariants), and no metric is ever called a law by the machine.

## Status

- Built & runnable: `reasoning.mjs` (+ tests), `chain.mjs` (`runChain` · `lawGate` · sample cases), `chain-demo.mjs`; Reasoning activated in `authority-chain.mjs` (now 7/7). Wired as `matriya reason`, `matriya chain`, `matriya law`.
- The model is complete and self-checking. Future work is additive within the same discipline: richer causal linkages for Reasoning, more physical laws for Qualification, a live Human-Review UI — each improvable without changing the meaning of the others.
