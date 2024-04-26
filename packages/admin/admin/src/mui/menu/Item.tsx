import { ComponentsOverrides, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText, Theme, useThemeProps } from "@mui/material";
import * as React from "react";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { Icon, MenuItemClassKey, OwnerState, Root, Text } from "./Item.styles";

export type MenuItemLevel = 1 | 2 | 3;

export interface MenuItemProps
    extends ThemedComponentBaseProps<{
            root: typeof ListItemButton;
            icon: typeof ListItemIcon;
            text: typeof ListItemText;
        }>,
        ListItemButtonProps {
    level?: MenuItemLevel;
    primary: React.ReactNode;
    secondary?: React.ReactNode;
    icon?: React.ReactElement;
    secondaryAction?: React.ReactNode;
    isMenuOpen?: boolean;
    isCollapsibleOpen?: boolean;
    hasSubitems?: boolean;
}

export const MenuItem = (inProps: MenuItemProps) => {
    const {
        primary,
        secondary,
        icon,
        level = 1,
        secondaryAction,
        isMenuOpen,
        hasSubitems,
        isCollapsibleOpen,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminMenuItem" });

    if (level > 3) throw new Error("Maximum nesting level of 2 exceeded.");

    const showIcon = !!icon && level === 1;
    const showText = isMenuOpen || level !== 1;

    const ownerState: OwnerState = {
        level,
        open: Boolean(isMenuOpen),
        hasIcon: Boolean(icon),
        collapsibleOpen: Boolean(isCollapsibleOpen),
        hasSecondaryText: Boolean(secondary),
        hasSecondaryAction: Boolean(secondaryAction),
        hasSubItems: Boolean(hasSubitems),
    };

    return (
        // @ts-expect-error The type of the `component` is missing when using `styled()`: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
        <Root component="div" ownerState={ownerState} {...slotProps?.root} {...restProps}>
            {showIcon && (
                <Icon ownerState={ownerState} {...slotProps?.icon}>
                    {icon}
                </Icon>
            )}
            {showText && <Text ownerState={ownerState} primary={primary} secondary={secondary} inset={!icon} {...slotProps?.text} />}
            {!!secondaryAction && secondaryAction}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenuItem: MenuItemClassKey;
    }

    interface Components {
        CometAdminMenuItem?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuItem"];
        };
    }
}
