import { RouteProps } from "react-router-dom";

import { RouteMenu, RouteMenuItemWithSubMenu } from "./routeMenu.type";

export function getRoutePropsFromRouteMenu(items: RouteMenu<10>): RouteProps[] {
    // TODO: Filter for user-permissions once they are available
    const flat = (routes: RouteProps[], item: RouteMenuItemWithSubMenu): RouteProps[] => {
        if (item.route) routes.push(item.route);
        if (item.subMenu) {
            routes.concat(item.subMenu.reduce(flat, routes));
        }
        return routes;
    };
    return items.reduce(flat, []);
}
