---
"@comet/cms-admin": patch
---

Make `@mui/x-data-grid-pro` truly optional in `TableBlock`

The `TableBlock` grid now dynamically detects whether `@mui/x-data-grid-pro` is installed at runtime. When Pro is available, the full feature set (row reordering via drag-and-drop, column pinning) is used. When Pro is not installed, the component falls back to the community `DataGrid` without these Pro-only features.
