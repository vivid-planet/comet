import { CometAdminToolbarClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const cometAdminToolbarOverrides = (): StyleRules<{}, CometAdminToolbarClassKeys> => ({
    root: {
        minHeight: 80,
    },
    muiToolbar: {
        "& [class*='MuiButton']": {
            minHeight: 40,
            alignItems: "center",
        },
    },
    historyContainer: {},
    mainContentContainer: {},
    actionContainer: {},
});
