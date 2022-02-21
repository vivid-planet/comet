import { CheckboxChecked, CheckboxUnchecked } from "@comet/admin-icons";
import { checkboxClasses, svgIconClasses } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";
import * as React from "react";

export const getMuiCheckbox = (palette: Palette): Components["MuiCheckbox"] => ({
    defaultProps: {
        color: "primary",
        icon: <CheckboxUnchecked />,
        checkedIcon: <CheckboxChecked />,
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
    },
});
