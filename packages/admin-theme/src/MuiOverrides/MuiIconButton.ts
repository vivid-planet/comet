import { IconButtonClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiIconButtonOverrides = (palette: Palette): OverridesStyleRules<IconButtonClassKey> => ({
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
    sizeMedium: {},
    sizeLarge: {},
});
