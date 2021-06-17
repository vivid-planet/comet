import { CometAdminToolbarItemClassKeys } from "@comet/admin";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getToolbarItemOverrides = (palette: Palette): StyleRules<{}, CometAdminToolbarItemClassKeys> => ({
    root: {
        borderRight: 1,
        borderRightColor: palette.grey[50],
        borderRightStyle: "solid",
    },
});
