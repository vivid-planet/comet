import { TableRowClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiTableRowOverrides = (): StyleRules<{}, TableRowClassKey> => ({
    root: {
        backgroundColor: "#fff",
    },
    selected: {},
    hover: {},
    head: {},
    footer: {},
});
