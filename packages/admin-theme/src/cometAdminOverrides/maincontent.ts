import { CometAdminMainContentClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const cometAdminMainContentOverrides = (): StyleRules<{}, CometAdminMainContentClassKeys> => ({
    root: {
        padding: 20,
    },
});
