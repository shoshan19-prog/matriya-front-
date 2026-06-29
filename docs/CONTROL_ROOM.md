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

## In the app — a READ-ONLY tab

The same console now lives in the React app as a **Control Room tab** (`src/components/ControlRoomTab.js`), built to a strict boundary: **it only displays**. No approvals, no writes, no ledger changes — just the view, so the live UX can be tested with zero production risk.

- **Data source**: `GET /api/control-room` (a read-only endpoint) when `REACT_APP_CONTROL_ROOM_URL` is set, else the static `public/control-room.json` snapshot shipped with the app. Either way the tab only *reads*.
- **The endpoint** (`studio/studio-server.mjs`, run via `matriya serve`) exposes exactly two GET routes and computes the data fresh each request — there are **no** POST/PUT/DELETE routes, so it cannot mutate anything.
- **Auto-refresh** every 15s; it keeps the last good data and degrades gracefully.
- **Badges**: `SAMPLE` (sources offline — current state), `LIVE` (a real source online), `PENDING` (endpoint not reachable yet).

No action buttons are wired from the screen. After a couple of days of just watching, decide which buttons — if any — are safe to add.

## Status & next

- Built & runnable: `studio/studio-data.mjs` (real telemetry + `mode` badge), `studio/build-studio.mjs` (`buildStudio()` → self-contained HTML **and** `public/control-room.json`), `studio/studio-server.mjs` (read-only `GET /api/control-room`), `src/components/ControlRoomTab.{js,css}` wired as a tab in `App.js`. Commands: `matriya studio` (rebuild), `matriya serve` (live read-only endpoint).
- The standalone HTML and the static JSON are committed; the screenshot PNG is git-ignored.
- Deliberately deferred: any approve/write control from the screen. Read-only first; revisit buttons after real use.
