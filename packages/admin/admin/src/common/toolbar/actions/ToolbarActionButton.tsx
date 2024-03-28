import { Button, ButtonProps, ComponentsOverrides, IconButton, Tooltip } from "@mui/material";
import { css, Theme, useTheme, useThemeProps } from "@mui/material/styles";
import React from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { useWindowSize } from "../../../helpers/useWindowSize";

export type ToolbarActionButtonClassKey = "root" | "tooltip" | "button" | "iconButton" | "text" | "outlined" | "contained";

type ToolbarActionButtonProps = ButtonProps &
    ThemedComponentBaseProps<{
        tooltip: typeof Tooltip;
        iconButton: typeof IconButton;
        button: typeof Button;
    }>;

type OwnerState = {
    variant: "text" | "outlined" | "contained";
};

const StyledTooltip = createComponentSlot(Tooltip)<ToolbarActionButtonClassKey>({
    componentName: "ToolbarActionButton",
    slotName: "tooltip",
})();

const StyledIconButton = createComponentSlot(IconButton)<ToolbarActionButtonClassKey, OwnerState>({
    componentName: "ToolbarActionButton",
    slotName: "iconButton",
    classesResolver(ownerState) {
        return [ownerState.variant];
    },
})(
    ({ theme, ownerState }) => css`
        ${ownerState.variant === "contained" &&
        css`
            background: ${theme.palette.primary.main};
            color: ${theme.palette.primary.contrastText};
            border-radius: 4px;

            &:hover {
                background: ${theme.palette.primary.dark};
            }
        `}

        ${ownerState.variant === "outlined" &&
        css`
            border-radius: 4px;
            border-width: 1px;
            border-style: solid;
            border-color: ${theme.palette.grey[200]};

            &:hover {
                background-color: ${theme.palette.grey[50]};
                border-color: ${theme.palette.grey[200]};
            }
        `}
    `,
);

const StyledButton = createComponentSlot(Button)<ToolbarActionButtonClassKey>({
    componentName: "ToolbarActionButton",
    slotName: "button",
})();

export const ToolbarActionButton = ({ slotProps = {}, ...inProps }: ToolbarActionButtonProps) => {
    const { children, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarActionButton" });
    const { iconButton: iconButtonProps, tooltip: tooltipProps, button: buttonProps } = slotProps;

    const windowSize = useWindowSize();
    const theme = useTheme();
    const useIconButton: boolean = windowSize.width < theme.breakpoints.values.sm;

    const icon = restProps.startIcon ?? restProps.endIcon;

    return useIconButton && icon ? (
        <StyledTooltip title={children} {...tooltipProps}>
            <StyledIconButton ownerState={{ variant: restProps.variant ?? "text" }} {...iconButtonProps}>
                {icon}
            </StyledIconButton>
        </StyledTooltip>
    ) : (
        <StyledButton {...restProps} {...buttonProps}>
            {children}
        </StyledButton>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarActionButton: ToolbarActionButtonClassKey;
    }

    interface Components {
        CometAdminToolbarActionButton?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarActionButton"];
        };
    }
}
