import { TabClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { Typography } from "@material-ui/core/styles/createTypography";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiTabOverrides = (palette: Palette, typography: Typography): StyleRules<{}, TabClassKey> => ({
    root: {
        fontSize: 16,
        lineHeight: 1,
        fontWeight: typography.fontWeightBold,
        textTransform: "uppercase",
        paddingTop: 17,
        paddingRight: 10,
        paddingBottom: 18,
        paddingLeft: 10,
        "@media (min-width: 600px)": {
            minWidth: 0,
        },
        "&.Mui-selected $wrapper": {
            color: palette.primary.main,
        },
    },
    labelIcon: {},
    textColorInherit: {
        opacity: 1,
    },
    textColorPrimary: {},
    textColorSecondary: {},
    selected: {},
    disabled: {},
    fullWidth: {},
    wrapped: {},
    wrapper: {
        color: palette.grey[400],
    },
});
