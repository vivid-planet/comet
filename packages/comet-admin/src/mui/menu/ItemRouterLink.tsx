import { ListItemProps } from "@material-ui/core/ListItem";
import * as React from "react";
import { Link, LinkProps, Route } from "react-router-dom";

import { IMenuItemProps, MenuItem } from "./Item";

interface IMenuItemRouterLinkProps {
    to: string;
}

export class MenuItemRouterLink extends React.Component<IMenuItemRouterLinkProps & IMenuItemProps & ListItemProps & LinkProps> {
    public render() {
        return (
            <Route path={this.props.to} strict={false}>
                {({ match }) => <MenuItem selected={!!match} component={Link} {...this.props} />}
            </Route>
        );
    }
}
