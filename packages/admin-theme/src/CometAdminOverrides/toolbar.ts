import { CometAdminToolbarClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getCometAdminToolbarOverrides = (): StyleRules<{}, CometAdminToolbarClassKeys> => ({
    root: {
        minHeight: 80,
    },
    muiToolbar: {},
    mainContentContainer: {},
});
