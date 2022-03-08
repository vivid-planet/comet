import { ListItemProps } from "@material-ui/core/ListItem";
import * as React from "react";

import { MenuItem, MenuItemProps } from "./Item";

export const MenuItemAnchorLink: React.FC<MenuItemProps & ListItemProps & React.HTMLProps<HTMLAnchorElement>> = (props) => (
    <MenuItem selected={false} component="a" {...props} />
);
