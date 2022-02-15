import { ButtonGroupClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiButtonGroupOverrides = (palette: Palette): OverridesStyleRules<ButtonGroupClassKey> => ({
    root: {},
    contained: {
        border: "none",
    },
    outlined: {},
    text: {},
    disableElevation: {},
    disabled: {},
    fullWidth: {},
    vertical: {},
    grouped: {},
    groupedHorizontal: {},
    groupedVertical: {},
    groupedText: {},
    groupedTextHorizontal: {},
    groupedTextVertical: {},
    groupedTextPrimary: {},
    groupedTextSecondary: {},
    groupedOutlined: {},
    groupedOutlinedHorizontal: {},
    groupedOutlinedVertical: {},
    groupedOutlinedPrimary: {},
    groupedOutlinedSecondary: {},
    groupedContained: {
        "&:not(:first-child)": {
            borderLeftWidth: 0,
        },
    },
    groupedContainedHorizontal: {
        "&:not(:last-child)": {
            borderRightColor: palette.grey[200],
            "&$disabled": {
                borderColor: palette.grey[100],
                borderRightColor: palette.grey[200],
            },
        },
    },
    groupedContainedVertical: {},
    groupedContainedPrimary: {
        "&:not(:last-child)": {
            borderColor: palette.primary.main,
            borderRightColor: palette.primary.dark,
            "&$disabled": {
                borderColor: palette.grey[100],
                borderRightColor: palette.grey[200],
            },
        },
    },
    groupedContainedSecondary: {
        "&:not(:last-child)": {
            borderColor: palette.secondary.main,
            borderRightColor: palette.secondary.dark,
            "&$disabled": {
                borderColor: palette.grey[100],
                borderRightColor: palette.grey[200],
            },
        },
    },
});
