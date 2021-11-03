import { ButtonClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiButtonOverrides = (palette: Palette): StyleRules<{}, ButtonClassKey> => ({
    root: {},
    label: {
        position: "relative",
        top: 1,
        fontSize: 16,
        lineHeight: 1,
    },
    text: {
        textTransform: "none",
        paddingTop: 12,
        paddingRight: 15,
        paddingBottom: 12,
        paddingLeft: 15,
        "& $startIcon": {
            marginRight: 5,
        },
        "& $endIcon": {
            marginLeft: 5,
        },
    },
    textPrimary: {},
    textSecondary: {},
    outlined: {},
    outlinedPrimary: {},
    outlinedSecondary: {},
    contained: {
        color: "#000",
        backgroundColor: "#fff",
        border: `1px solid ${palette.grey[200]}`,
        paddingTop: 11,
        paddingRight: 14,
        paddingBottom: 11,
        paddingLeft: 14,
        "&$disabled": {
            backgroundColor: palette.grey[100],
            borderColor: palette.grey[100],
            color: palette.grey[300],
        },
        "&$startIcon": {
            marginRight: 6,
        },
        "&$endIcon": {
            marginLeft: 6,
        },
    },
    containedPrimary: {
        color: "#000",
        borderColor: palette.primary.main,
        "&:hover": {
            backgroundColor: palette.primary.dark,
            borderColor: palette.primary.dark,
        },
    },
    containedSecondary: {
        color: "#000",
        borderColor: palette.secondary.main,
        "&:hover": {
            backgroundColor: palette.secondary.dark,
            borderColor: palette.secondary.dark,
        },
    },
    disableElevation: {},
    focusVisible: {},
    disabled: {},
    colorInherit: {},
    textSizeSmall: {
        "& $label": {
            fontSize: 14,
            lineHeight: "20px",
        },
    },
    textSizeLarge: {},
    outlinedSizeSmall: {},
    outlinedSizeLarge: {},
    containedSizeSmall: {},
    containedSizeLarge: {},
    sizeSmall: {},
    sizeLarge: {},
    fullWidth: {},
    startIcon: {
        marginLeft: 0,
        position: "relative",
        top: -1,
        "&$iconSizeMedium > *:first-child": {
            fontSize: 16,
        },
    },
    endIcon: {
        marginRight: 0,
        position: "relative",
        top: -1,
        "&$iconSizeMedium > *:first-child": {
            fontSize: 16,
        },
    },
    iconSizeSmall: {},
    iconSizeMedium: {},
    iconSizeLarge: {},
});
