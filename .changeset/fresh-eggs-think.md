---
"@comet/admin": minor
---

Add the `DataGridPanel` component to replace MUIs default `Panel` used by `DataGrid` to match the Comet DXP design

It is recommended to add this component to your theme's `defaultProps` of `MuiDataGrid`.

Example theme configuration for `admin/src/theme.ts`:

```ts
import { DataGridPanel } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import type {} from "@mui/x-data-grid/themeAugmentation";

export const theme = createCometTheme({
    components: {
        MuiDataGrid: {
            defaultProps: {
                components: {
                    Panel: DataGridPanel,
                },
            },
        },
    },
});
```
