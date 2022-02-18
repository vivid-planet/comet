import { checkboxClasses, CheckboxClassKey, svgIconClasses } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiCheckboxOverrides = (palette: Palette): OverridesStyleRules<CheckboxClassKey> => ({
    root: {
        [`& .${svgIconClasses.root}`]: {
            "& .border": {
                fill: "#fff",
            },
            "& .background": {
                fill: palette.grey[100],
            },
        },
        [`&.${checkboxClasses.checked} .${svgIconClasses.root}`]: {
            "& .checkIcon": {
                fill: "#fff",
            },
        },
        [`&.${checkboxClasses.disabled} .${svgIconClasses.root}`]: {
            "& .border": {
                fill: palette.grey[50],
            },
            "& .background": {
                fill: palette.grey[100],
            },
        },
        [`&.${checkboxClasses.disabled}.${checkboxClasses.checked} .${svgIconClasses.root}`]: {
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
        [`&.${checkboxClasses.checked} .${svgIconClasses.root}`]: {
            "& .background": {
                fill: palette.primary.main,
            },
        },
    },
    colorSecondary: {
        [`&.${checkboxClasses.checked} .${svgIconClasses.root}`]: {
            "& .background": {
                fill: palette.secondary.main,
            },
        },
    },
});
