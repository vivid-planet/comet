---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add a visibility filter to the warnings grid

Warnings can now be filtered by whether their source is currently visible. The `Warning` type exposes a `visible` field and `WarningFilter` a `visible` filter, and the warnings grid shows a filterable "Visibility" column.

For entity warnings the visibility is the referenced entity's visibility (`EntityInfo`). For block warnings it additionally requires the block itself to be visible within its content tree (`block_index`), so a warning on a hidden block—or a block inside a hidden document—is reported as not visible.
