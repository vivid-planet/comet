import { CheckboxClassKey } from "@material-ui/core/Checkbox";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

// Key "input" is not a stylable class-key on MuiCheckbox
type CorrectedCheckboxClassKey = Exclude<CheckboxClassKey, "input">;

export const getMuiCheckboxOverrides = (palette: Palette): StyleRules<{}, CorrectedCheckboxClassKey> => ({
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
            "& .checkIcon": {
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
            "& .checkIcon": {
                fill: "#fff",
            },
            "& .background": {
                fill: palette.grey[200],
            },
        },
    },
    checked: {},
    disabled: {},
    indeterminate: {},
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
