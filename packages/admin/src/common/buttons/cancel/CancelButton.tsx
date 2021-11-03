import { Clear } from "@comet/admin-icons";
import { Button, ButtonClassKey, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export type CancelButtonProps = ButtonProps;
export type CancelButtonClassKey = ButtonClassKey;

const styles = () => {
    return createStyles<CancelButtonClassKey, CancelButtonProps>({
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

function CancelBtn({
    children = <FormattedMessage id="cometAdmin.generic.cancel" defaultMessage="Cancel" />,
    startIcon = <Clear />,
    ...restProps
}: CancelButtonProps & WithStyles<typeof styles>) {
    return (
        <Button startIcon={startIcon} {...restProps}>
            {children}
        </Button>
    );
}

export const CancelButton = withStyles(styles, { name: "CometAdminCancelButton" })(CancelBtn);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminCancelButton: CancelButtonClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminCancelButton: CancelButtonProps;
    }
}
