import { MenuItemRouterLinkProps } from "@comet/admin";

import { RouteMenu, RouteMenuItemWithSubMenu } from "./routeMenu.type";

type MenuItem = {
    menuItem: MenuItemRouterLinkProps;
    hasSubMenu: boolean;
    subMenu: Menu;
};
type Menu = MenuItem[];

export function getMenuFromRouteMenu(items: RouteMenu<10>): Menu {
    // TODO: Filter for user-permissions once they are available
    const mapFn = (item: RouteMenuItemWithSubMenu): MenuItem => ({
        menuItem: {
            ...item,
            to: item.to ?? item.route?.path?.toString() ?? "",
        },
        hasSubMenu: !!item.subMenu,
        subMenu: item.subMenu ? item.subMenu.map(mapFn) : [],
    });
    return items.map(mapFn);
}
