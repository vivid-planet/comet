import { ButtonClassKey } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

import { SaveButtonProps } from "./SaveButton";

export type SaveButtonClassKey = "saving" | "error" | "success" | ButtonClassKey;

export const styles = (theme: Theme) => {
    return createStyles<SaveButtonClassKey, SaveButtonProps>({
        root: {},
        text: {},
        textInherit: {},
        textPrimary: {},
        textSecondary: {},
        outlined: {},
        outlinedInherit: {},
        outlinedPrimary: {},
        outlinedSecondary: {},
        contained: {},
        containedInherit: {},
        containedPrimary: {},
        containedSecondary: {},
        disableElevation: {},
        focusVisible: {},
        disabled: {},
        colorInherit: {},
        textSizeSmall: {},
        textSizeMedium: {},
        textSizeLarge: {},
        outlinedSizeSmall: {},
        outlinedSizeMedium: {},
        outlinedSizeLarge: {},
        containedSizeSmall: {},
        containedSizeMedium: {},
        containedSizeLarge: {},
        sizeSmall: {},
        sizeMedium: {},
        sizeLarge: {},
        fullWidth: {},
        startIcon: {},
        endIcon: {},
        iconSizeSmall: {},
        iconSizeMedium: {},
        iconSizeLarge: {},
        saving: {
            "&$disabled$containedPrimary": {
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.primary.main,
            },
            "&$disabled$containedSecondary": {
                color: theme.palette.secondary.contrastText,
                backgroundColor: theme.palette.secondary.main,
            },
        },
        error: {
            "&$disabled": {
                color: theme.palette.error.contrastText,
                backgroundColor: theme.palette.error.light,
            },
        },
        success: {
            "&$disabled": {
                color: theme.palette.success.contrastText,
                backgroundColor: theme.palette.success.light,
            },
        },
    });
};
