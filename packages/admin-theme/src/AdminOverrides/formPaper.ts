import { CometAdminFormPaperKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getFormPaperOverrides = (): StyleRules<{}, CometAdminFormPaperKeys> => ({
    root: {
        padding: 20,
    },
});
