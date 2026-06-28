# Knowledge Transformations (Phase 5.5) — the physics of knowledge

*Prepared 2026-06-28. The missing layer. A Knowledge Asset alone is a **snapshot**; MATRIYA must be a **living system**. So every asset carries its dynamics: `State(t0) → Evidence → Transformation → State(t1)`. The real scientific question is not "what do we know" but **"how does knowledge change when new evidence arrives"** — which evidence moved the needle, which changed nothing, what the R&D return was. This is the physics of knowledge, and it is what lets Scientific Laws (Phase 6) **emerge** from repeated transformations rather than be hand-written. Code in `mvp/knowledge-map/transformations/`, runs with `node demo.mjs`.*

```
Raw Sources → Collectors → Identity → Episodes → Knowledge Assets
     → KNOWLEDGE TRANSFORMATIONS → Domains → Scientific Laws → PROTEUS
```

---

## The unit: a transformation, not a state

We **replay** the real 8-product acquisition in order and record, for every asset, how each new piece of evidence changed it. A slice of the trajectory (`node …/transformations/demo.mjs`):

```
step  product       asset                 conf       Δconf  surprise
 3    MPZ           Compression Strength  0.00→0.63  +0.63   0.7   (first measurement)
 4    GRANITAL      Color / Shade         0.00→0.57  +0.57   0.7   (first measurement)
 6    BETONIZE      Color / Shade         0.57→0.59  +0.02   0     (near-redundant)
 7    PROTECH A1    Workability / Flow    0.77→0.78  +0.01   0     (near-redundant)
```

The **Adhesion** story the proposal asked for, told as transformations:
```
step 0 [טיח תל אביב]  Adhesion  0.00 → 0.20   (opens asset)
step 1 [תרמי]         Adhesion  0.20 → 0.35   (new product, still qualitative)
→ 0 measured after every step → confidence stuck. A pull-off measurement would transform it.
```

Knowledge is now a **trajectory**, not a photograph.

---

## What the layer answers (questions a snapshot cannot)

**Which evidence moved knowledge the most — and which was redundant:**
```
+0.63  Compression Strength via MPZ      (first-measured)
+0.57  Color / Shade        via GRANITAL (first-measured)
+0.34  Workability / Flow   via GRANITAL (first-measured)
near-zero: BETONIZE→Color +0.02, PROTECH→Workability +0.01  (qualitative into already-grounded assets)
```

**R&D ROI per product = Σ Δconfidence it produced** — the true KPI of an extraction/experiment:
```
1.20  תרמי        touched 5 assets   (opened Density, broad reach)
0.91  MPZ         touched 3 assets   (first strength data)
0.91  GRANITAL    touched 2 assets   (opened Color, measured)
0.17  BETONIZE    touched 2 assets   ← lowest: qualitative evidence into MATURE assets
```
That BETONIZE — picked as a 2nd Color source — produced the **least** knowledge is an honest, useful finding: its color was qualitative and Color was already being measured by GRANITAL. Only the transformation layer can see "an extraction that added documents but little knowledge."

---

## Innovation 1 — Value of Information (expected knowledge change, *learned*)

The real basis for acquisition optimization is not "where is a gap" but **"which evidence is expected to change the knowledge the most."** We learn that from the transformation history — the average Δconfidence of each kind of evidence event:

```
learned priors (avg Δconfidence):
  first-measured            +0.465  (n=4)   ← by far the biggest lever
  opens-asset               +0.194  (n=9)
  more-measured             +0.118  (n=4)
  new-product-qualitative   +0.101  (n=7)
```

PROTEUS then predicts each candidate's **Expected Knowledge Change** before acquiring it, scaled by remaining headroom:

```
ΔK≈0.628  acquire Set / Cure        via "first-measured"  need "set time"
ΔK≈0.581  acquire Granulometry      via "first-measured"  need "sieve curves"
ΔK≈0.535  acquire Adhesion          via "first-measured"  need "pull-off strength"
▶ HIGHEST VALUE OF INFORMATION: Set / Cure — expected ΔK ≈ 0.628 — PENDING HUMAN APPROVAL
```

This refines the earlier gap view: gap-size flagged Adhesion; **VoI** ranks **Set/Cure** marginally higher because it has the most headroom and a first measurement historically moves knowledge ~0.465. Either way the lesson is the same — *a first measurement on an unmeasured asset is the highest-value move* — but now PROTEUS proves it from history, not assumption.

---

## Innovation 2 — Surprise / Knowledge-Revision Index

Not all evidence teaches equally. Evidence that **opened an asset**, delivered the **first measurement**, or — most tellingly — **lowered confidence** (diluting our grounding) carries far more learning than evidence that nudged a number. The Surprise Index ranks where real revision happened:

```
surprise 1.2  Density        via תרמי     (opened asset)
surprise 1.2  Fire Resistance via INT-TFX  (opened asset)
surprise 0.7  Compression    via MPZ       (first measurement)
```

This is where the model genuinely changed — the events worth a human's attention, and the seeds of new patterns. (A confidence *drop* on new evidence — e.g. flooding a measured asset with qualitative notes — would score highest of all: a counter-intuitive revision is the most informative event a learning system can see.)

---

## Phase 6 emerges — Laws are not written, they converge

A Scientific Law should not be hand-coded (`if SEM then …`). It should **emerge** when an asset's transformations stop revising it — many evidence steps, stable confidence, no more surprise:

```
✔ Workability / Flow: converged (conf 0.78 over 5 transformations) → knowledge no longer revising → Law candidate
```

A law candidate is an asset (or pattern) whose *trajectory has flattened*. That is the honest bridge to Phase 6: laws are the **fixed points** of the knowledge dynamics, detected from the transformation history — exactly as the proposal framed it ("a law emerges from a series of consistent transformations").

---

## The architecture (Phase 5.5 fixed)

```
Phase 1   Documents
Phase 2   Products
Phase 3   Episodes
Phase 4   Domains
Phase 5   Knowledge Assets
Phase 5.5 KNOWLEDGE TRANSFORMATIONS   ← fixed here: knowledge as a trajectory
Phase 6   Scientific Laws             — fixed points of the trajectory (emergent)
Phase 7   PROTEUS                     — acquires the evidence with the highest expected ΔknowledgE
```

---

## Status & next

- Built & runnable: `transformation.mjs` (replay · impact · R&D ROI · revisions · law candidates), `voi.mjs` (Value of Information — innovation 1), `demo.mjs`. Surprise/revision index (innovation 2) lives in `transformation.mjs`.
- Built on the real acquisition order; every Δconfidence is computed from the real corpus.
- Next (opt-in): persist the transformation log so every future Intake appends a transformation; let PROTEUS drive acquisition by Expected Knowledge Change (VoI) under the recommend→approve governance; promote converged assets/patterns into Phase-6 Laws with the existing 5-step protocol.

> Phase 5.5 turns knowledge from a snapshot into a trajectory. We can finally ask the question that is the true KPI of R&D: **which measurement changed what we know — and by how much.**
