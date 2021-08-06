import { Delete } from "@comet/admin-icons";
import { Button, ButtonClassKey, makeStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { mergeClasses } from "../../../helpers/mergeClasses";

export type CometAdminDeleteButtonClassKeys = ButtonClassKey;

export function DeleteButton({
    children = <FormattedMessage id="cometAdmin.generic.delete" defaultMessage="Delete" />,
    startIcon = <Delete />,
    classes: passedClasses,
    ...restProps
}: ButtonProps & StyledComponentProps<CometAdminDeleteButtonClassKeys>) {
    const classes = mergeClasses<CometAdminDeleteButtonClassKeys>(useStyles(), passedClasses);
    return (
        <Button classes={classes} startIcon={startIcon} {...restProps}>
            {children}
        </Button>
    );
}

export const useStyles = makeStyles<Theme, {}, CometAdminDeleteButtonClassKeys>(
    ({ palette }) => ({
        root: {
            backgroundColor: palette.error.main,
            "&:hover": {
                backgroundColor: palette.error.dark,
            },
        },
        label: {},
        text: {
            color: palette.error.contrastText,
        },
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
    { name: "CometAdminDeleteButton" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminDeleteButton: CometAdminDeleteButtonClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminDeleteButton: CometAdminDeleteButtonClassKeys;
    }
}
