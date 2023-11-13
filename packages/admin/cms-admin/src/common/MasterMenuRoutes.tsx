import { RouteWithErrorBoundary } from "@comet/admin";
import * as React from "react";
import { Redirect, RouteProps, Switch, useRouteMatch } from "react-router-dom";

import { CurrentUser, useCurrentUser } from "../userPermissions/hooks/currentUser";
import { MasterMenuData, MasterMenuItem } from "./MasterMenu";

export function getRoutePropsFromMasterMenuData(items: MasterMenuData, user: CurrentUser): RouteProps[] {
    const flat = (routes: RouteProps[], item: MasterMenuItem): RouteProps[] => {
        if (item.route && user.isAllowed(item.requiredPermission)) routes.push(item.route);
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
    const user = useCurrentUser();
    const routes = getRoutePropsFromMasterMenuData(menu, user);
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
