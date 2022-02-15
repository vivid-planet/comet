import { LinkClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiLinkOverrides = (palette: Palette): OverridesStyleRules<LinkClassKey> => ({
    root: {
        color: palette.grey[600],
    },
    underlineNone: {},
    underlineHover: {},
    underlineAlways: {},
    button: {},
    focusVisible: {},
});
