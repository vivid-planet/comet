import { ArrowBack } from "@mui/icons-material";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";
import { StackApiContext } from "../Api";

export type StackBackButtonClassKey = ButtonClassKey;
export type StackBackButtonProps = ButtonProps;

const Root = styled(Button, {
    name: "CometAdminStackBackButton",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css``);

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
        CometAdminStackBackButton: Partial<StackBackButtonProps>;
    }

    interface Components {
        CometAdminStackBackButton?: {
            defaultProps?: ComponentsPropsList["CometAdminStackBackButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminStackBackButton"];
        };
    }
}
