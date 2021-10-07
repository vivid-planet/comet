import { ButtonClassKey } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import { StackBackButtonProps } from "./StackBackButton";

export type StackBackButtonClassKey = ButtonClassKey;

export const styles = () => {
    return createStyles<StackBackButtonClassKey, StackBackButtonProps>({
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
    });
};
