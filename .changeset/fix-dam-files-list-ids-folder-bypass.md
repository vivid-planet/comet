---
"@comet/cms-api": patch
---

Fix `damFilesList` returning no files in subfolders when filtering by `ids`

`damFilesList` implicitly constrains to the scope root when no `folderId` is passed. The constraint already had an escape hatch for `filter.searchText`; the same now applies to `filter.ids`. Resolving a selection via `filter: { ids: ... }` returns all matching files regardless of which folder they live in, which unblocks the admin `FileField` multi-select for files in subfolders.
