import { RouteWithErrorBoundary } from "@comet/admin";
import { ReactNode } from "react";
import { Redirect, RouteProps, Switch, useRouteMatch } from "react-router-dom";

import { useUserPermissionCheck } from "../userPermissions/hooks/currentUser";
import { MasterMenuData, MasterMenuItem } from "./MasterMenu";

export function useRoutePropsFromMasterMenuData(items: MasterMenuData): RouteProps[] {
    const isAllowed = useUserPermissionCheck();
    const checkPermission = (item: MasterMenuItem, ancestors: MasterMenuItem[]): boolean => {
        let allowed = true;

        if (item.requiredPermission) {
            allowed &&= isAllowed(item.requiredPermission);
        }

        for (const ancestor of ancestors) {
            if (ancestor.requiredPermission) {
                allowed &&= isAllowed(ancestor.requiredPermission);
            }
        }

        return allowed;
    };

    const flat = (
        routes: RouteProps[],
        item: MasterMenuItem & { icon?: ReactNode },
        ancestors: Array<MasterMenuItem & { icon?: ReactNode }>,
    ): RouteProps[] => {
        if (item.type === "externalLink") {
            return routes;
        }
        if (item.type === "group") {
            return routes.concat(item.items.reduce((routes, child) => flat(routes, child, [...ancestors, item]), [] as RouteProps[]));
        }
        if (item.route && checkPermission(item, ancestors)) {
            routes = routes.concat(item.route);
        }
        if (item.type === "collapsible" && !!item.items?.length) {
            routes = routes.concat(
                (item.items as Array<MasterMenuItem & { icon?: ReactNode }>).reduce(
                    (routes, child) => flat(routes, child, [...ancestors, item]),
                    [] as RouteProps[],
                ),
            );
        }
        return routes;
    };
    return items.reduce((routes, item) => flat(routes, item, []), [] as RouteProps[]);
}

export interface MasterMenuRoutesProps {
    menu: MasterMenuData;
}

export const MasterMenuRoutes = ({ menu }: MasterMenuRoutesProps) => {
    const routes = useRoutePropsFromMasterMenuData(menu);
    const match = useRouteMatch();

    return (
        <Switch>
            <Redirect to={`${match.url}${routes[0].path}`} exact={true} from={match.path} />
            {routes.map((route, index) => (
                <RouteWithErrorBoundary key={index} {...route} path={`${match.path}${route.path}`} />
            ))}
        </Switch>
    );
};
