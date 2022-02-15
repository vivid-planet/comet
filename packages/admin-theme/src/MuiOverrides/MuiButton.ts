import { ButtonClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiButtonOverrides = (palette: Palette): OverridesStyleRules<ButtonClassKey> => ({
    root: {},
    // label: { // TODO: Find out where to move these styles
    //     position: "relative",
    //     top: 1,
    //     fontSize: 16,
    //     lineHeight: 1,
    // },
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
    textInherit: {},
    textPrimary: {},
    textSecondary: {},
    outlined: {},
    outlinedInherit: {},
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
    containedInherit: {},
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
    textSizeMedium: {},
    textSizeLarge: {},
    outlinedSizeSmall: {},
    outlinedSizeMedium: {},
    outlinedSizeLarge: {},
    containedSizeSmall: {},
    containedSizeMedium: {},
    containedSizeLarge: {},
    sizeSmall: {},
    sizeMedium: {},
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
