import { CometAdminSaveSplitButtonClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const cometAdminSaveSplitButtonOverrides = (): StyleRules<{}, CometAdminSaveSplitButtonClassKeys> => ({
    saving: {},
    error: {},
    success: {},
    disabled: {},
});
