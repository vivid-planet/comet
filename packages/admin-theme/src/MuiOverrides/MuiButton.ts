import { ButtonClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, greenPalette, neutrals } from "../colors";

export const getMuiButtonOverrides = (): StyleRules<{}, ButtonClassKey> => ({
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
        border: `1px solid ${neutrals[200]}`,
        paddingTop: 11,
        paddingRight: 14,
        paddingBottom: 11,
        paddingLeft: 14,
        "&$disabled": {
            backgroundColor: neutrals[100],
            borderColor: neutrals[100],
            color: neutrals[300],
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
        borderColor: bluePalette.main,
        "&:hover": {
            backgroundColor: bluePalette.dark,
            borderColor: bluePalette.dark,
        },
    },
    containedSecondary: {
        color: "#000",
        borderColor: greenPalette.main,
        "&:hover": {
            backgroundColor: greenPalette.dark,
            borderColor: greenPalette.dark,
        },
    },
    disableElevation: {},
    focusVisible: {},
    disabled: {},
    colorInherit: {},
    textSizeSmall: {},
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
