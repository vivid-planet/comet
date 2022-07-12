import { buttonClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiButton: GetMuiComponentTheme<"MuiButton"> = (component, { palette, typography }) => ({
    ...component,
    defaultProps: {
        disableElevation: true,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiButton">(component?.styleOverrides, {
        root: {
            position: "relative",
            top: 1,
            fontSize: 16,
            lineHeight: 1,

            [`&.${buttonClasses.textSizeSmall}`]: {
                fontSize: 14,
                lineHeight: "20px",
            },
        },
        text: ({ ownerState }) => ({
            fontWeight: typography.fontWeightRegular,
            textTransform: "none",
            paddingTop: 12,
            paddingRight: 15,
            paddingBottom: 12,
            paddingLeft: 15,

            [`& .${buttonClasses.startIcon}`]: {
                marginRight: 5,
            },

            [`& .${buttonClasses.endIcon}`]: {
                marginLeft: 5,
            },

            ...(ownerState.color === "info" && {
                color: palette.grey[900],

                ":hover": {
                    backgroundColor: palette.grey[50],
                },
            }),
        }),
        contained: {
            color: "#000",
            paddingTop: 12,
            paddingRight: 14,
            paddingBottom: 12,
            paddingLeft: 14,

            [`&.${buttonClasses.disabled}`]: {
                backgroundColor: palette.grey[100],
                color: palette.grey[300],
            },
        },
        containedPrimary: {
            color: "#000",
            borderColor: palette.primary.main,

            "&:hover": {
                backgroundColor: palette.primary.dark,
                borderColor: palette.primary.dark,
            },
        },
        containedSecondary: {
            color: "#000",
            borderColor: palette.secondary.main,

            "&:hover": {
                backgroundColor: palette.secondary.dark,
                borderColor: palette.secondary.dark,
            },
        },
        containedError: {
            color: "#fff",
        },
        outlined: {
            color: palette.grey[900],
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: palette.grey[200],
            paddingTop: 11,
            paddingRight: 14,
            paddingBottom: 11,
            paddingLeft: 14,

            ":hover": {
                backgroundColor: palette.grey[50],
                borderColor: palette.grey[200],
            },
        },
        startIcon: {
            marginLeft: 0,
            position: "relative",
            top: -1,

            [`&.${buttonClasses.iconSizeMedium} > *:first-child`]: {
                fontSize: 16,
            },
        },
        endIcon: {
            marginRight: 0,
            position: "relative",
            top: -1,

            [`&.${buttonClasses.iconSizeMedium} > *:first-child`]: {
                fontSize: 16,
            },
        },
    }),
});
