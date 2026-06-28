// Google Drive Collector adapter.
//
// Drive data reaches this session through the Google Drive MCP tool (search_files),
// NOT a node-callable REST endpoint — so this adapter does not fetch by itself.
// It maps an already-fetched Drive listing (the array the MCP returns) into the
// uniform Collector item shape, so the SAME Normalizer/Classifier run on it.
//
// fromListing(driveFiles): driveFiles = [{ id, title, mimeType, fileSize, _path? }]

export function fromListing(driveFiles) {
  return (driveFiles || []).map((f) => ({
    source_id: f.id,
    name: f.title || f.name,
    path: f._path || f.parentPath || f.title || f.name,
    mime_type: f.mimeType || null,
    size_bytes: f.fileSize != null ? Number(f.fileSize) : null,
    web_url: f.viewUrl || null,
  }));
}
