import { Palette } from "@material-ui/core/styles/createPalette";
import { ToggleButtonGroupClassKey } from "@material-ui/lab";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiToggleButtonGroupOverrides = (palette: Palette): StyleRules<{}, ToggleButtonGroupClassKey> => ({
    root: {
        backgroundColor: palette.common.white,
        borderRadius: 1,
    },
    grouped: {},
    groupedHorizontal: {},
    groupedVertical: {},
    vertical: {},
});
