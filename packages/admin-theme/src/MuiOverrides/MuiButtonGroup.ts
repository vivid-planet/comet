import { buttonGroupClasses } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiButtonGroupOverrides = (palette: Palette): OverridesStyleRules => ({
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
    groupedContainedInfo: {
        "&:not(:last-child)": {
            borderColor: palette.grey[200],

            [`&.${buttonGroupClasses.disabled}`]: {
                borderColor: palette.grey[100],
                borderRightColor: palette.grey[200],
            },
        },
    },
});
