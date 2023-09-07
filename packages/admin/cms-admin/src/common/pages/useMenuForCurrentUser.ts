import { MenuItemRouterLinkProps } from "@comet/admin";

import { useCurrentUser } from "../../userPermissions/hooks/currentUser";
import { Pages } from "./page.type";

type Menu = {
    menuItem: MenuItemRouterLinkProps;
    hasSubMenu: boolean;
    subMenu: {
        menuItem: MenuItemRouterLinkProps;
    }[];
}[];

export function useMenuForCurrentUser(pages: Pages, basePath: string): Menu {
    const user = useCurrentUser();
    return pages
        .filter((page) => user && user.isAllowed(page.requiredPermission))
        .map((page) => ({
            menuItem: {
                ...page,
                to: `${basePath}${page.to ?? page.route?.path?.toString()}`,
            },
            hasSubMenu: !!page.subMenu,
            subMenu: page.subMenu
                ? page.subMenu
                      .filter((subPage) => user.isAllowed(subPage.requiredPermission ?? page.requiredPermission))
                      .map((subPage) => ({
                          menuItem: {
                              ...subPage,
                              to: `${basePath}${subPage.to ?? subPage.route?.path?.toString()}`,
                          },
                      }))
                : [],
        }));
}
