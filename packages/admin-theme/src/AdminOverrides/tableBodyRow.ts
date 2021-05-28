import { CometAdminTableBodyRowClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getTableBodyRowOverrides = (): StyleRules<{}, CometAdminTableBodyRowClassKeys> => ({
    even: {},
    odd: {
        backgroundColor: "#fff",
    },
});
