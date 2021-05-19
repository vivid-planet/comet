import { CometAdminMenuCollapsibleItemClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette } from "../colors";

export const cometAdminMenuCollapsibleItemOverrides = (): StyleRules<{}, CometAdminMenuCollapsibleItemClassKeys> => ({
    root: {
        "& [class*='MuiList-padding']": {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
    childSelected: {
        color: bluePalette.main,

        "& $listItem": {
            "& [class*='MuiListItemText-root']": {
                color: bluePalette.main,
            },
            "& [class*='MuiListItemIcon-root']": {
                color: bluePalette.main,
            },
        },
    },
    listItem: {},
    open: {},
});
