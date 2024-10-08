import { RouteWithErrorBoundary } from "@comet/admin";
import { ReactNode } from "react";
import { Redirect, RouteProps, Switch, useRouteMatch } from "react-router-dom";

import { useUserPermissionCheck } from "../userPermissions/hooks/currentUser";
import { MasterMenuData, MasterMenuItem } from "./MasterMenu";

export function useRoutePropsFromMasterMenuData(items: MasterMenuData): RouteProps[] {
    const isAllowed = useUserPermissionCheck();
    const checkPermission = (item: MasterMenuItem): boolean => !item.requiredPermission || isAllowed(item.requiredPermission);

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
