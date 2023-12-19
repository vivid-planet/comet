import { RouteWithErrorBoundary } from "@comet/admin";
import * as React from "react";
import { Redirect, RouteProps, Switch, useRouteMatch } from "react-router-dom";

import { useIsAllowed } from "../userPermissions/hooks/currentUser";
import { MasterMenuData, MasterMenuItem } from "./MasterMenu";

export function useRoutePropsFromMasterMenuData(items: MasterMenuData): RouteProps[] {
    const isAllowed = useIsAllowed();
    const checkPermission = (item: MasterMenuItem): boolean => !item.requiredPermission || isAllowed(item.requiredPermission);

    const flat = (routes: RouteProps[], item: MasterMenuItem): RouteProps[] => {
        if (item.route && checkPermission(item)) {
            routes.push(item.route);
        }
        if (item.submenu) {
            routes.concat(item.submenu.reduce(flat, routes));
        }
        return routes;
    };
    return items.reduce(flat, []);
}

export interface MasterMenuRoutesProps {
    menu: MasterMenuData;
}

export const MasterMenuRoutes: React.FC<MasterMenuRoutesProps> = ({ menu }) => {
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
