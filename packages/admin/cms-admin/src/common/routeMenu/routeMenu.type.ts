import { MenuItemRouterLinkProps } from "@comet/admin";
import { RouteProps } from "react-router";

export type RouteMenuItem = Omit<MenuItemRouterLinkProps, "to"> & {
    route?: RouteProps;
    to?: string;
};

export type RouteMenu = (RouteMenuItem & {
    subMenu?: RouteMenuItem[];
})[];
