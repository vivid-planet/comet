import { Menu, MenuCollapsibleItem, MenuContext, MenuItemRouterLink, MenuItemRouterLinkProps, useWindowSize } from "@comet/admin";
import * as React from "react";
import { RouteProps, useRouteMatch } from "react-router-dom";

export type MasterMenuItem = Omit<MenuItemRouterLinkProps, "to"> & {
    route?: RouteProps;
    to?: string;
    subMenu?: MasterMenuItem[];
};

export type MasterMenuData = MasterMenuItem[];

export function getMenuFromMasterMenuData(items: MasterMenuData): MenuItem[] {
    // TODO: Filter for user-permissions once they are available
    const mapFn = (item: MasterMenuItem): MenuItem => {
        const { route, subMenu, to, ...menuItem } = item;
        return {
            menuItem: {
                ...menuItem,
                to: to ?? route?.path?.toString() ?? "",
            },
            hasSubMenu: !!subMenu,
            subMenu: subMenu ? subMenu.map(mapFn) : [],
        };
    };
    return items.map(mapFn);
}

type MenuItem = {
    menuItem: MenuItemRouterLinkProps;
    hasSubMenu: boolean;
    subMenu: MenuItem[];
};

export interface MasterMenuProps {
    permanentMenuMinWidth?: number;
    menu: MasterMenuData;
}

export const MasterMenu: React.FC<MasterMenuProps> = ({ menu, permanentMenuMinWidth = 1024 }) => {
    const menuItems = getMenuFromMasterMenuData(menu);
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
                menuItem.hasSubMenu ? (
                    <MenuCollapsibleItem key={index} {...menuItem.menuItem}>
                        {menuItem.subMenu.map((subMenu, index) => (
                            <MenuItemRouterLink key={index} {...subMenu.menuItem} to={`${match.url}${subMenu.menuItem.to}`} />
                        ))}
                    </MenuCollapsibleItem>
                ) : (
                    <MenuItemRouterLink key={index} {...menuItem.menuItem} to={`${match.url}${menuItem.menuItem.to}`} />
                ),
            )}
        </Menu>
    );
};
