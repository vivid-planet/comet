import { createCometTheme, DataGridPanel } from "@comet/admin";
import type {} from "@mui/x-data-grid/themeAugmentation";

export const theme = createCometTheme({
    components: {
        MuiDataGrid: {
            defaultProps: {
                slots: {
                    // @ts-expect-error @jamesricky fix this please
                    panel: DataGridPanel,
                },
            },
        },
    },
});
