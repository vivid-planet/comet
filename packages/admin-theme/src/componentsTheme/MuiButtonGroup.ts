import { buttonGroupClasses } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiButtonGroup = (palette: Palette): Components["MuiButtonGroup"] => ({
    defaultProps: {
        disableElevation: true,
    },
    styleOverrides: {
        contained: {
            border: "none",
        },
        groupedContained: {
            "&:not(:first-child)": {
                borderLeftWidth: 0,
            },
        },
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
        // @ts-ignore - TODO: fix this
        groupedContainedInfo: {
            "&:not(:last-child)": {
                borderColor: palette.grey[200],

                [`&.${buttonGroupClasses.disabled}`]: {
                    borderColor: palette.grey[100],
                    borderRightColor: palette.grey[200],
                },
            },
        },
    },
});
