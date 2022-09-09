import { Check } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";

export type OkayButtonClassKey = ButtonClassKey;
export type OkayButtonProps = ButtonProps;

const styles = () => {
    return createStyles<OkayButtonClassKey, OkayButtonProps>({
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
        textError: {},
        textInfo: {},
        textSuccess: {},
        textWarning: {},
        outlinedError: {},
        outlinedInfo: {},
        outlinedSuccess: {},
        outlinedWarning: {},
        containedError: {},
        containedInfo: {},
        containedSuccess: {},
        containedWarning: {},
    });
};

function OkayBtn({
    children = <FormattedMessage {...messages.ok} />,
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

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminOkayButton: OkayButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminOkayButton: OkayButtonProps;
    }

    interface Components {
        CometAdminOkayButton?: {
            defaultProps?: ComponentsPropsList["CometAdminOkayButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminOkayButton"];
        };
    }
}
