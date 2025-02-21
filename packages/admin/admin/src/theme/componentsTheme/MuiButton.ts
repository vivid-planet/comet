import { buttonClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiButton: GetMuiComponentTheme<"MuiButton"> = (component, { palette, typography }) => ({
    ...component,
    defaultProps: {
        disableElevation: true,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiButton">(component?.styleOverrides, {
        root: {
            position: "relative",
            fontSize: 16,
            lineHeight: "16px",
            letterSpacing: 0,
            textTransform: "none",
            fontWeight: 250,

            [`&.${buttonClasses.textSizeSmall}`]: {
                fontSize: 14,
                lineHeight: "20px",
            },
        },
        text: ({ ownerState }) => ({
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
            paddingTop: 12,
            paddingRight: 14,
            paddingBottom: 12,
            paddingLeft: 14,
            borderRadius: 4,

            [`&.${buttonClasses.disabled}`]: {
                backgroundColor: palette.grey[100],
                color: palette.grey[300],
            },
        },
        containedPrimary: {
            color: palette.primary.contrastText,
            borderColor: palette.primary.main,

            "&:hover": {
                backgroundColor: palette.primary.dark,
                borderColor: palette.primary.dark,
            },
        },
        containedSecondary: {
            color: palette.secondary.contrastText,
            borderColor: palette.secondary.main,

            "&:hover": {
                backgroundColor: palette.secondary.dark,
                borderColor: palette.secondary.dark,
            },
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
            borderRadius: 4,

            ":hover": {
                backgroundColor: palette.grey[50],
                borderColor: palette.grey[200],
            },
        },
        outlinedError: {
            color: palette.error.main,
            borderColor: palette.error.main,
        },
        startIcon: {
            marginLeft: 0,

            [`&.${buttonClasses.iconSizeMedium} > *:first-of-type`]: {
                fontSize: 16,
            },
        },
        endIcon: {
            marginRight: 0,

            [`&.${buttonClasses.iconSizeMedium} > *:first-of-type`]: {
                fontSize: 16,
            },
        },
    }),
});
