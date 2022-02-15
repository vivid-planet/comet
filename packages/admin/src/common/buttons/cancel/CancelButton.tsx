import { Clear } from "@comet/admin-icons";
import { Button, ButtonClassKey } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export type CancelButtonProps = ButtonProps;
export type CancelButtonClassKey = ButtonClassKey;

const styles = () => {
    return createStyles<CancelButtonClassKey, CancelButtonProps>({
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

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminCancelButton: CancelButtonClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminCancelButton: CancelButtonProps;
    }
}
