import { DataGridPanel } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import type {} from "@mui/lab/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { IntlShape } from "react-intl";

export const getTheme = (intl: IntlShape) =>
    createCometTheme({
        components: {
            MuiDataGrid: {
                defaultProps: {
                    localeText: {
                        // TODO: Move this into the theme by default - once `@comet/admin-theme` has been merged with `@comet/admin`
                        filterPanelColumns: intl.formatMessage({ id: "dataGrid.filterPanelColumns", defaultMessage: "Column" }),
                        columnsPanelTextFieldPlaceholder: intl.formatMessage({
                            id: "dataGrid.columnsPanelTextFieldPlaceholder",
                            defaultMessage: "Find column...",
                        }),
                    },
                    components: {
                        // TODO: Move this into the theme by default - once `@comet/admin-theme` has been merged with `@comet/admin`
                        Panel: DataGridPanel,
                    },
                },
            },
        },
    });
