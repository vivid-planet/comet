import { CheckboxClassKey } from "@material-ui/core/Checkbox";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, greenPalette, neutrals } from "../colors";

// Key "input" is not a stylable class-key on MuiCheckbox
type CorrectedCheckboxClassKey = Exclude<CheckboxClassKey, "input">;

export const getMuiCheckboxOverrides = (): StyleRules<{}, CorrectedCheckboxClassKey> => ({
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
            "& .checkIcon": {
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
            "& .checkIcon": {
                fill: "#fff",
            },
            "& .background": {
                fill: neutrals[200],
            },
        },
    },
    checked: {},
    disabled: {},
    indeterminate: {},
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
