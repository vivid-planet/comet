import { SvgIconClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiSvgIconOverrides = (palette: Palette): OverridesStyleRules<SvgIconClassKey> => ({
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
