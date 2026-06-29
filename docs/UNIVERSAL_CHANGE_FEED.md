# The Universal Change Detector — "what changed?", before any source

*Prepared 2026-06-29. SharePoint is blocked on two independent counts (no credentials, and `graph.microsoft.com` denied by egress policy). Rather than design "the drops" before the water is connected, this builds everything that does **not** depend on the source: a source-agnostic layer that answers one question — *what changed?* — for SharePoint, Google Drive, Gmail, a file server, Dropbox or a local folder, identically. The day Microsoft Graph opens, only the Scanner is swapped; the feed and the whole Knowledge Pipeline are already built. Code: `mvp/knowledge-map/sources/change-detector.mjs` + `change-feed.mjs`. Run: `matriya changes` or `node sources/change-feed-demo.mjs`.*

---

## The museum guard

The guard knows nothing about the paintings. He only knows *"this one wasn't here yesterday"* or *"someone moved it"*. Then the curator decides whether it matters. That separation is the design:

```
Source (any) → Scanner → [ normalized inventory ] → Change Detector → NEW / UPDATED / DELETED / UNCHANGED
                                                          │
                                                   Change Feed (timestamped stream)
                                                          │
                                                   Knowledge Pipeline  ("does this change KNOWLEDGE?")
```

- **Scanner** — the *only* source-specific part. Its single job: produce the normalized inventory.
- **Change Detector** — universal. Compares two snapshots by *signature*, never by content.
- **Change Feed** — the timestamped stream the detector hands to the curator.
- **Knowledge Pipeline** — the existing Authority Chain, unchanged, asking whether a change matters.

## The one contract every source must satisfy

```
{ source, id, name, modified, size?, hash?, etag? }
```

`id` must be stable for the same object across scans — Graph `itemId`, Drive `fileId`, Gmail `messageId`, an inode/path. Everything above the Scanner consumes this shape and nothing else. The **existing SharePoint adapter already conforms** (`scan()` returns `{source, drive, name, id, size, modified, mime}` — it has `source/id/name/modified`, and `size` only strengthens the signature), so it plugs in with zero changes the moment it can run.

## The signature — what counts as "different"

```
signature(item) = hash|etag  ‖  modified  ‖  size  ‖  name
```

It prefers a content hash or etag (catches an edit even if the clock didn't move), falls back to `modified + size`, and includes `name` so a rename/move surfaces as `UPDATED` ("someone moved it"). It uses **nothing** about content or knowledge — that blindness is what keeps "what changed?" cleanly separate from "may we use it?" and "does it change knowledge?".

## The feed (sample — yesterday → today, across four sources)

```
  09:14  UPDATED   TLV_Report_44.pdf         [sharepoint]
  09:51  NEW       MPZ_Dec2025_strength.csv  [local]
  --     DELETED   Old_Color_Report.docx     [gdrive]

  NEW 1 · UPDATED 1 · DELETED 1 · UNCHANGED 2  (actionable 3)
  by source: sharepoint 1 · gmail 0 · local 1 · gdrive 1
```

The changes span **SharePoint, Google Drive, Gmail and a local folder** and are detected identically — proving universality. (A deletion shows `--` because its timestamp is "when we noticed it gone", not the file's stale last-edit time.) Each actionable change becomes a *candidate* for the Knowledge Pipeline — human-reviewed, never auto-ingested.

## A new authority in the chain — and it stays isolated

The Change Detector is the chain's first authority — the museum guard before the reception clerk — and it obeys the same **No Authority Leakage** rule. Its 8th isolation invariant proves it is blind to content:

```
signature(plain)           = |2026-06-29T09:00|10|f.pdf
signature(+content/value)  = |2026-06-29T09:00|10|f.pdf   → identical
detect([a],[a+content])    = UNCHANGED   (content/value fields cannot fake a change)
⇒ authority isolation holds: true (8/8)
```

It may emit only `NEW / UPDATED / DELETED / UNCHANGED`; it never says "this source is allowed" (Provenance), "the claim is valid" (Qualification) or "this matters" (the pipeline).

## Why build this instead of a SharePoint delta

Because tomorrow the source might not be SharePoint at all — it could be Gmail, Drive, OneDrive, Dropbox, FTP. But they all answer the same question. Building `SharePoint Daily` would couple the system to one blocked source; building a **Universal Change Feed** means:

- the detector, the feed, and the entire Knowledge Pipeline are **done now**, while the water is still off;
- when credentials and the Graph egress policy open, you write **only** a SharePoint Scanner that emits the normalized inventory — and the existing one already conforms;
- the same feed instantly serves any future source with nothing more than its own Scanner.

## Status & next

- Built & runnable: `sources/change-detector.mjs` (`signatureOf` · `detectChanges` · `changeSummary`), `sources/change-feed.mjs` (`buildFeed` · `renderFeed` · `feedToPipeline` · sample snapshots), `change-feed-demo.mjs`, wired as `matriya changes`. Added as the first authority in the chain (isolation now 8/8).
- Governance preserved: the feed produces *candidates*; nothing is auto-ingested; the detector is blind to content and value.
- Recommended order, now in place: (1) universal Change Feed ✓, (2) the delta layer NEW/UPDATED/DELETED ✓, (3) SharePoint left exactly as-is until the credentials and Graph access open. The only remaining wire is a persisted snapshot store (append-only) so "today vs the last scan" runs against real history instead of an in-memory pair — a one-module addition behind the same interface.
