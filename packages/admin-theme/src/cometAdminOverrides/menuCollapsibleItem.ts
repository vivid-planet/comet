import { CometAdminMenuCollapsibleItemClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { cometBlue } from "../colors";

export default (): StyleRules<{}, CometAdminMenuCollapsibleItemClassKeys> => ({
    root: {
        "& [class*='MuiList-padding']": {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
    childSelected: {
        color: cometBlue.main,

        "& $listItem": {
            "& [class*='MuiListItemText-root']": {
                color: cometBlue.main,
            },
            "& [class*='MuiListItemIcon-root']": {
                color: cometBlue.main,
            },
        },
    },
    listItem: {},
    open: {},
});
