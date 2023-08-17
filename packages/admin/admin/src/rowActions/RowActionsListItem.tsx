import { ListItemIcon, ListItemIconProps, ListItemText, ListItemTextProps, MenuItem, MenuItemProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { CommonRowActionItemProps } from "./RowActionsItem";

export type RowActionsListItemComponentsProps<T extends React.ElementType = "li"> = React.PropsWithChildren<{
    listItemIcon?: Partial<ListItemIconProps>;
    listItemText?: Partial<ListItemTextProps>;
    menuItem?: Partial<MenuItemProps<T> & { component: T }>;
}>;

export interface RowActionsListItemProps<T extends React.ElementType = "li"> extends CommonRowActionItemProps {
    textSecondary?: React.ReactNode;
    endIcon?: React.ReactNode;
    componentsProps?: RowActionsListItemComponentsProps<T>;
    children?: React.ReactNode;
}

const RowActionsListItemNoRef = <T extends React.ElementType>(props: RowActionsListItemProps<T>, ref: React.ForwardedRef<HTMLLIElement>) => {
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

export const RowActionsListItem = React.forwardRef(RowActionsListItemNoRef) as <T extends React.ElementType>(
    props: RowActionsListItemProps<T> & { ref?: React.ForwardedRef<HTMLLIElement> },
) => React.ReactElement;

const EndIcon = styled("div")(({ theme }) => ({
    marginLeft: theme.spacing(2),
    display: "flex",
    alignItems: "center",
}));
