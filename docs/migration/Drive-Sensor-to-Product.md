# Drive Sensor → Product — connection spec (queued for mono-repo)

**Status: documentation only. No implementation, no code, no PR.** The sensor stays
**active as-is (KEEP)**. This describes exactly what's needed to route its output
into the new product, for the mono-repo migration work queue.

## 1. Data source — the Drive Sensor
- **What:** GitHub Action `matriya-drive-intake` (`.github/workflows/drive-intake.yml`)
  on `matriya-front-`/main. Cron `17 */4 * * *` (every 4h) + manual dispatch.
- **Does:** read-only Google Drive scan → dedup vs. last snapshot → append events →
  commit logs back (`[skip ci]`). Boundaries: **read-only · no corpus write · no
  promotion · no approval.** It is a *sensor*, not an ingester.
- **Auth:** user OAuth (`GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN` repo secrets).
- **Current state:** last heartbeat `ok:false · reason:"not_configured"` → the
  secrets are **not set**, so it runs green but produces nothing (dormant no-op).

## 2. The output it produces
Two append-only JSONL files in `mvp/knowledge-map/research-os/`:
- **`flow-log.jsonl`** — one record per actionable Drive change (movement metadata
  only, no file content):
  `{"unit":"<filename>","stage":"NEW→Review","at":"<date>","note":"drive intake · —"}`
  Each event is internally marked `QUEUED_FOR_REVIEW`.
- **`sensor-log.jsonl`** — heartbeat health:
  `{"sensor":"Google Drive","at":"<iso>","ok":<bool>,"queued":<n>,"reason":"<...>"}`

**Consumers today: none.** No app code reads these (grep of `src/` is empty).

## 3. Appropriate connection point in the product
The flow event's own label — **`QUEUED_FOR_REVIEW`** — is exactly the product's
**knowledge-ingestion intake**. The clean hook is:

```
Drive Sensor (flow-log event)  →  Product Ingestion Queue  →  G1–G6 gates
(human provenance + anchors + dual sign-off)  →  IKL Vector Store / Material Library
```

i.e. each flow event becomes an **Ingestion Request** (the `ingestion-request`
contract already exists in `matriya-back`) that a human reviews before it is
indexed. The sensor supplies the *trigger + provenance metadata*; the product owns
review + indexing.

## 4. What needs to change for the product to consume it
No new ingestion is to be built — only the wiring below (all deferred):
1. **A reader/subscriber.** Today the log is a file nobody reads. The product needs
   either (a) to read `flow-log.jsonl` from a shared path (trivial in the mono-repo),
   or (b) the sensor emits to a shared sink (DB table / queue / endpoint) the product
   tails. Prefer a sink over a committed file once repos merge.
2. **Metadata → Ingestion Request mapping.** Map `{unit, stage, at, note}` onto the
   existing `ingestion-request` fields (`rawSource`, `provenanceReview`, …). The
   flow event fills `rawSource` (Drive file identity); the human fills the rest.
3. **Content fetch on approval.** The sensor carries metadata only. On human
   approval, the ingestion step must fetch the actual Drive file content (reuse the
   sensor's existing Drive auth) before indexing.
4. **Configure auth.** Set `GOOGLE_*` secrets so the sensor leaves the
   `not_configured` no-op state and actually queues events.
5. **Mono-repo relocation.** Move the sensor + its sink into the shared repo (or
   keep the Action but retarget its output at the product ingestion queue), so the
   product build reads it directly.

## Boundary (unchanged)
The sensor stays **KEEP / active / untouched**. Nothing here is turned off, moved,
or wired yet — this is the migration checklist only. No Vercel/Railway/Deployment
changes. No corpus write, no promotion: a human still gates every ingestion (G1–G6).
