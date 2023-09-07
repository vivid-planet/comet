import { RouteProps } from "react-router-dom";

import { useCurrentUser } from "../../userPermissions/hooks/currentUser";
import { Pages } from "./page.type";

export function useRoutesForCurrentUser(pages: Pages): RouteProps[] {
    const user = useCurrentUser();
    if (!user) return [];
    return pages.flatMap((page) => {
        const ret = [];
        if (page.route && user.isAllowed(page.requiredPermission)) ret.push(page.route);
        if (page.subMenu) {
            for (const subMenu of page.subMenu) {
                if (subMenu.route && user.isAllowed(subMenu.requiredPermission ?? page.requiredPermission)) {
                    ret.push(subMenu.route);
                }
            }
        }
        return ret;
    });
}
