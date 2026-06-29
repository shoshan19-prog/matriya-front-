# The stable sensor — MATRIYA Drive intake as a GitHub Action

*Prepared 2026-06-29. The session cron made MATRIYA alert; this makes it a stable, unattended sensor. A scheduled GitHub Action runs the read-only Drive intake every 4 hours on a GitHub runner (open internet → no proxy block), under the exact same boundaries. Code: `.github/workflows/drive-intake.yml` + `sources/intake-ci.mjs` + `sources/drive-scan-google.mjs`.*

---

## The boundaries (unchanged)

```
auth → read-only Drive scan → dedup → driveIntake → append flow log → report
```

read-only · dedup vs the flow log · append-only flow log · **no approval · no corpus write · no knowledge promotion**. The Action commits only `research-os/flow-log.jsonl` (movement metadata: unit · transition · date · note). It is the nurse on shift — it records pulse, temperature, pressure; it does not decide surgery.

## Success conditions — and how each is met

| condition | how |
|-----------|-----|
| runs unattended | `schedule: '17 */4 * * *'` on a GitHub runner |
| commits/archives flow-log | final step commits `flow-log.jsonl` back to the branch, with the event count |
| reports queue size | `intake-ci` writes the queue + counts to `$GITHUB_STEP_SUMMARY` |
| fails honestly if Drive auth missing | no secrets → **SKIP** (green, clear message); bad/expired creds → **exit 1** (red). Never fabricates files. |

The skip-vs-fail split matters: a repo that hasn't been wired yet is *skipped* (not a false red every 4 hours), while a repo that *is* wired but broken *fails loudly* — the honest signal.

## What you provide — Google OAuth (your Drive, your token)

The Action authenticates as **you** with a read-only refresh token (the Drive is a personal account, so a service account can't reach it). One-time setup:

1. **Google Cloud Console → APIs & Services**: enable the **Google Drive API**.
2. **Credentials → Create OAuth client ID → Desktop app.** Note the **Client ID** and **Client secret**.
3. **Get a refresh token** with the read-only scope `https://www.googleapis.com/auth/drive.readonly` and offline access (e.g. via the OAuth Playground: gear → "Use your own OAuth credentials" → authorize Drive readonly → exchange for tokens → copy the **refresh_token**).
4. **Repo → Settings → Secrets and variables → Actions → New secret**, add three:
   ```
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   GOOGLE_REFRESH_TOKEN
   ```
   The scope is `drive.readonly` — the token cannot write to your Drive even if it wanted to.

## What to expect on the first run

- **With no secrets set:** the run is **green** and the summary says `SKIPPED — Drive auth not configured`. Nothing is scanned, nothing is committed. (This is the safe default — the Action will not fail-spam an unconfigured repo.)
- **With the three secrets set:** the run scans Drive for files modified since the last logged intake, queues the genuinely new ones (`N file(s) QUEUED_FOR_REVIEW`), appends them to `research-os/flow-log.jsonl`, records a heartbeat in `research-os/sensor-log.jsonl`, and commits **only those two log files** back to the branch. The summary shows the queue and the new flow-log size. Nothing enters the corpus.
- **With bad/expired secrets:** the run is **red** (`FAILED — Drive auth_failed`) — the honest signal that it's wired but broken. No files are fabricated and nothing is committed.

It commits only the two append-only log files (`flow-log.jsonl`, `sensor-log.jsonl`) — never any business/knowledge data.

## Activating the schedule

GitHub only fires `schedule` triggers from the **default branch**. The workflow currently lives on `claude/new-session-gg81uh`:
- **Now:** run it on demand with **Actions → matriya-drive-intake → Run workflow** (`workflow_dispatch`).
- **To run every 4 hours unattended:** merge `.github/workflows/drive-intake.yml` to the default branch.

## What it does NOT do

No approval, no corpus write, no knowledge promotion, no ranking, no "best product". It detects, queues, logs, and reports — and stops at the Human-Review wall. The `intake-ci` exit codes and the read-only `drive.readonly` scope make that boundary structural, not just a promise.

## Status & next

- Built: `sources/drive-scan-google.mjs` (zero-dep Drive REST scanner), `sources/intake-ci.mjs` (auth/dedup/report, honest exit codes), `.github/workflows/drive-intake.yml` (4-hourly, commits the flow log). The no-secrets SKIP path is verified locally (exit 0).
- To go live: add the three secrets, then merge the workflow to the default branch. The flow log then accrues unattended, and Knowledge Flow Rate sharpens on real cadence.
- The human's role is unchanged: review the queue. The sensor never crosses the wall.
