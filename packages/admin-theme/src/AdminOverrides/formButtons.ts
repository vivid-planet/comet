import { CometAdminFormButtonsClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getFormButtonsOverrides = (): StyleRules<{}, CometAdminFormButtonsClassKeys> => ({
    root: {},
    cancelButton: {},
    saveButton: {},
});
