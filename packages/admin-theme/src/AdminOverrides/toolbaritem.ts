import { CometAdminToolbarItemClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { neutrals } from "../colors";
export const getToolbarItemOverrides = (): StyleRules<{}, CometAdminToolbarItemClassKeys> => ({
    root: {
        borderRight: 1,
        borderRightColor: neutrals["50"],
        borderRightStyle: "solid",
    },
});
