import { Delete } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";

export type DeleteButtonClassKey = ButtonClassKey;
export type DeleteButtonProps = ButtonProps;

const Root = styled(Button, {
    name: "CometAdminDeleteButton",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    ({ theme }) => css`
        background-color: ${theme.palette.error.main};
        color: ${theme.palette.error.contrastText};
        &:hover {
            background-color: ${theme.palette.error.dark};
        }
    `,
);

export function DeleteButton(inProps: DeleteButtonProps) {
    const {
        children = <FormattedMessage {...messages.delete} />,
        startIcon = <Delete />,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminDeleteButton" });

    return (
        <Root startIcon={startIcon} {...restProps}>
            {children}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDeleteButton: DeleteButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDeleteButton: DeleteButtonProps;
    }

    interface Components {
        CometAdminDeleteButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDeleteButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDeleteButton"];
        };
    }
}
