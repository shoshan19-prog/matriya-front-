# Does the metric break? — the Sensitivity Harness (validation test 4)

*Prepared 2026-06-29. Before replicating the metrics on INT-TFX and MPZ, one more validity test. Reproducibility asks "does it repeat?", discrimination asks "does it separate things that differ?", independence asks "are the mechanisms really distinct?". **Sensitivity** asks a different question: if I change one small detail, does the metric move by a sensible amount? A metric that barely twitches when something relevant changed is **insensitive**; one that lurches at a trivial change is **unstable**. Code: `mvp/knowledge-map/metrics/sensitivity.mjs`. Run: `matriya sensitivity`.*

---

## The shape of the test

```
Corpus → Perturbation → Recompute → ΔMetric
```

Take the real corpus, apply one controlled change, recompute every corpus-derived metric, and read the delta. A metric passes if the deltas line up with the *kind* of change:

| Kind | Change | Expectation |
|------|--------|-------------|
| **signal** | add/remove a real measurement, drop an episode | metric should **move**, proportionately |
| **noise** | duplicate an existing document | metric should **not move** (no new knowledge) |
| **adversarial** | inject a *false* "measured" claim | metric should **resist** (the value isn't real) |

The snapshot we perturb captures: average asset entropy, Adhesion confidence, Compression confidence, knowledge phase, the top recommended action, and the top Information-Potential action.

## Results on the real corpus

```
[signal]      +measurement (Adhesion)      Δ entropy −0.014 · adhConf +0.20   GOOD — responded proportionately
[signal]      −measurement (Compression)   Δ entropy +0.004 · compConf −0.04  GOOD — responded proportionately
[noise]       duplicate document           Δ entropy  0.000 · adhConf  0.00   GOOD — ignored the duplicate
[signal]      missing episode              Δ entropy +0.002 · adhConf −0.03   GOOD — responded proportionately
[adversarial] wrong inference              Δ entropy −0.014 · adhConf +0.20   GAP  — counted a false claim as real
```

Three findings, in order of comfort:

**1. Signal response — passes.** Adding an adhesion measurement raises adhesion confidence and lowers entropy; removing a compression measurement lowers compression confidence and raises entropy; dropping an episode moves things a little. The metrics are sensitive to real change, and in the right direction and rough magnitude.

**2. Duplicate noise — passes, after a fix.** The harness originally caught a real weakness: duplicating a document moved confidence **+0.03**. That is wrong — a photocopy carries no new knowledge, but the registry was counting *documents*. Fixed in `domains/registry.mjs` by deduplicating exact-identical evidence (`product|domain|signal|note`) before aggregating. The duplicate now moves every metric **0.000**, and — verified — the real-corpus numbers are unchanged (the dedup only removes true duplicates, of which the real corpus has none). The metric now counts knowledge, not paper.

**3. Wrong inference — an open GAP, reported not hidden.** Injecting a *false* "Adhesion: measured" claim moves the metric exactly like a *true* one (adhConf +0.20). The system has no content-level contradiction check: it trusts that a claim tagged `measured` reflects a real measurement. This is the honest edge of the architecture. It is acceptable *today* because every Intake passes through human approval (a person vouches for the evidence), but it means the metric is only as trustworthy as its corpus — it cannot yet defend itself against a bad claim. The fix is a future content-level consistency check (does this measurement contradict the existing distribution for the asset?), which is a real feature, not a one-line guard.

---

## What this changes

- A genuine bug fixed: the registry counted documents; now it counts knowledge. This is exactly the failure the duplicate-noise probe is designed to surface.
- A known limit made explicit: the metrics inherit the truthfulness of the corpus and cannot detect an adversarial false claim. Human approval is the current control; a content-level contradiction check is the named next step.

## The four-test validity bar

A metric earns a place in the permanent architecture only after all four:

| Test | Question | Status |
|------|----------|--------|
| Reproducibility | does it converge across ≥3 projects? | ✗ (1 of 3 — needs INT-TFX, MPZ) |
| Discrimination | does it separate things that genuinely differ? | ✓ (Business ⟂ Order diverge) |
| Independence | are the mechanisms distinct? | ✓ (exposed Information ≈ Gradient as redundant) |
| **Sensitivity** | does it move sensibly under controlled change? | **◐ — signal ✓, noise ✓ (after fix), adversarial GAP** |

Sensitivity is *mostly* passed: it responds to signal and now ignores noise, with one documented adversarial gap. It does not promote anything on its own — it is a gate that the metrics must keep passing as the corpus grows.

## Status & next

- Built & runnable: `metrics/sensitivity.mjs` (perturbations · snapshot · `sensitivity()` · `verdicts()`), folded into `matriya sensitivity`.
- Fix shipped: dedup in `domains/registry.mjs` — duplicate documents no longer move any metric; real-corpus numbers unchanged.
- Open: adversarial / wrong-inference gap — flagged, not patched (needs a content-level contradiction check, not a guard).
- Then the validation plan resumes: replicate the three metrics on **INT-TFX**, then **MPZ**, to move reproducibility from 1/3 toward the gate.

> A metric you have not tried to break is a guess you happen to like. The harness broke one (duplicate → fixed) and found the edge of another (adversarial → named). Still measured hypotheses, not laws.
