import { RouteWithErrorBoundary } from "@comet/admin";
import { type ReactNode } from "react";
import { Redirect, type RouteProps, Switch, useRouteMatch } from "react-router-dom";

import { useUserPermissionCheck } from "../userPermissions/hooks/currentUser";
import { type MasterMenuData, type MasterMenuItem } from "./MasterMenu";
import { NotFound } from "./notFound/NotFound";

export function useRoutePropsFromMasterMenuData(items: MasterMenuData): RouteProps[] {
    const isAllowed = useUserPermissionCheck();
    const checkPermission = (item: MasterMenuItem): boolean => {
        if (!item.requiredPermission) return true;
        const requiredPermissions = Array.isArray(item.requiredPermission) ? item.requiredPermission : [item.requiredPermission];
        return requiredPermissions.some((permission) => isAllowed(permission));
    };

    const flat = (routes: RouteProps[], item: MasterMenuItem & { icon?: ReactNode }): RouteProps[] => {
        if (item.type === "externalLink") {
            return routes;
        }
        if (item.type === "group") {
            return routes.concat(item.items.reduce(flat, []));
        }
        if (item.route && checkPermission(item)) {
            routes.push(item.route);
        }
        if (item.type === "collapsible" && !!item.items?.length) {
            routes.concat((item.items as Array<MasterMenuItem & { icon?: ReactNode }>).reduce(flat, routes));
        }
        return routes;
    };
    return items.reduce(flat, []);
}

export interface MasterMenuRoutesProps {
    menu: MasterMenuData;
    fallback?: ReactNode;
}

export const MasterMenuRoutes = ({ menu, fallback = <NotFound /> }: MasterMenuRoutesProps) => {
    const routes = useRoutePropsFromMasterMenuData(menu);
    const match = useRouteMatch();
    return (
        <Switch>
            <Redirect to={`${match.url}${routes[0].path}`} exact={true} from={match.path} />
            {routes.map((route, index) => (
                <RouteWithErrorBoundary key={index} {...route} path={`${match.path}${route.path}`} />
            ))}
            <RouteWithErrorBoundary
                component={() => {
                    return fallback;
                }}
                path="*"
            />
        </Switch>
    );
};
