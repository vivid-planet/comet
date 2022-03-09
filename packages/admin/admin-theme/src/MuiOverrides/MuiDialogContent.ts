import { DialogContentClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiDialogContentOverrides = (palette: Palette): StyleRules<Record<string, unknown>, DialogContentClassKey> => ({
    root: {
        backgroundColor: palette.grey[50],
        padding: 40,
    },
    dividers: {},
});
