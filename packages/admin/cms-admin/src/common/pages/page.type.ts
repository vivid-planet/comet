import { MenuItemRouterLinkProps } from "@comet/admin";
import { RouteProps } from "react-router";

import { UserPermission } from "../../userPermissions/hooks/currentUser";

export type PageMenuItem = Omit<MenuItemRouterLinkProps, "to"> & {
    requiredPermission?: UserPermission;
    route?: RouteProps;
    to?: string;
};

export type Page = PageMenuItem & {
    subMenu?: PageMenuItem[];
};

export type Pages = Page[];
