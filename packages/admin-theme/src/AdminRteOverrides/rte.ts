import { CometAdminRteClassKeys } from "@comet/admin-rte/lib/core/Rte";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getRteRteOverrides = (): StyleRules<{}, CometAdminRteClassKeys> => ({
    root: {},
    disabled: {},
    editor: {},
});
