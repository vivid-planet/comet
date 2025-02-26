import { DataGridPanel } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import type {} from "@mui/lab/themeAugmentation";
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
