import { IconButtonClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiIconButtonOverrides = (palette: Palette): StyleRules<{}, IconButtonClassKey> => ({
    root: {
        color: palette.grey[900],
    },
    edgeStart: {},
    edgeEnd: {},
    colorInherit: {},
    colorPrimary: {},
    colorSecondary: {},
    disabled: {},
    sizeSmall: {},
    label: {},
});
