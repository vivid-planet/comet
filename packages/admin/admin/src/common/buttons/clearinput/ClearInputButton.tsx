import { Clear } from "@comet/admin-icons";
import { ButtonBase, ButtonBaseProps, ComponentsOverrides, inputAdornmentClasses } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";

export type ClearInputButtonClassKey = "root" | "focusVisible";

const Root = createComponentSlot(ButtonBase)<ClearInputButtonClassKey>({
    componentName: "ClearInputButton",
    slotName: "root",
})(
    ({ theme }) => css`
        height: 100%;
        width: 40px;
        color: ${theme.palette.action.active};

        ${`.${inputAdornmentClasses.positionEnd}`}:last-child & {
            margin-right: ${theme.spacing(-2)};
        }

        ${`.${inputAdornmentClasses.positionStart}`}:first-child & {
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
        CometAdminClearInputButton: ClearInputButtonProps;
    }

    interface Components {
        CometAdminClearInputButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminClearInputButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminClearInputButton"];
        };
    }
}
