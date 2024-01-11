import { Clear } from "@comet/admin-icons";
import { ButtonBase, ButtonBaseProps, ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

export type ClearInputButtonClassKey = "root" | "focusVisible";

const Root = styled(ButtonBase, {
    name: "CometAdminClearInputButton",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    ({ theme }) => css`
        height: 100%;
        width: 40px;
        color: ${theme.palette.action.active};

        &:last-child {
            margin-right: ${theme.spacing(-2)};
        }

        &:first-child {
            margin-left: ${theme.spacing(-2)};
        }

        &:disabled {
            color: ${theme.palette.action.disabled};
        }
    `,
);

export interface ClearInputButtonProps extends ButtonBaseProps {
    icon?: React.ReactNode;
}

export function ClearInputButton(inProps: ClearInputButtonProps) {
    const { icon = <Clear />, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminClearInputButton",
    });
    return (
        <Root tabIndex={-1} {...restProps}>
            {icon}
        </Root>
    );
}

/**
 * @deprecated Use `ClearInputAdornment` directly as the InputAdornment instead
 */

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminClearInputButton: ClearInputButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminClearInputButton: Partial<ClearInputButtonProps>;
    }

    interface Components {
        CometAdminClearInputButton?: {
            defaultProps?: ComponentsPropsList["CometAdminClearInputButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminClearInputButton"];
        };
    }
}
