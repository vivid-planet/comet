import { Check } from "@comet/admin-icons";
import { Button, ButtonClassKey, makeStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { mergeClasses } from "../../../helpers/mergeClasses";

export type CometAdminOkayButtonClassKeys = ButtonClassKey;

export function OkayButton({
    children = <FormattedMessage id="cometAdmin.generic.ok" defaultMessage="OK" />,
    startIcon = <Check />,
    color = "primary",
    variant = "contained",
    classes: passedClasses,
    ...restProps
}: ButtonProps & StyledComponentProps<CometAdminOkayButtonClassKeys>) {
    const classes = mergeClasses<CometAdminOkayButtonClassKeys>(useStyles(), passedClasses);
    return (
        <Button classes={classes} startIcon={startIcon} color={color} variant={variant} {...restProps}>
            {children}
        </Button>
    );
}

export const useStyles = makeStyles<Theme, {}, CometAdminOkayButtonClassKeys>(
    () => ({
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
    }),
    { name: "CometAdminOkayButton" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminOkayButton: CometAdminOkayButtonClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminOkayButton: CometAdminOkayButtonClassKeys;
    }
}
