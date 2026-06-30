// UNIVERSAL CHANGE DETECTOR — the museum guard.
//
// It knows NOTHING about the paintings. It only knows: "this one was not here
// yesterday", or "someone moved it". Source-agnostic on purpose — SharePoint,
// Google Drive, Gmail, a file server, Dropbox, a local folder all answer the same
// question, so the detector must not depend on any of them.
//
//   Source (any) → Scanner → [ normalized inventory ] → Change Detector → NEW / UPDATED / DELETED / UNCHANGED
//
// The ONLY contract a source must satisfy is the normalized item shape:
//   { source, id, name, modified, size?, hash?, etag? }
// `id` must be stable for the same object across scans (Graph itemId, Drive fileId,
// Gmail messageId, inode/path…). Everything above the Scanner is identical for
// every source — the day Microsoft Graph opens, you swap the Scanner and nothing
// else changes.
//
// The detector is blind to content and to knowledge: it compares SIGNATURES, never
// values. That blindness is the whole point — it keeps "what changed?" cleanly
// separate from "may we use it?" (Provenance) and "does it change knowledge?"
// (the Knowledge Pipeline).

export const CHANGE = { NEW: 'NEW', UPDATED: 'UPDATED', DELETED: 'DELETED', UNCHANGED: 'UNCHANGED' };

/** The change signature of one item — what counts as "different".
 *  Prefers a content hash / etag (detects edits even if the clock didn't move),
 *  falls back to modified + size, and includes name so a rename/move shows as
 *  UPDATED ("someone moved it"). Uses NOTHING about content or knowledge. */
export function signatureOf(item) {
  const strong = item.hash || item.etag || '';
  return `${strong}|${item.modified || ''}|${item.size ?? ''}|${item.name || ''}`;
}

/** Compare a previous snapshot to the current inventory. Both are arrays of
 *  normalized items. Returns one change record per id, source-agnostic. */
export function detectChanges(previous = [], current = []) {
  const prev = new Map(previous.map((i) => [i.id, i]));
  const cur = new Map(current.map((i) => [i.id, i]));
  const out = [];

  for (const [id, item] of cur) {
    const before = prev.get(id);
    if (!before) { out.push(rec(CHANGE.NEW, item, null)); continue; }
    out.push(rec(signatureOf(before) === signatureOf(item) ? CHANGE.UNCHANGED : CHANGE.UPDATED, item, before));
  }
  for (const [id, item] of prev) if (!cur.has(id)) out.push(rec(CHANGE.DELETED, item, item));
  return out;
}

function rec(status, item, before) {
  return { id: item.id, name: item.name, source: item.source,
    status, modified: item.modified || null, prevModified: before?.modified || null };
}

/** Roll-up of a change set (for reporting). */
export function changeSummary(changes) {
  const by = (s) => changes.filter((c) => c.status === s);
  return {
    total: changes.length,
    NEW: by(CHANGE.NEW).length, UPDATED: by(CHANGE.UPDATED).length,
    DELETED: by(CHANGE.DELETED).length, UNCHANGED: by(CHANGE.UNCHANGED).length,
    actionable: changes.filter((c) => c.status !== CHANGE.UNCHANGED).length,
    bySource: [...new Set(changes.map((c) => c.source))].map((src) => ({
      source: src, changed: changes.filter((c) => c.source === src && c.status !== CHANGE.UNCHANGED).length })),
  };
}
