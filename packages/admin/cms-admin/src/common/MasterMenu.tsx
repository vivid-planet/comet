import {
    Menu,
    MenuCollapsibleItem,
    MenuContext,
    MenuItemAnchorLink,
    MenuItemAnchorLinkProps,
    MenuItemRouterLink,
    MenuItemRouterLinkProps,
    useWindowSize,
} from "@comet/admin";
import * as React from "react";
import { RouteProps, useRouteMatch } from "react-router-dom";

import { useIsAllowed } from "../userPermissions/hooks/currentUser";

type MasterMenuItemRoute = Omit<MenuItemRouterLinkProps, "to"> & {
    requiredPermission?: string;
    route?: RouteProps;
    to?: string;
    submenu?: MasterMenuItem[];
};

type MasterMenuItemAnchor = MenuItemAnchorLinkProps & {
    requiredPermission?: string;
};

export type MasterMenuItem = MasterMenuItemRoute | MasterMenuItemAnchor;

export type MasterMenuData = MasterMenuItem[];

export function isMasterMenuItemAnchor(item: MasterMenuItem): item is MasterMenuItemAnchor {
    return !!item.href;
}

export function useMenuFromMasterMenuData(items: MasterMenuData): MenuItem[] {
    const isAllowed = useIsAllowed();
    const checkPermission = (item: MasterMenuItem): boolean => !item.requiredPermission || isAllowed(item.requiredPermission);

    const mapFn = (item: MasterMenuItem): MenuItem => {
        if (isMasterMenuItemAnchor(item)) {
            return { menuItem: item };
        }

        const { route, submenu, to, ...menuItem } = item;
        return {
            menuItem: {
                ...menuItem,
                to: to ?? route?.path?.toString() ?? "",
            },
            hasSubmenu: !!submenu,
            submenu: submenu ? submenu.filter(checkPermission).map(mapFn) : [],
        };
    };
    return items.filter(checkPermission).map(mapFn);
}

type MenuItemRoute = {
    menuItem: MenuItemRouterLinkProps;
    hasSubmenu: boolean;
    submenu: MenuItem[];
};

type MenuItemAnchor = {
    menuItem: MenuItemAnchorLinkProps;
};

type MenuItem = MenuItemRoute | MenuItemAnchor;

function isMenuItemAnchor(item: MenuItem): item is MenuItemAnchor {
    return !!item.menuItem.href;
}

export interface MasterMenuProps {
    permanentMenuMinWidth?: number;
    menu: MasterMenuData;
}

export const MasterMenu: React.FC<MasterMenuProps> = ({ menu, permanentMenuMinWidth = 1024 }) => {
    const menuItems = useMenuFromMasterMenuData(menu);
    const { open, toggleOpen } = React.useContext(MenuContext);
    const windowSize = useWindowSize();
    const match = useRouteMatch();
    const useTemporaryMenu: boolean = windowSize.width < permanentMenuMinWidth;

    // Open menu when changing to permanent variant and close when changing to temporary variant.
    React.useEffect(() => {
        if ((useTemporaryMenu && open) || (!useTemporaryMenu && !open)) {
            toggleOpen();
        }
        // useEffect dependencies must only include `location`, because the function should only be called once after changing the location.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <Menu variant={useTemporaryMenu ? "temporary" : "permanent"}>
            {menuItems.map((menuItem, index) =>
                isMenuItemAnchor(menuItem) ? (
                    <MenuItemAnchorLink key={index} {...menuItem.menuItem} />
                ) : menuItem.hasSubmenu ? (
                    <MenuCollapsibleItem key={index} {...menuItem.menuItem}>
                        {menuItem.submenu.map((submenuItem, index) =>
                            isMenuItemAnchor(submenuItem) ? (
                                <MenuItemAnchorLink key={index} {...submenuItem.menuItem} />
                            ) : (
                                <MenuItemRouterLink key={index} {...submenuItem.menuItem} to={`${match.url}${submenuItem.menuItem.to}`} />
                            ),
                        )}
                    </MenuCollapsibleItem>
                ) : (
                    <MenuItemRouterLink key={index} {...menuItem.menuItem} to={`${match.url}${menuItem.menuItem.to}`} />
                ),
            )}
        </Menu>
    );
};
