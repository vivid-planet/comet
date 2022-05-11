import { buttonGroupClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiButtonGroup: GetMuiComponentTheme<"MuiButtonGroup"> = (styleOverrides, { palette }) => ({
    defaultProps: {
        disableElevation: true,
    },
    styleOverrides: mergeOverrideStyles<"MuiButtonGroup">(styleOverrides, {
        contained: {
            border: "none",
        },
        groupedContained: ({ ownerState }) => ({
            "&:not(:first-child)": {
                borderLeftWidth: 0,
            },

            ...(ownerState.color === "info" && {
                "&:not(:last-child)": {
                    borderColor: palette.grey[200],

                    [`&.${buttonGroupClasses.disabled}`]: {
                        borderColor: palette.grey[100],
                        borderRightColor: palette.grey[200],
                    },
                },
            }),
        }),
        groupedContainedHorizontal: {
            "&:not(:last-child)": {
                borderRightColor: palette.grey[200],

                [`&.${buttonGroupClasses.disabled}`]: {
                    borderColor: palette.grey[100],
                    borderRightColor: palette.grey[200],
                },
            },
        },
        groupedContainedPrimary: {
            "&:not(:last-child)": {
                borderColor: palette.primary.main,
                borderRightColor: palette.primary.dark,

                [`&.${buttonGroupClasses.disabled}`]: {
                    borderColor: palette.grey[100],
                    borderRightColor: palette.grey[200],
                },
            },
        },
        groupedContainedSecondary: {
            "&:not(:last-child)": {
                borderColor: palette.secondary.main,
                borderRightColor: palette.secondary.dark,

                [`&.${buttonGroupClasses.disabled}`]: {
                    borderColor: palette.grey[100],
                    borderRightColor: palette.grey[200],
                },
            },
        },
    }),
});
