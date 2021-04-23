import { CometAdminMenuClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export default (): StyleRules<{}, CometAdminMenuClassKeys> => ({
    drawer: {},
    permanent: {},
    temporary: {},
    open: {},
    closed: {},
});
