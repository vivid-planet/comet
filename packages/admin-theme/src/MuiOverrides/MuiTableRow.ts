import { TableRowClassKey } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiTableRowOverrides = (): OverridesStyleRules<TableRowClassKey> => ({
    root: {
        backgroundColor: "#fff",
    },
    selected: {},
    hover: {},
    head: {},
    footer: {},
});
