import { Clear } from "@comet/admin-icons";
import { Button, ButtonClassKey, makeStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { mergeClasses } from "../../../helpers/mergeClasses";

export type CometAdminCancelButtonClassKeys = ButtonClassKey;

export function CancelButton({
    children = <FormattedMessage id="cometAdmin.generic.cancel" defaultMessage="Cancel" />,
    startIcon = <Clear />,
    classes: passedClasses,
    ...restProps
}: ButtonProps & StyledComponentProps<CometAdminCancelButtonClassKeys>) {
    const classes = mergeClasses<CometAdminCancelButtonClassKeys>(useStyles(), passedClasses);
    return (
        <Button classes={classes} startIcon={startIcon} {...restProps}>
            {children}
        </Button>
    );
}

export const useStyles = makeStyles<Theme, {}, CometAdminCancelButtonClassKeys>(
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
    { name: "CometAdminCancelButton" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminCancelButton: CometAdminCancelButtonClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminCancelButton: CometAdminCancelButtonClassKeys;
    }
}
