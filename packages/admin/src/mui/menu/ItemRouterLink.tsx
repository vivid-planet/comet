import { ListItemProps } from "@mui/material/ListItem";
import * as React from "react";
import { Link, LinkProps, Route } from "react-router-dom";

import { MenuItem, MenuItemProps } from "./Item";

interface MenuItemRouterLinkStandardProps {
    to: string;
}

export type MenuItemRouterLinkProps = MenuItemRouterLinkStandardProps & MenuItemProps & ListItemProps & LinkProps;

export const MenuItemRouterLink: React.FC<MenuItemRouterLinkProps> = (props) => (
    <Route path={props.to} strict={false}>
        {({ match }) => <MenuItem selected={!!match} component={Link} {...props} />}
    </Route>
);
