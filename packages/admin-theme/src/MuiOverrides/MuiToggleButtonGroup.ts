import { ToggleButtonGroupClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiToggleButtonGroupOverrides = (palette: Palette): OverridesStyleRules<ToggleButtonGroupClassKey> => ({
    root: {
        backgroundColor: palette.common.white,
        borderRadius: 1,
    },
    vertical: {},
    disabled: {},
    grouped: {},
    groupedHorizontal: {},
    groupedVertical: {},
});
