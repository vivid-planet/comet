---
"@comet/admin": minor
---

Add the `DataGridPanel` component to replace MUIs default Panel used by DataGrid to match the Comet DXP design

It is recommended to add this component to your theme's `defaultProps` of `MuiDataGrid`.
Additionally it is recommended to set the `localeText` prop to ensure the correct text is displayed in the panels.

_Due to technical limitations, these values can currently not be provided by the default theme from the `@comet/admin-theme` package._

Example theme configuration for `admin/src/theme.ts`:

```ts
import { DataGridPanel } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { IntlShape } from "react-intl";

export const getTheme = (intl: IntlShape) =>
    createCometTheme({
        components: {
            MuiDataGrid: {
                defaultProps: {
                    localeText: {
                        filterPanelColumns: intl.formatMessage({ id: "dataGrid.filterPanelColumns", defaultMessage: "Column" }),
                        columnsPanelTextFieldLabel: "",
                        columnsPanelTextFieldPlaceholder: intl.formatMessage({
                            id: "dataGrid.columnsPanelTextFieldPlaceholder",
                            defaultMessage: "Find column...",
                        }),
                    },
                    components: {
                        Panel: DataGridPanel,
                    },
                },
            },
        },
    });
```
