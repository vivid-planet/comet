import { RadioClassKey } from "@material-ui/core/Radio";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

type CorrectedRadioClassKey = Exclude<RadioClassKey, "input">;

export const getMuiRadioOverrides = (palette: Palette): StyleRules<Record<string, unknown>, CorrectedRadioClassKey> => ({
    root: {
        "& [class*='MuiSvgIcon-root']": {
            "& .border": {
                fill: "#fff",
            },
            "& .background": {
                fill: palette.grey[100],
            },
        },
        "&$checked [class*='MuiSvgIcon-root']": {
            "& .circle": {
                fill: "#fff",
            },
        },
        "&$disabled [class*='MuiSvgIcon-root']": {
            "& .border": {
                fill: palette.grey[50],
            },
            "& .background": {
                fill: palette.grey[100],
            },
        },
        "&$disabled$checked [class*='MuiSvgIcon-root']": {
            "& .circle": {
                fill: "#fff",
            },
            "& .background": {
                fill: palette.grey[200],
            },
        },
    },
    checked: {},
    disabled: {},
    colorPrimary: {
        "&$checked [class*='MuiSvgIcon-root']": {
            "& .background": {
                fill: palette.primary.main,
            },
        },
    },
    colorSecondary: {
        "&$checked [class*='MuiSvgIcon-root']": {
            "& .background": {
                fill: palette.secondary.main,
            },
        },
    },
});
