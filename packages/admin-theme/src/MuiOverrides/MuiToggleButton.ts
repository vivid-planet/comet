import { toggleButtonClasses, ToggleButtonClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiToggleButtonOverrides = (palette: Palette): OverridesStyleRules<ToggleButtonClassKey> => ({
    root: {
        borderColor: palette.grey[100],

        [`&.${toggleButtonClasses.selected}`]: {
            backgroundColor: "transparent",
            borderBottom: `2px solid ${palette.primary.main}`,
            color: palette.primary.main,
        },
    },
    disabled: {},
    selected: {},
    standard: {},
    primary: {},
    secondary: {},
    sizeSmall: {},
    sizeMedium: {},
    sizeLarge: {},
});
