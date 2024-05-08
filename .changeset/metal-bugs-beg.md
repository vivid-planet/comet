---
"@comet/admin": minor
---

Add the ability to show and hide individual columns depending on the screen size when using `DataGridPro` with `usePersistentColumnState`

A compact view of a grid can be created by defining additional columns that show a combination of others.
Then, you can use the `showOnlyInView` setting on certain columns to show them only in the default or compact view.
When defining the columns, use the `GridColDef` type from `@comet/admin` instead of `@mui/x-data-grid`.
