import { MenuItemRouterLinkProps } from "@comet/admin";
import { UserPermission } from "@comet/cms-admin";
import { RouteProps } from "react-router";

export type Page = {
    requiredPermission?: UserPermission;
    routes?: (RouteProps & { requiredPermission?: UserPermission })[];
    route?: RouteProps;
    menu?: Omit<MenuItemRouterLinkProps, "to"> & {
        subMenu?: (MenuItemRouterLinkProps & { requiredPermission?: UserPermission })[];
    };
};

export type Pages = Page[];
