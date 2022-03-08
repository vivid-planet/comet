import { Check } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export type OkayButtonClassKey = ButtonClassKey;
export type OkayButtonProps = ButtonProps;

const styles = () => {
    return createStyles<OkayButtonClassKey, OkayButtonProps>({
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

function OkayBtn({
    children = <FormattedMessage id="cometAdmin.generic.ok" defaultMessage="OK" />,
    startIcon = <Check />,
    color = "primary",
    variant = "contained",
    ...restProps
}: OkayButtonProps & WithStyles<typeof styles>) {
    return (
        <Button startIcon={startIcon} color={color} variant={variant} {...restProps}>
            {children}
        </Button>
    );
}

export const OkayButton = withStyles(styles, { name: "CometAdminOkayButton" })(OkayBtn);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminOkayButton: OkayButtonClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminOkayButton: OkayButtonProps;
    }
}
