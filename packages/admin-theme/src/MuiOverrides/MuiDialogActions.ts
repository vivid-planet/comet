import { DialogActionsClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiDialogActionsOverrides = (palette: Palette): StyleRules<{}, DialogActionsClassKey> => ({
    root: {
        borderTop: `1px solid ${palette.grey[100]}`,
        padding: 20,
        justifyContent: "space-between",
    },
    spacing: {},
});
