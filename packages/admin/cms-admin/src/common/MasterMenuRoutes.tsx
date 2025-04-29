import { RouteWithErrorBoundary } from "@comet/admin";
import { ReactNode } from "react";
import { Redirect, RouteProps, Switch, useRouteMatch } from "react-router-dom";

import { useUserPermissionCheck } from "../userPermissions/hooks/currentUser";
import { MasterMenuData, MasterMenuItem } from "./MasterMenu";

export function useRoutePropsFromMasterMenuData(items: MasterMenuData): RouteProps[] {
    const isAllowed = useUserPermissionCheck();
    const checkPermission = (item: MasterMenuItem, parent?: MasterMenuItem): boolean => {
        if (item.requiredPermission) {
            return isAllowed(item.requiredPermission);
        } else if (parent?.requiredPermission) {
            return isAllowed(parent.requiredPermission);
        } else {
            return true;
        }
    };

    const flat = (
        routes: RouteProps[],
        item: MasterMenuItem & { icon?: ReactNode },
        parent?: MasterMenuItem & { icon?: ReactNode },
    ): RouteProps[] => {
        if (item.type === "externalLink") {
            return routes;
        }
        if (item.type === "group") {
            return routes.concat(item.items.reduce((routes, child) => flat(routes, child, item), [] as RouteProps[]));
        }
        if (item.route && checkPermission(item, parent)) {
            routes.push(item.route);
        }
        if (item.type === "collapsible" && !!item.items?.length) {
            routes.concat((item.items as Array<MasterMenuItem & { icon?: ReactNode }>).reduce((routes, child) => flat(routes, child, item), routes));
        }
        return routes;
    };
    return items.reduce((routes, item) => flat(routes, item), [] as RouteProps[]);
}

export interface MasterMenuRoutesProps {
    menu: MasterMenuData;
}

export const MasterMenuRoutes = ({ menu }: MasterMenuRoutesProps) => {
    const routes = useRoutePropsFromMasterMenuData(menu);
    const match = useRouteMatch();

    return (
        <Switch>
            {routes.map((route, index) => (
                <RouteWithErrorBoundary key={index} {...route} path={`${match.path}${route.path}`} />
            ))}
            <Redirect to={`${match.url}${routes[0].path}`} from={match.path} />
        </Switch>
    );
};
