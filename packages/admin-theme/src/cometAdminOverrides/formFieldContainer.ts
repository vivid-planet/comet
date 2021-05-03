import { CometAdminFormFieldContainerClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { errorPalette, neutrals } from "../colors";

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
        color: neutrals[900],
        fontSize: 16,
        lineHeight: "19px",
        fontWeight: 500,
    },
    inputContainer: {},
    hasError: {
        "& $label:not([class*='Mui-focused'])": {
            color: errorPalette.main,
        },
        "& [class*='CometAdminInputBase-root']:not([class*='CometAdminInputBase-focused'])": {
            borderColor: errorPalette.main,
        },
    },
    error: {
        fontSize: 14,
    },
});
