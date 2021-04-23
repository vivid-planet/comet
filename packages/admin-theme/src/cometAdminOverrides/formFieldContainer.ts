import { CometAdminFormFieldContainerClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export default (): StyleRules<{}, CometAdminFormFieldContainerClassKeys> => ({
    root: {
        marginBottom: 20,
    },
    vertical: {
        "& $label": {
            marginBottom: 10,
        },
    },
    horizontal: {},
    required: {},
    disabled: {},
    label: {
        color: "#242424",
        fontSize: 16,
        lineHeight: "19px",
        fontWeight: 500,
    },
    inputContainer: {},
    hasError: {},
    error: {},
});
