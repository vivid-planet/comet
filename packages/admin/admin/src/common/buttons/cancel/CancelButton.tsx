import { Clear } from "@comet/admin-icons";
import { Button, ButtonClassKey, css } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { styled, Theme, useThemeProps } from "@mui/material/styles";
import { ComponentsOverrides } from "@mui/material/styles/overrides";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";

export type CancelButtonProps = ButtonProps;
export type CancelButtonClassKey = ButtonClassKey;

const Root = styled(Button, {
    name: "CometAdminCancelButton",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css``);

export function CancelButton(inProps: CancelButtonProps) {
    const {
        children = <FormattedMessage {...messages.cancel} />,
        startIcon = <Clear />,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminCancelButton" });

    return (
        <Root color="info" startIcon={startIcon} {...restProps}>
            {children}
        </Root>
    );
}

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
