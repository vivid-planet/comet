import { MenuItemRouterLinkProps } from "@comet/admin";
import { RouteProps } from "react-router";

export type RouteMenuItem = Omit<MenuItemRouterLinkProps, "to"> & {
    route?: RouteProps;
    to?: string;
};
export type RouteMenuItemWithSubMenu<Depth extends number = 1> = RouteMenuItem & { subMenu?: RouteMenu<Depth> };

type Decr = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export type RouteMenu<Depth extends number> = Depth extends 1 ? RouteMenuItem[] : RouteMenuItemWithSubMenu<Decr[Depth]>[];
