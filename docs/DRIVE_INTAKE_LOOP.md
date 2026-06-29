# The scheduled Drive intake — MATRIYA's heartbeat

*Prepared 2026-06-29. Using Claude Code's `/loop`+cron primitives, MATRIYA's read-only intake now runs on a schedule, turning the snapshot into a living system: every few hours it scans Google Drive, detects what's new, queues it for review, and logs the transition — so Knowledge Flow Rate accrues real cycle data over time. It drives the funnel only up to the **Human-Review wall** and no further. Code: `sources/drive-intake.mjs`, `research-os/flow-log-store.mjs`. Schedule: every 4 hours (`17 */4 * * *`).*

---

## What runs each cycle

```
Drive scan (modifiedTime > last run)
   → Change Detector (NEW / UPDATED / DELETED)
   → Provenance (Drive = Fresco internal)
   → REVIEW queue (file → asset hint → QUEUED_FOR_REVIEW)
   → append the transition to the flow log
   → commit the flow log (durability)
   → message the user only if there is something new
```

Proven on the live Drive (first pass): 5 real files queued —
```
NEW  MP20_QC_Report_Formula_Update.docx   → Compression Strength · QUEUED_FOR_REVIEW
NEW  RE_ Fresco Intumescent fire test…    → Fire Resistance · QUEUED_FOR_REVIEW
NEW  דוח סיכום MPZ.docx                    → Compression Strength · QUEUED_FOR_REVIEW
…  flow log +5 transitions · auto-approved 0 · auto-writes 0
```

## The hard boundary — read-only up to the wall

The loop **detects, classifies, queues, and logs**. It **never**: approves, writes to the corpus (`REAL_EPISODES`), declares knowledge, ranks, or concludes. `autoApproved` and `autoWrites` are 0 by construction. A human metabolizes what it queues; the loop only keeps the queue moving to the wall. The flow log records movement metadata only — a unit, a transition, a date, a note — never source content, never secrets.

## It makes Flow Rate live

The flow log is committed (`research-os/flow-log.jsonl`), so it is durable and auditable. With ≥2 dates logged, **Knowledge Flow Rate** now computes real throughput (currently `2/day`) instead of returning null — the metabolism metric is alive and grows sharper every cycle.

## Honest limitations

- **Session-bound schedule.** The cron is active now (every 4h at :17) but, in this environment, lives only while the session is alive, and recurring jobs **auto-expire after 7 days**. It needs re-arming (and the session kept alive) to persist — it is not yet a server-side daemon.
- **MCP auth in headless runs.** A scheduled run may not have interactive Google Drive access. The prompt handles this honestly: if Drive is unreachable it reports one line and skips — it never fabricates files or commits.
- **De-dup across ephemeral containers.** Each run queries Drive by `modifiedTime > last run` and drops files already in the flow log by name, so the same file is not re-queued.

## Status & next

- Active: `sources/drive-intake.mjs` (read-only intake), `research-os/flow-log-store.mjs` + committed `flow-log.jsonl`, `matriya intake-drive`, and a 4-hourly cron driving it. Flow Rate reads the live log.
- For true durability beyond a session, the same intake should run as a small server-side job (or a GitHub Action on a schedule) calling the Drive scanner → `driveIntake` → commit the flow log. The code is already the scanner-agnostic piece; only the trigger changes.
- The human's job is unchanged: review the queue. The loop never crosses the wall.
