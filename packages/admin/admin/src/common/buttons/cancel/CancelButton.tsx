import { Clear } from "@comet/admin-icons";
import { Button, ButtonClassKey, Theme } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { ComponentsOverrides } from "@mui/material/styles/overrides";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";

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

function CancelBtn({
    children = <FormattedMessage {...messages.cancel} />,
    startIcon = <Clear />,
    ...restProps
}: CancelButtonProps & WithStyles<typeof styles>) {
    return (
        <Button color="info" startIcon={startIcon} {...restProps}>
            {children}
        </Button>
    );
}

export const CancelButton = withStyles(styles, { name: "CometAdminCancelButton" })(CancelBtn);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminCancelButton: CancelButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminCancelButton: Partial<CancelButtonProps>;
    }

    interface Components {
        CometAdminCancelButton?: {
            defaultProps?: ComponentsPropsList["CometAdminCancelButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminCancelButton"];
        };
    }
}
