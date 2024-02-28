import { ThemedComponentBaseProps } from "@comet/admin";
import { ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { SvgIconProps } from "@mui/material/SvgIcon";
import * as React from "react";

import getRteTheme from "../utils/getRteTheme";

export type RteControlButtonClassKey = "root" | "selected" | "renderAsIcon";

type OwnerState = Pick<IProps, "selected" | "Icon">;

const Root = styled("button", {
    name: "CometAdminRteControlButton",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.root, ownerState.selected && styles.selected, Boolean(ownerState.Icon) && styles.renderAsIcon];
    },
})<{ ownerState: OwnerState }>(({ ownerState, theme }) => {
    const rteTheme = getRteTheme(theme.components?.CometAdminRte?.defaultProps);
    return css`
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        height: 24px;
        background-color: transparent;
        border: 1px solid transparent;
        box-sizing: border-box;
        transition: background-color 200ms, border-color 200ms, color 200ms;
        font-size: 20px;
        color: ${rteTheme.colors?.buttonIcon};

        &:hover {
            background-color: ${rteTheme.colors?.buttonBackgroundHover};
            border-color: ${rteTheme.colors?.buttonBorderHover};
        }

        &:disabled {
            cursor: not-allowed;

            &,
            &:hover {
                background-color: transparent;
                border-color: transparent;
                color: ${rteTheme.colors?.buttonIconDisabled};
            }
        }

        ${ownerState.selected &&
        css`
            &:not(:disabled),
            &:not(:disabled):hover {
                border-color: ${rteTheme.colors?.buttonBorderHover};
                background-color: white;
            }
        `}

        ${Boolean(ownerState.Icon) &&
        css`
            width: 24px;
        `}
    `;
});

export interface IProps
    extends ThemedComponentBaseProps<{
        root: "button";
    }> {
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: React.MouseEvent) => void;
    icon?: (props: SvgIconProps) => JSX.Element | null;
    children?: React.ReactNode;

    /** @deprecated use icon instead */
    Icon?: (props: SvgIconProps) => JSX.Element | null;
}

export function ControlButton(inProps: IProps) {
    const {
        disabled = false,
        selected = false,
        onButtonClick,
        icon,
        children,
        Icon: deprecatedIcon,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminRteControlButton" });

    const Icon = icon || deprecatedIcon;

    const ownerState: OwnerState = {
        selected,
        Icon,
    };

    return (
        <Root type="button" disabled={disabled} onMouseDown={onButtonClick} ownerState={ownerState} {...slotProps?.root} {...restProps}>
            {!!Icon && <Icon sx={{ fontSize: 15 }} color="inherit" />}
            {children}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminRteControlButton: RteControlButtonClassKey;
    }

    interface Components {
        CometAdminRteControlButton?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRteControlButton"];
        };
    }
}
