import { ListItemProps } from "@material-ui/core/ListItem";
import { IMenuItemProps, MenuItem } from "@vivid-planet/react-admin-mui";
import * as React from "react";
import { Link, LinkProps } from "react-router-dom";

export interface IMenuItemLink extends IMenuItemProps {
    path: string;
}

class ItemLink extends React.Component<IMenuItemLink & ListItemProps & Partial<LinkProps>> {
    public render() {
        const { path, ...otherProps } = this.props;

        return <MenuItem selected={location.pathname === path} component={Link} to={path} {...otherProps} />;
    }
}

export default ItemLink;
