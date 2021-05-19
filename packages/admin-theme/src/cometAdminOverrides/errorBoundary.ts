import { CometAdminErrorBoundaryClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const cometAdminErrorBoundaryOverrides = (): StyleRules<{}, CometAdminErrorBoundaryClassKeys> => ({
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
