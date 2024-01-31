import { ListItemProps } from "@mui/material/ListItem";
import * as React from "react";

import { MenuItem, MenuItemProps } from "./Item";

export type MenuItemAnchorLinkProps = MenuItemProps & ListItemProps & React.HTMLProps<HTMLAnchorElement>;

export const MenuItemAnchorLink: React.FC<MenuItemAnchorLinkProps> = (props) => <MenuItem selected={false} component="a" {...props} />;
