import { DialogContentTextClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiDialogTextContentOverrides = (palette: Palette): StyleRules<Record<string, unknown>, DialogContentTextClassKey> => ({
    root: {
        color: palette.text.primary,
        marginBottom: 20,
    },
});
