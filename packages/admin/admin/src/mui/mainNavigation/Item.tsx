import {
    type ComponentsOverrides,
    type ListItemButton,
    type ListItemButtonProps,
    type ListItemIcon,
    type ListItemText,
    type Theme,
    useThemeProps,
} from "@mui/material";
import { type ReactElement, type ReactNode } from "react";

import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useMainNavigation } from "./Context";
import { Icon, type MainNavigationItemClassKey, type OwnerState, Root, Text } from "./Item.styles";

export type MainNavigationItemLevel = 1 | 2 | 3;

export interface MainNavigationItemProps
    extends ThemedComponentBaseProps<{
            root: typeof ListItemButton;
            icon: typeof ListItemIcon;
            text: typeof ListItemText;
        }>,
        ListItemButtonProps {
    level?: MainNavigationItemLevel;
    primary: ReactNode;
    secondary?: ReactNode;
    icon?: ReactElement;
    secondaryAction?: ReactNode;
    isMenuOpen?: boolean;
    isCollapsibleOpen?: boolean;
    hasSubitems?: boolean;
}

export const MainNavigationItem = (inProps: MainNavigationItemProps) => {
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
    } = useThemeProps({ props: inProps, name: "CometAdminMainNavigationItem" });

    const { drawerVariant } = useMainNavigation();

    if (level > 3) {
        throw new Error("Maximum nesting level of 2 exceeded.");
    }

    const showIcon = !!icon && level === 1;

    const ownerState: OwnerState = {
        level,
        open: Boolean(isMenuOpen),
        hasIcon: Boolean(icon),
        collapsibleOpen: Boolean(isCollapsibleOpen),
        hasSecondaryText: Boolean(secondary),
        hasSecondaryAction: Boolean(secondaryAction),
        hasSubItems: Boolean(hasSubitems),
        variant: drawerVariant,
    };

    return (
        <Root component="div" ownerState={ownerState} {...slotProps?.root} {...restProps}>
            {showIcon && (
                <Icon ownerState={ownerState} {...slotProps?.icon}>
                    {icon}
                </Icon>
            )}
            <Text ownerState={ownerState} primary={primary} secondary={secondary} inset={!icon} {...slotProps?.text} />
            {!!secondaryAction && secondaryAction}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminMainNavigationItem: MainNavigationItemProps;
    }

    interface ComponentNameToClassKey {
        CometAdminMainNavigationItem: MainNavigationItemClassKey;
    }

    interface Components {
        CometAdminMainNavigationItem?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMainNavigationItem"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMainNavigationItem"];
        };
    }
}
