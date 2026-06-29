# MATRIYA Control Room — the research studio

*Prepared 2026-06-29. A music producer doesn't look at files — they watch a live console. MATRIYA can look the same: a recording-studio control room where each **channel** is a part of the knowledge process, driven by the real module data. Build: `matriya studio` → `mvp/knowledge-map/studio/control-room.html` (self-contained, opens anywhere). Generator: `studio/studio-data.mjs` (real telemetry) + `studio/build-studio.mjs` (renders the HTML).*

---

## The console

```
 SYSTEM HEALTH   SharePoint ● · Gmail ● · Drive ● · Lab ●          ⬤ LEARNING
 CH1 Incoming Signals    CH2 Change Feed (peak)   CH3 Qualification (compressor)  CH4 Human Review
 CH5 Knowledge Growth    CH6 Evolution (timeline) CH7 Research Phase (VU)         CH8 Knowledge Entropy
 VALIDATION BOARD — reproducibility · discrimination · independence · sensitivity · isolation · reasoning
```

Each channel is one part of the process, exactly as each channel of a mixing desk is one instrument:

| channel | studio metaphor | what it shows (real source) |
|---------|-----------------|-----------------------------|
| **1 Incoming Signals** | input channels | NEW/UPDATED/DELETED per source (change feed) |
| **2 Change Feed** | peak meter | changes today · waiting · approved |
| **3 Qualification** | compressor | Units/Baseline/Physics/Review lights — red ⇒ it does not pass |
| **4 Human Review** | the control room | items waiting for a person, by cause |
| **5 Knowledge Growth** | the day's take | +Confirmations · +Discoveries · +Boundaries · Refutations |
| **6 Evolution** | DAW timeline | one product's events as points on a line |
| **7 Research Phase** | VU meter | Discovery / Validation / Production levels |
| **8 Knowledge Entropy** | the key meter | per-project disorder — the bar you want to make *fall* |

## The LEARNING light

Instead of a studio's red **RECORD** lamp, MATRIYA has a **LEARNING** lamp — the signature. It is driven by real activity:

```
dark      no change
lit       new evidence in
blinking  a knowledge event is forming     ← current state in the sample
violet    a discovery
amber     a boundary found
red       a refutation
```

You are not looking at a document manager; you are looking at a system that is thinking and learning in real time.

## Real data, honest labels

Every channel reads the actual modules — qualification lights come from a live intake of the sample document (`Units green · Baseline amber · Physics red`), knowledge growth and entropy are computed from the real corpus, the validation board reflects the true gate (reproducibility 3/3 · isolation 8/8 · reasoning 7/7 · promotable YES · auto-promote **no — a human decides**). Source/feed panels are labelled `sample` until SharePoint opens; the moment it does, the same console shows the live feed with no change to the studio.

## Status & next

- Built & runnable: `studio/studio-data.mjs` (real telemetry from every module), `studio/build-studio.mjs` (`buildStudio()` → self-contained HTML), wired as `matriya studio`. Screenshot rendered via headless Chromium.
- The HTML is committed and opens with no dependency; the PNG is git-ignored (regenerate with `matriya studio` + a headless screenshot).
- Natural next step: drop the same panels into the React app as a **Control Room tab** (`src/components/`), pointing at a small `/studio` endpoint that serves `studioData()` live — so the studio updates as evidence flows, with the LEARNING light animating on real events.
