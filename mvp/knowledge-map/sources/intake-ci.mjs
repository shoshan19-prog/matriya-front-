// INTAKE-CI — the unattended entry point for the GitHub Action.
//
//   auth → read-only Drive scan → dedup → driveIntake → append flow log → report
//
// Boundaries (identical to the interactive loop): read-only, dedup, append-only
// flow log, NO approval, NO corpus write, NO knowledge promotion.
//
// Exit codes (honest signalling):
//   0  done (queued some, or nothing new) — OR cleanly SKIPPED (auth not set up)
//   1  configured but BROKEN (auth/network/drive error) — a real, visible failure
//
// So a repo with no secrets shows green "skipped"; a repo with bad/expired
// credentials shows red "failed". It never fabricates files and never half-writes.

import { appendFileSync } from 'node:fs';
import { googleDriveScan } from './drive-scan-google.mjs';
import { driveIntake } from './drive-intake.mjs';
import { readFlow } from '../research-os/flow-log-store.mjs';

const out = (msg) => { console.log(msg); if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, msg + '\n'); };

const creds = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
};

// since = the last logged intake date (with a day of overlap; dedup handles repeats)
const flow = readFlow();
const lastAt = flow.map((e) => e.at).filter(Boolean).sort().pop();
const since = lastAt ? `${String(lastAt).slice(0, 10)}T00:00:00Z` : '2026-06-01T00:00:00Z';
const today = (process.env.INTAKE_DATE || new Date().toISOString()).slice(0, 10);

const scan = await googleDriveScan({ ...creds, since });

if (!scan.ok && scan.reason === 'not_configured') {
  out(`SKIPPED — Drive auth not configured (set secrets: ${scan.missing.join(', ')}). Read-only intake did nothing.`);
  process.exit(0);
}
if (!scan.ok) {
  out(`FAILED — Drive ${scan.reason}${scan.status ? ` (HTTP ${scan.status})` : ''}${scan.detail ? `: ${scan.detail}` : ''}. No files fabricated, nothing committed.`);
  process.exit(1);
}

// dedup vs the flow log (by file name) — never re-queue a known file
const seen = new Set(flow.map((e) => e.unit));
const fresh = scan.inventory.filter((f) => !seen.has(f.name));

if (!fresh.length) { out(`intake OK — scanned since ${since}, 0 new files. Queue unchanged.`); process.exit(0); }

const r = driveIntake({ source: 'drive', inventory: fresh, now: today });
out(`intake OK — ${r.queued} file(s) QUEUED_FOR_REVIEW (flow +${r.flowAppended}). auto-approved ${r.autoApproved} · auto-writes ${r.autoWrites}.`);
for (const q of r.queue) out(`- ${q.change} · ${q.file} → ${q.hint}`);
out(`Boundary held: read-only up to Human Review. A person reviews the queue; nothing entered the corpus.`);
process.exit(0);
