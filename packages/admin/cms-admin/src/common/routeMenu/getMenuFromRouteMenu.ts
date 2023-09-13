import { MenuItemRouterLinkProps } from "@comet/admin";

import { RouteMenu } from "./routeMenu.type";

type Menu = {
    menuItem: MenuItemRouterLinkProps;
    hasSubMenu: boolean;
    subMenu: {
        menuItem: MenuItemRouterLinkProps;
    }[];
}[];

export function getMenuFromRouteMenu(items: RouteMenu): Menu {
    // TODO: Filter for user-permissions once they are available
    return items.map((item) => ({
        menuItem: {
            ...item,
            to: item.to ?? item.route?.path?.toString() ?? "",
        },
        hasSubMenu: !!item.subMenu,
        subMenu: item.subMenu
            ? item.subMenu.map((subItem) => ({
                  menuItem: {
                      ...subItem,
                      to: subItem.to ?? subItem.route?.path?.toString() ?? "",
                  },
              }))
            : [],
    }));
}
