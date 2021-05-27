import { CometAdminRteToolbarClassKeys } from "@comet/admin-rte/lib/core/Controls/Toolbar";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getRteToolbarOverrides = (): StyleRules<{}, CometAdminRteToolbarClassKeys> => ({
    root: {},
    slot: {},
});
