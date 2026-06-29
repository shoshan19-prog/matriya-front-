// SENSOR HEALTH — "is my sensory system even working?".
//
// Distinct from Knowledge Health (is the knowledge good?). A sensor can correctly
// find NOTHING new — that is fine. But a sensor that has not RUN in days is a
// different, operational problem. This reads the append-only sensor heartbeat log
// (every intake run records one, success or fail) and reports per sensor:
// last run · last success · last queue · status — proof of life, not of content.

import { existsSync, readFileSync, appendFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = dirname(fileURLToPath(import.meta.url)) + '/sensor-log.jsonl';
const SENSORS = ['Google Drive', 'SharePoint', 'Gmail', 'Local Folder'];

/** Record one sensor run (heartbeat). ok=false carries a reason (not_configured,
 *  auth_failed, …). Append-only — movement/health metadata only. */
export function recordSensorRun({ sensor, at = new Date().toISOString(), ok, queued = 0, reason = null }) {
  appendFileSync(FILE, JSON.stringify({ sensor, at, ok: !!ok, queued, ...(reason ? { reason } : {}) }) + '\n');
}

export function readSensorLog() {
  if (!existsSync(FILE)) return [];
  return readFileSync(FILE, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

const hoursSince = (at, now) => (Date.parse(now) - Date.parse(at)) / 3.6e6;

// status from RUN freshness (cadence ~4h): green if it ran ok recently, amber if
// stale, red if overdue or its last run failed, grey if it never ran.
function statusOf(last, lastOk, now) {
  if (!last) return { dot: '⚪', label: 'never run' };
  if (!last.ok) return { dot: '🔴', label: last.reason || 'last run failed' };
  const hrs = hoursSince(last.at, now);
  if (hrs <= 8) return { dot: '🟢', label: 'healthy' };
  if (hrs <= 72) return { dot: '🟡', label: `stale (${Math.round(hrs)}h)` };
  return { dot: '🔴', label: `overdue (${Math.round(hrs / 24)}d)` };
}

export function sensorHealth(now = new Date().toISOString()) {
  const log = readSensorLog();
  const rows = SENSORS.map((s) => {
    const runs = log.filter((e) => e.sensor === s).sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
    const last = runs[runs.length - 1] || null;
    const lastOk = [...runs].reverse().find((e) => e.ok) || null;
    const st = statusOf(last, lastOk, now);
    return { sensor: s, lastRun: last?.at || null, lastSuccess: lastOk?.at || null,
      queue: last?.queued ?? null, status: st.dot, health: st.label };
  });
  return { rows, healthy: rows.filter((r) => r.status === '🟢').length, total: rows.length,
    note: 'sensor health = is the sensory system running? (separate from whether the knowledge is good)' };
}
