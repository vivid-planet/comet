import { MasterLayout, MasterLayoutProps, MenuItemRouterLinkProps } from "@comet/admin";
import * as React from "react";
import { RouteProps } from "react-router-dom";

import { MasterMenu } from "./MasterMenu";
import { MasterMenuRoutes } from "./MasterMenuRoutes";

export type RouteMenuItem = Omit<MenuItemRouterLinkProps, "to"> & {
    route?: RouteProps;
    to?: string;
    subMenu?: RouteMenuItem[];
};

export type MasterMenuData = RouteMenuItem[];

export type MasterProps = Omit<MasterLayoutProps, "menuComponent" | "children"> & {
    masterMenuData: MasterMenuData;
};

export const Master: React.FC<MasterProps> = ({ masterMenuData, ...props }) => {
    const menuComponent = () => <MasterMenu menu={masterMenuData} />;
    return (
        <MasterLayout menuComponent={menuComponent} {...props}>
            <MasterMenuRoutes menu={masterMenuData} />
        </MasterLayout>
    );
};
