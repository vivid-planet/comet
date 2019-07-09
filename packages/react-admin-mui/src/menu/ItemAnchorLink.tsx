import { ListItemProps } from "@material-ui/core/ListItem";
import * as React from "react";
import { IMenuItemProps, MenuItem } from "./Item";

export class MenuItemAnchorLink extends React.Component<IMenuItemProps & ListItemProps & React.HTMLProps<HTMLAnchorElement>> {
    public render() {
        const { ...otherProps } = this.props;
        return <MenuItem selected={false} {...otherProps} />;
    }
}
