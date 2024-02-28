import { Check } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides, css } from "@mui/material";
import { styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";

export type OkayButtonClassKey = ButtonClassKey;
export type OkayButtonProps = ButtonProps;

const Root = styled(Button, {
    name: "CometAdminOkayButton",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css``);

export function OkayButton(inProps: OkayButtonProps) {
    const {
        children = <FormattedMessage {...messages.ok} />,
        startIcon = <Check />,
        color = "primary",
        variant = "contained",
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminOkayButton" });

    return (
        <Root startIcon={startIcon} color={color} variant={variant} {...restProps}>
            {children}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminOkayButton: OkayButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminOkayButton: Partial<OkayButtonProps>;
    }

    interface Components {
        CometAdminOkayButton?: {
            defaultProps?: ComponentsPropsList["CometAdminOkayButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminOkayButton"];
        };
    }
}
