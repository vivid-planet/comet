import { Menu, MenuCollapsibleItem, MenuContext, MenuItemRouterLink, MenuItemRouterLinkProps, useWindowSize } from "@comet/admin";
import * as React from "react";
import { RouteProps, useRouteMatch } from "react-router-dom";

import { CurrentUserContext } from "../userPermissions/hooks/currentUser";

export type MasterMenuItem = Omit<MenuItemRouterLinkProps, "to"> & {
    requiredPermission?: string;
    route?: RouteProps;
    to?: string;
    submenu?: MasterMenuItem[];
};

export type MasterMenuData = MasterMenuItem[];

export function useMenuFromMasterMenuData(items: MasterMenuData): MenuItem[] {
    const context = React.useContext<CurrentUserContext | undefined>(CurrentUserContext);

    const mapFn = (item: MasterMenuItem): MenuItem => {
        const { route, submenu, to, ...menuItem } = item;
        return {
            menuItem: {
                ...menuItem,
                to: to ?? route?.path?.toString() ?? "",
            },
            hasSubmenu: !!submenu,
            submenu: submenu ? submenu.filter(filterFn).map(mapFn) : [],
        };
    };
    const filterFn = (item: MasterMenuItem): boolean =>
        !item.requiredPermission || (context !== undefined && context.isAllowed(context.currentUser, item.requiredPermission));
    return items.filter(filterFn).map(mapFn);
}

type MenuItem = {
    menuItem: MenuItemRouterLinkProps;
    hasSubmenu: boolean;
    submenu: MenuItem[];
};

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
                menuItem.hasSubmenu ? (
                    <MenuCollapsibleItem key={index} {...menuItem.menuItem}>
                        {menuItem.submenu.map((submenu, index) => (
                            <MenuItemRouterLink key={index} {...submenu.menuItem} to={`${match.url}${submenu.menuItem.to}`} />
                        ))}
                    </MenuCollapsibleItem>
                ) : (
                    <MenuItemRouterLink key={index} {...menuItem.menuItem} to={`${match.url}${menuItem.menuItem.to}`} />
                ),
            )}
        </Menu>
    );
};
