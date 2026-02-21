import { RouteWithErrorBoundary } from "@comet/admin";
import { type ReactNode, useContext } from "react";
import { Navigate, UNSAFE_RouteContext } from "react-router";

import { type Permission, useUserPermissionCheck } from "../userPermissions/hooks/currentUser";
import { type MasterMenuData, type MasterMenuItem } from "./MasterMenu";

interface RouteConfig {
    path?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component?: React.ComponentType<any>;
    render?: () => ReactNode;
    children?: ReactNode;
}

export function useRoutePropsFromMasterMenuData(items: MasterMenuData): RouteConfig[] {
    const isAllowed = useUserPermissionCheck();
    const checkPermission = (item: MasterMenuItem, ancestors: MasterMenuItem[]): boolean => {
        function getRequiredPermissionsArray(permission: Permission | Permission[]): Permission[] {
            return Array.isArray(permission) ? permission : [permission];
        }

        let allowed = true;

        if (item.requiredPermission) {
            allowed &&= getRequiredPermissionsArray(item.requiredPermission).some((permission) => isAllowed(permission));
        }

        for (const ancestor of ancestors) {
            if (ancestor.requiredPermission) {
                allowed &&= getRequiredPermissionsArray(ancestor.requiredPermission).some((permission) => isAllowed(permission));
            }
        }

        return allowed;
    };

    const flat = (
        routes: RouteConfig[],
        item: MasterMenuItem & { icon?: ReactNode },
        ancestors: Array<MasterMenuItem & { icon?: ReactNode }>,
    ): RouteConfig[] => {
        if (item.type === "externalLink") {
            return routes;
        }
        if (item.type === "group") {
            return routes.concat(item.items.reduce((routes, child) => flat(routes, child, [...ancestors, item]), [] as RouteConfig[]));
        }
        if (item.route && checkPermission(item, ancestors)) {
            routes = routes.concat(item.route as RouteConfig);
        }
        if (item.type === "collapsible" && !!item.items?.length) {
            routes = routes.concat(
                (item.items as Array<MasterMenuItem & { icon?: ReactNode }>).reduce(
                    (routes, child) => flat(routes, child, [...ancestors, item]),
                    [] as RouteConfig[],
                ),
            );
        }
        return routes;
    };
    return items.reduce((routes, item) => flat(routes, item, []), [] as RouteConfig[]);
}

export interface MasterMenuRoutesProps {
    menu: MasterMenuData;
}

export const MasterMenuRoutes = ({ menu }: MasterMenuRoutesProps) => {
    const routes = useRoutePropsFromMasterMenuData(menu);
    const routeContext = useContext(UNSAFE_RouteContext);
    const currentMatch = routeContext.matches[routeContext.matches.length - 1];
    const matchUrl = currentMatch?.pathnameBase ?? "";

    return (
        <>
            {routes.map((route, index) => (
                <RouteWithErrorBoundary key={index} path={`${matchUrl}${route.path}`}>
                    {route.children}
                </RouteWithErrorBoundary>
            ))}
            <Navigate to={`${matchUrl}${routes[0].path}`} replace />
        </>
    );
};
