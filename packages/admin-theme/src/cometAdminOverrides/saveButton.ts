import { CometAdminSaveButtonClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const cometAdminSaveButtonOverrides = (): StyleRules<{}, CometAdminSaveButtonClassKeys> => ({
    saving: {},
    error: {},
    success: {},
    disabled: {},
});
