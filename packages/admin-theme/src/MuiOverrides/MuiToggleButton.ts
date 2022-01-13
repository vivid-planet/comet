import { Palette } from "@material-ui/core/styles/createPalette";
import { ToggleButtonClassKey } from "@material-ui/lab";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiToggleButtonOverrides = (palette: Palette): StyleRules<{}, ToggleButtonClassKey> => ({
    root: {
        borderColor: palette.grey[100],
        "&$selected": {
            backgroundColor: "transparent",
            borderBottom: `2px solid ${palette.primary.main}`,
            color: palette.primary.main,
        },
    },
    disabled: {},
    label: {},
    selected: {},
    sizeLarge: {},
    sizeSmall: {},
});
