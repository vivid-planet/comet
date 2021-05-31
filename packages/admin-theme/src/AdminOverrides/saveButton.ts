import { CometAdminSaveButtonClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getSaveButtonOverrides = (): StyleRules<{}, CometAdminSaveButtonClassKeys> => ({
    saving: {},
    error: {},
    success: {},
    disabled: {},
});
