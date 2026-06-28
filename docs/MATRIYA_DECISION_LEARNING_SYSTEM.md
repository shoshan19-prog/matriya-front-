# MATRIYA — a Decision Learning System

*Prepared 2026-06-28. Capstone. The architecture has reached a coherent stopping point: from here, most of the value comes not from more design but from **integration with the live system**. This document fixes the final definition, the full chain, what is built, and the emitter-integration roadmap.*

---

## The definition, as it evolved

```
Knowledge Management  →  Scientific Memory  →  Decision Intelligence  →  DECISION LEARNING SYSTEM
```

MATRIYA does not only store knowledge, and not only recommend decisions — it **continuously learns whether the decisions taken actually produced a better result, and improves itself accordingly.** That is the shortest accurate description of the system as it now stands.

---

## The full chain (built)

```
Sources
  ↓
Episodes                    decision cycles, not documents
  ↓
Knowledge Events            the atom of learning (what caused a change)
  ↓
Knowledge Assets            the scientific unit (what we know)
  ↓
Knowledge Transformations   how knowledge changed (physics of knowledge)
  ↓
Knowledge Demand            how often we needed it and lacked it
  ↓
Decision Value              Knowledge → Decision → Business Value
  ↓
PROTEUS                     maximizes decision quality, governed, never auto-acts
```

Cross-cutting, all built and runnable (`mvp/knowledge-map/`):

| Capability | Module | State |
|------------|--------|-------|
| Knowledge Source Map + Trust Engine | `knowledge-map/` | ✅ learned trust(source × knowledge) |
| Episodes → observe() → Trust | `episode-bridge` | ✅ self-calibrating |
| Organizational Learning + Backlog | `learning/` | ✅ gate OPEN (50 ep · 5 families · 8 prod) |
| Knowledge Domains + gap targeting | `domains/` | ✅ choose-by-gap |
| Knowledge Assets | `assets/` | ✅ primary unit |
| Acquisition Optimization (Gain/Density/VoI) | `domains/knowledge-gain`, `transformations/voi` | ✅ |
| Transformations + Learning Primitives | `transformations/`, `events/` | ✅ physics of knowledge |
| Retrieve vs Generate | `events/learning-primitives` | ✅ two classes |
| Cost Vector + Demand (5.6) + Priority | `strategy/` | ✅ R&D-manager priority |
| Decision Value + Ledger + objective planning | `decision-value/` | ✅ Decision Intelligence |
| Governance (human approval) | throughout | ✅ recommend ≠ act |
| Privacy (no raw queries) | `telemetry/` | ✅ HMAC, field-limited |
| Router telemetry (live) | `telemetry/router-telemetry` | ✅ first live emitter |

---

## What is actually missing: live emitters, not model layers

The remaining work does not add concepts — it replaces SAMPLE/proxy/estimate with real data.

| Emitter | State | Value |
|---------|-------|------:|
| Router hit/miss | ✅ wired | high |
| Lab execution (measurements) | ❌ | very high |
| Priority / ERP (cost, duration) | ❌ | high |
| Customer / QC / warranty outcomes | ❌ | critical |

### Integration roadmap

1. **Router → Demand** ✅ *(done — `router_hit`/`router_miss`, privacy-safe, pass-through).*
2. **Priority/ERP → cost & duration.** `experiment_ordered`, `experiment_finished`, real `cost`, `duration` → the Acquisition Cost Vector stops being an estimate.
3. **Lab → measurements.** `measurement_created` (Pull-off, Vicat, PSD, Compression) → the real source of Knowledge Events.
4. **Customer/QC/Production/Warranty → outcomes.** `outcome_recorded` with real results → the only way to truly measure *Decision → Business Result*, closing the learning loop.

Each is recorded under the same governance (append-only, human-approved Intake, no auto-extract/generate, privacy-preserving). None changes a model — they make the existing one exact.

---

## The principle that held throughout

- **Honest separation:** verified vs assumption; real ΔK vs estimated cost; measured vs proxy demand — every estimate is flagged, never laundered into a finding.
- **Governance:** PROTEUS ranks and recommends; a human approves every new Intake. No auto-extract, no auto-generate.
- **Knowledge ⟂ Sources:** the Knowledge Asset is the unit, so any new pipe (SharePoint, Gmail, Priority, BASF, patents, ERP, CRM) is just another evidence supplier — the core stays invariant as the organization scales.
- **The goal is decision quality, not knowledge volume.**

> MATRIYA is a **Decision Learning System**: it organizes what Fresco knows, recommends the highest-value next action under human control, and — as the live emitters come online — learns whether those decisions actually produced better products, quality, and outcomes, improving itself from the result.
