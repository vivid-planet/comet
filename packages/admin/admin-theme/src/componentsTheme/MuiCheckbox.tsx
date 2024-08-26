import { CheckboxChecked, CheckboxUnchecked } from "@comet/admin-icons";
import { checkboxClasses, svgIconClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiCheckbox: GetMuiComponentTheme<"MuiCheckbox"> = (component, { palette }) => ({
    ...component,
    defaultProps: {
        color: "primary",
        icon: <CheckboxUnchecked />,
        checkedIcon: <CheckboxChecked />,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiCheckbox">(component?.styleOverrides, {
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
    }),
});
