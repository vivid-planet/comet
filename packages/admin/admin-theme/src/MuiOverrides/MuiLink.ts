import { LinkClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiLinkOverrides = (palette: Palette): StyleRules<Record<string, unknown>, LinkClassKey> => ({
    root: {
        color: palette.grey[600],
    },
    underlineNone: {},
    underlineHover: {},
    underlineAlways: {},
    button: {},
    focusVisible: {},
});
