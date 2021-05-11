import { RadioClassKey } from "@material-ui/core/Radio";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, greenPalette, neutrals } from "../colors";

export const getMuiRadioOverrides = (): StyleRules<{}, RadioClassKey> => ({
    root: {
        "& [class*='MuiSvgIcon-root']": {
            "& .border": {
                fill: "#fff",
            },
            "& .background": {
                fill: neutrals[100],
            },
        },
        "&$checked [class*='MuiSvgIcon-root']": {
            "& .circle": {
                fill: "#fff",
            },
        },
        "&$disabled [class*='MuiSvgIcon-root']": {
            "& .border": {
                fill: neutrals[50],
            },
            "& .background": {
                fill: neutrals[100],
            },
        },
        "&$disabled$checked [class*='MuiSvgIcon-root']": {
            "& .circle": {
                fill: "#fff",
            },
            "& .background": {
                fill: neutrals[200],
            },
        },
    },
    checked: {},
    disabled: {},
    input: {},
    colorPrimary: {
        "&$checked [class*='MuiSvgIcon-root']": {
            "& .background": {
                fill: bluePalette.main,
            },
        },
    },
    colorSecondary: {
        "&$checked [class*='MuiSvgIcon-root']": {
            "& .background": {
                fill: greenPalette.main,
            },
        },
    },
});
