import { CometAdminFormFieldContainerClassKeys } from "@comet/admin";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getFormFieldContainerOverrides = (palette: Palette): StyleRules<{}, CometAdminFormFieldContainerClassKeys> => ({
    root: {
        "&:not(:last-child)": {
            marginBottom: 20,
        },
    },
    vertical: {
        "& $label": {
            marginBottom: 10,
        },
    },
    horizontal: {},
    fullWidth: {},
    required: {},
    disabled: {},
    label: {
        color: palette.grey[900],
        fontSize: 16,
        lineHeight: "19px",
        fontWeight: 500,
    },
    inputContainer: {},
    hasError: {
        "& $label:not([class*='Mui-focused'])": {
            color: palette.error.main,
        },
        "& [class*='CometAdminInputBase-root']:not([class*='CometAdminInputBase-focused'])": {
            borderColor: palette.error.main,
        },
    },
    error: {
        fontSize: 14,
    },
    hasWarning: {
        "& $label:not([class*='Mui-focused'])": {
            color: palette.warning.main,
        },
        "& [class*='CometAdminInputBase-root']:not([class*='CometAdminInputBase-focused'])": {
            borderColor: palette.warning.main,
        },
    },
    warning: {
        fontSize: 14,
    },
});
