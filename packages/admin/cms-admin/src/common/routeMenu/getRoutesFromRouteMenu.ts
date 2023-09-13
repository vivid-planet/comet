import { RouteProps } from "react-router-dom";

import { RouteMenu } from "./routeMenu.type";

export function getRoutesFromRouteMenu(items: RouteMenu): RouteProps[] {
    // TODO: Filter for user-permissions once they are available
    return items.flatMap((item) => {
        const ret = [];
        if (item.route) ret.push(item.route);
        if (item.subMenu) {
            for (const subMenu of item.subMenu) {
                if (subMenu.route) {
                    ret.push(subMenu.route);
                }
            }
        }
        return ret;
    });
}
