import { ButtonClassKey } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/styles";

import { SaveButtonProps } from "./SaveButton";

export type SaveButtonClassKey = "saving" | "error" | "success" | ButtonClassKey;

export const styles = (theme: Theme) => {
    return createStyles<SaveButtonClassKey, SaveButtonProps>({
        root: {},
        label: {},
        text: {},
        textPrimary: {},
        textSecondary: {},
        outlined: {},
        outlinedPrimary: {},
        outlinedSecondary: {},
        contained: {},
        containedPrimary: {},
        containedSecondary: {},
        disableElevation: {},
        focusVisible: {},
        disabled: {},
        colorInherit: {},
        textSizeSmall: {},
        textSizeLarge: {},
        outlinedSizeSmall: {},
        outlinedSizeLarge: {},
        containedSizeSmall: {},
        containedSizeLarge: {},
        sizeSmall: {},
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
