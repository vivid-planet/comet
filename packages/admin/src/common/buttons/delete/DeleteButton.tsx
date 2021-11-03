import { Delete } from "@comet/admin-icons";
import { Button, ButtonClassKey, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Theme } from "@material-ui/core/styles";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export type DeleteButtonClassKey = ButtonClassKey;
export type DeleteButtonProps = ButtonProps;

const styles = ({ palette }: Theme) => {
    return createStyles<DeleteButtonClassKey, DeleteButtonProps>({
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
    });
};

function DeleteBtn({
    children = <FormattedMessage id="cometAdmin.generic.delete" defaultMessage="Delete" />,
    startIcon = <Delete />,
    ...restProps
}: ButtonProps & WithStyles<typeof styles>) {
    return (
        <Button startIcon={startIcon} {...restProps}>
            {children}
        </Button>
    );
}

export const DeleteButton = withStyles(styles, { name: "CometAdminDeleteButton" })(DeleteBtn);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminDeleteButton: DeleteButtonClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminDeleteButton: DeleteButtonProps;
    }
}
