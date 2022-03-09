import { SvgIconClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiSvgIconOverrides = (palette: Palette): StyleRules<Record<string, unknown>, SvgIconClassKey> => ({
    root: {
        fontSize: 16,
    },
    colorSecondary: {},
    colorAction: {},
    colorDisabled: {
        color: palette.grey[200],
    },
    colorError: {},
    colorPrimary: {},
    fontSizeInherit: {},
    fontSizeSmall: {
        fontSize: 10,
    },
    fontSizeLarge: {
        fontSize: 20,
    },
});
