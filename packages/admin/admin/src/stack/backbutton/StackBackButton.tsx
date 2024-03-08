import { ArrowBack } from "@mui/icons-material";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides } from "@mui/material";
import { Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { createSlot } from "../../helpers/createSlot";
import { messages } from "../../messages";
import { StackApiContext } from "../Api";

export type StackBackButtonClassKey = ButtonClassKey;
export type StackBackButtonProps = ButtonProps;

const Root = createSlot(Button)<StackBackButtonClassKey>({
    componentName: "StackBackButton",
    slotName: "root",
})();

export function StackBackButton(inProps: StackBackButtonProps) {
    const { startIcon = <ArrowBack />, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminStackBackButton" });

    return (
        <StackApiContext.Consumer>
            {(stackApi) => {
                return (
                    <Root
                        disabled={stackApi?.breadCrumbs == null || stackApi?.breadCrumbs.length <= 1}
                        onClick={stackApi?.goBack}
                        startIcon={startIcon}
                        {...restProps}
                    >
                        <FormattedMessage {...messages.back} />
                    </Root>
                );
            }}
        </StackApiContext.Consumer>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminStackBackButton: StackBackButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminStackBackButton: StackBackButtonProps;
    }

    interface Components {
        CometAdminStackBackButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminStackBackButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminStackBackButton"];
        };
    }
}
