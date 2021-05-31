import { CometAdminRteControlButtonClassKeys } from "@comet/admin-rte/lib/core/Controls/ControlButton";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getRteControlButtonOverrides = (): StyleRules<{}, CometAdminRteControlButtonClassKeys> => ({
    root: {},
    selected: {},
    renderAsIcon: {},
});
