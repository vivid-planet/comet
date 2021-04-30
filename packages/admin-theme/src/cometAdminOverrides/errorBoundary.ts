import { CometAdminErrorBoundaryClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export default (): StyleRules<{}, CometAdminErrorBoundaryClassKeys> => ({
    alert: {},
    message: {},
    exceptionDetails: {},
    exceptionSummary: {
        paddingTop: 10,
    },
    exceptionSummaryIcon: {},
    exceptionSummaryIconOpened: {},
    exceptionSummaryIconClosed: {},
    exceptionSummaryTitle: {},
    exceptionStackTrace: {},
});
