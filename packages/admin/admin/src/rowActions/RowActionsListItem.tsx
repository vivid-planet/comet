import { ListItemIcon, ListItemIconProps, ListItemText, ListItemTextProps, MenuItem, MenuItemProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { CommonRowActionItemProps } from "./RowActionsItem";

export interface RowActionsListItemComponentsProps {
    listItemIcon?: Partial<ListItemIconProps>;
    listItemText?: Partial<ListItemTextProps>;
    menuItem?: Partial<MenuItemProps>;
}

export interface RowActionsListItemProps extends CommonRowActionItemProps {
    textSecondary?: React.ReactNode;
    endIcon?: React.ReactNode;
    componentsProps?: RowActionsListItemComponentsProps;
}

export const RowActionsListItem = React.forwardRef<HTMLLIElement, RowActionsListItemProps>(function RowActionsListItem(props, ref) {
    const { icon, text, textSecondary, endIcon, componentsProps = {}, ...restMenuItemProps } = props;
    const { listItemIcon: listItemIconProps, listItemText: listItemTextProps, menuItem: menuItemProps } = componentsProps;
    return (
        <MenuItem ref={ref} {...restMenuItemProps} {...menuItemProps}>
            {icon !== undefined && <ListItemIcon {...listItemIconProps}>{icon}</ListItemIcon>}
            {text !== undefined && <ListItemText primary={text} secondary={textSecondary} {...listItemTextProps} />}
            {Boolean(endIcon) && <EndIcon>{endIcon}</EndIcon>}
        </MenuItem>
    );
});

const EndIcon = styled("div")(({ theme }) => ({
    marginLeft: theme.spacing(2),
    display: "flex",
    alignItems: "center",
}));
