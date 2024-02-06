import { ListItemIcon, ListItemIconProps, ListItemText, ListItemTextProps, MenuItem, MenuItemProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { CommonRowActionItemProps } from "./RowActionsItem";

export type RowActionsListItemComponentsProps<MenuItemComponent extends React.ElementType = "li"> = React.PropsWithChildren<{
    listItemIcon?: Partial<ListItemIconProps>;
    listItemText?: Partial<ListItemTextProps>;
    menuItem?: Partial<MenuItemProps<MenuItemComponent> & { component: MenuItemComponent }>;
}>;

export interface RowActionsListItemProps<MenuItemComponent extends React.ElementType = "li"> extends CommonRowActionItemProps {
    textSecondary?: React.ReactNode;
    endIcon?: React.ReactNode;
    componentsProps?: RowActionsListItemComponentsProps<MenuItemComponent>;
    children?: React.ReactNode;
}

const RowActionsListItemNoRef = <MenuItemComponent extends React.ElementType = "li">(
    props: RowActionsListItemProps<MenuItemComponent>,
    ref: React.ForwardedRef<any>,
) => {
    const { icon, children, textSecondary, endIcon, componentsProps = {}, ...restMenuItemProps } = props;
    const { listItemIcon: listItemIconProps, listItemText: listItemTextProps, menuItem: menuItemProps } = componentsProps;

    return (
        <MenuItem ref={ref} {...restMenuItemProps} {...menuItemProps}>
            {icon !== undefined && <ListItemIcon {...listItemIconProps}>{icon}</ListItemIcon>}
            {children !== undefined && <ListItemText primary={children} secondary={textSecondary} {...listItemTextProps} />}
            {Boolean(endIcon) && <EndIcon>{endIcon}</EndIcon>}
        </MenuItem>
    );
};

export const RowActionsListItem = React.forwardRef(RowActionsListItemNoRef) as <MenuItemComponent extends React.ElementType = "li">(
    props: RowActionsListItemProps<MenuItemComponent> & { ref?: React.ForwardedRef<any> },
) => React.ReactElement;

const EndIcon = styled("div")(({ theme }) => ({
    marginLeft: theme.spacing(2),
    display: "flex",
    alignItems: "center",
}));
