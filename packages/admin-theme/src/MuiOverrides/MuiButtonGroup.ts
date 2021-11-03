import { ButtonGroupClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiButtonGroupOverrides = (palette: Palette): StyleRules<{}, ButtonGroupClassKey> => ({
    root: {},
    contained: {
        border: "none",
    },
    disabled: {},
    disableElevation: {},
    fullWidth: {},
    vertical: {},
    grouped: {},
    groupedHorizontal: {},
    groupedVertical: {},
    groupedText: {},
    groupedTextHorizontal: {},
    groupedTextVertical: {},
    groupedTextPrimary: {},
    groupedTextSecondary: {},
    groupedOutlined: {},
    groupedOutlinedHorizontal: {},
    groupedOutlinedVertical: {},
    groupedOutlinedPrimary: {},
    groupedOutlinedSecondary: {},
    groupedContained: {
        "&:not(:first-child)": {
            borderLeftWidth: 0,
        },
    },
    groupedContainedHorizontal: {
        "&:not(:last-child)": {
            borderRightColor: palette.grey[200],
            "&$disabled": {
                borderColor: palette.grey[100],
                borderRightColor: palette.grey[200],
            },
        },
    },
    groupedContainedVertical: {},
    groupedContainedPrimary: {
        "&:not(:last-child)": {
            borderColor: palette.primary.main,
            borderRightColor: palette.primary.dark,
            "&$disabled": {
                borderColor: palette.grey[100],
                borderRightColor: palette.grey[200],
            },
        },
    },
    groupedContainedSecondary: {
        "&:not(:last-child)": {
            borderColor: palette.secondary.main,
            borderRightColor: palette.secondary.dark,
            "&$disabled": {
                borderColor: palette.grey[100],
                borderRightColor: palette.grey[200],
            },
        },
    },
});
