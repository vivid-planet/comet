import { radioClasses, svgIconClasses } from "@mui/material";
import { RadioClassKey } from "@mui/material/Radio";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

type CorrectedRadioClassKey = Exclude<RadioClassKey, "input">;

export const getMuiRadioOverrides = (palette: Palette): OverridesStyleRules<CorrectedRadioClassKey> => ({
    root: {
        [`& .${svgIconClasses.root}`]: {
            "& .border": {
                fill: "#fff",
            },
            "& .background": {
                fill: palette.grey[100],
            },
        },
        [`&.${radioClasses.checked} .${svgIconClasses.root}`]: {
            "& .circle": {
                fill: "#fff",
            },
        },
        [`&.${radioClasses.disabled} .${svgIconClasses.root}`]: {
            "& .border": {
                fill: palette.grey[50],
            },
            "& .background": {
                fill: palette.grey[100],
            },
        },
        [`&.${radioClasses.disabled}.${radioClasses.checked} .${svgIconClasses.root}`]: {
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
        [`&.${radioClasses.checked} .${svgIconClasses.root}`]: {
            "& .background": {
                fill: palette.primary.main,
            },
        },
    },
    colorSecondary: {
        [`&.${radioClasses.checked} .${svgIconClasses.root}`]: {
            "& .background": {
                fill: palette.secondary.main,
            },
        },
    },
});
