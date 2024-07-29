import { ListItemButtonProps } from "@mui/material";
import * as React from "react";

import { MenuItem, MenuItemProps } from "./Item";

export type MenuItemAnchorLinkProps = MenuItemProps & ListItemButtonProps & React.HTMLProps<HTMLAnchorElement>;

// @ts-expect-error "component"-property is used as described in the documentation  https://mui.com/material-ui/react-list/, but type is missing in ListItemButtonProps
export const MenuItemAnchorLink: React.FC<MenuItemAnchorLinkProps> = (props) => <MenuItem selected={false} component="a" {...props} />;
