import { MenuItemRouterLinkProps } from "@comet/admin";

import { RouteMenu } from "./routeMenu.type";

type Menu = {
    menuItem: MenuItemRouterLinkProps;
    hasSubMenu: boolean;
    subMenu: {
        menuItem: MenuItemRouterLinkProps;
    }[];
}[];

export function useMenuForCurrentUser(items: RouteMenu, basePath: string): Menu {
    // TODO: Filter for user-permissions once they are available
    return items.map((item) => ({
        menuItem: {
            ...item,
            to: `${basePath}${item.to ?? item.route?.path?.toString()}`,
        },
        hasSubMenu: !!item.subMenu,
        subMenu: item.subMenu
            ? item.subMenu.map((subItem) => ({
                  menuItem: {
                      ...subItem,
                      to: `${basePath}${subItem.to ?? subItem.route?.path?.toString()}`,
                  },
              }))
            : [],
    }));
}
