import { tabClasses, TabClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Typography } from "@mui/material/styles/createTypography";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiTabOverrides = (palette: Palette, typography: Typography): OverridesStyleRules<TabClassKey> => ({
    root: {
        fontSize: 16,
        lineHeight: 1,
        fontWeight: typography.fontWeightBold,
        paddingTop: 17,
        paddingRight: 10,
        paddingBottom: 18,
        paddingLeft: 10,
        color: palette.grey[400],

        "@media (min-width: 600px)": {
            minWidth: 0,
        },
        [`&.${tabClasses.selected}`]: {
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
    iconWrapper: {},
});
