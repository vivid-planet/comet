import { RadioChecked, RadioUnchecked } from "@comet/admin-icons";
import { radioClasses, svgIconClasses } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";
import * as React from "react";

export const getMuiRadio = (palette: Palette): Components["MuiRadio"] => ({
    defaultProps: {
        color: "primary",
        icon: <RadioUnchecked />,
        checkedIcon: <RadioChecked />,
    },
    styleOverrides: {
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
    },
});
