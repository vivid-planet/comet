---
"@comet/admin": minor
---

Set the custom `DataGridPanel` as default in the theme of the `DataGrid` component

If set, the `DataGridPanel` can now be removed from the project's theme, e.g., in `admin/src/theme.ts`:

```diff
- import { DataGridPanel } from "@comet/admin";
  import { createCometTheme } from "@comet/admin-theme";
- import type {} from "@mui/x-data-grid/themeAugmentation";

- export const theme = createCometTheme({
-     components: {
-         MuiDataGrid: {
-             defaultProps: {
-                 components: {
-                     Panel: DataGridPanel,
-                 },
-             },
-         },
-     },
- });
+ export const theme = createCometTheme();
```
