import { ToggleButtonClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiToggleButtonOverrides = (palette: Palette): OverridesStyleRules<ToggleButtonClassKey> => ({
    root: {
        borderColor: palette.grey[100],
    },
    disabled: {},
    selected: {
        backgroundColor: "transparent",
        borderBottom: `2px solid ${palette.primary.main}`,
        color: palette.primary.main,
    },
    standard: {},
    primary: {},
    secondary: {},
    sizeSmall: {},
    sizeMedium: {},
    sizeLarge: {},
});
