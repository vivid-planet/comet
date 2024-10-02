import { ComponentsOverrides, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText, Theme, useThemeProps } from "@mui/material";
import { ReactElement, ReactNode, useContext } from "react";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MenuContext } from "./Context";
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
    primary: ReactNode;
    secondary?: ReactNode;
    icon?: ReactElement;
    secondaryAction?: ReactNode;
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

    const { drawerVariant } = useContext(MenuContext);

    if (level > 3) throw new Error("Maximum nesting level of 2 exceeded.");

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
        // @ts-expect-error The type of the `component` is missing when using `styled()`: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
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
        CometAdminMenuItem: MenuItemProps;
    }

    interface ComponentNameToClassKey {
        CometAdminMenuItem: MenuItemClassKey;
    }

    interface Components {
        CometAdminMenuItem?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMenuItem"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuItem"];
        };
    }
}
