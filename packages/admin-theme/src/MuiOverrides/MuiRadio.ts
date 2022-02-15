import { RadioClassKey } from "@mui/material/Radio";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

type CorrectedRadioClassKey = Exclude<RadioClassKey, "input">;

export const getMuiRadioOverrides = (palette: Palette): OverridesStyleRules<CorrectedRadioClassKey> => ({
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
