import { Delete } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
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
        text: {
            color: palette.error.contrastText,
        },
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

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDeleteButton: DeleteButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDeleteButton: DeleteButtonProps;
    }

    interface Components {
        CometAdminDeleteButton?: {
            defaultProps?: ComponentsPropsList["CometAdminDeleteButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDeleteButton"];
        };
    }
}
