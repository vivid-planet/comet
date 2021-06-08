import { CometAdminMenuCollapsibleItemClassKeys } from "@comet/admin";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMenuCollapsibleItemOverrides = (palette: Palette): StyleRules<{}, CometAdminMenuCollapsibleItemClassKeys> => ({
    root: {
        "& [class*='MuiList-padding']": {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
    childSelected: {
        color: palette.primary.main,

        "& $listItem": {
            "& [class*='MuiListItemText-root']": {
                color: palette.primary.main,
            },
            "& [class*='MuiListItemIcon-root']": {
                color: palette.primary.main,
            },
        },
    },
    listItem: {},
    open: {},
});
