import { ButtonGroupClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, greenPalette, neutrals } from "../colors";

export const getMuiButtonGroupOverrides = (): StyleRules<{}, ButtonGroupClassKey> => ({
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
            borderRightColor: neutrals[200],
            "&$disabled": {
                borderColor: neutrals[100],
                borderRightColor: neutrals[200],
            },
        },
    },
    groupedContainedVertical: {},
    groupedContainedPrimary: {
        "&:not(:last-child)": {
            borderColor: bluePalette.main,
            borderRightColor: bluePalette.dark,
            "&$disabled": {
                borderColor: neutrals[100],
                borderRightColor: neutrals[200],
            },
        },
    },
    groupedContainedSecondary: {
        "&:not(:last-child)": {
            borderColor: greenPalette.main,
            borderRightColor: greenPalette.dark,
            "&$disabled": {
                borderColor: neutrals[100],
                borderRightColor: neutrals[200],
            },
        },
    },
});
