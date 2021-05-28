import { CometAdminMainContentClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMainContentOverrides = (): StyleRules<{}, CometAdminMainContentClassKeys> => ({
    root: {
        padding: 20,
    },
});
