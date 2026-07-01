# Cockpit — Usage Log (controlled evaluation)

Purpose: decide whether the cockpit is a **work tool** or just a nice demo. Fill one
row per real use. The decision rule: **≥3 uses that supported a real decision on the
same dataset → consider wiring it in as a Tab**; otherwise it stays standalone.

How to run: open `index.html` (double-click) or `npm start` → `/cockpit/`. Use the
**Dataset selector** (APP is gated & flies; silicate/cementitious show STOP until an
ingestion request is filed). The Human-Decision buttons also keep a local counter.

| # | Date | Operator | Dataset | Question asked | Decision supported? (Y/N) | What was confusing? | What should be removed / added? |
|---|------|----------|---------|----------------|:-------------------------:|---------------------|---------------------------------|
| 1 |      | David    |         |                |                           |                     |                                 |
| 2 |      | Rachel   |         |                |                           |                     |                                 |
| 3 |      |          |         |                |                           |                     |                                 |

## After 3 real, decision-supporting uses
- If **≥3 Y** on a dataset → open the question of a React Tab (auth/routing/state).
- If mostly **N / confusing** → keep standalone; act on the "remove/add" column first.

_Notes / recurring feedback:_
-
