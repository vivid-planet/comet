import { ListItemIcon, ListItemIconProps, ListItemText, ListItemTextProps, MenuItem, MenuItemProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ElementType, ForwardedRef, forwardRef, PropsWithChildren, ReactElement, ReactNode } from "react";

import { CommonRowActionItemProps } from "./RowActionsItem";

export type RowActionsListItemComponentsProps<MenuItemComponent extends ElementType = "li"> = PropsWithChildren<{
    listItemIcon?: Partial<ListItemIconProps>;
    listItemText?: Partial<ListItemTextProps>;
    menuItem?: Partial<MenuItemProps<MenuItemComponent> & { component: MenuItemComponent }>;
}>;

export interface RowActionsListItemProps<MenuItemComponent extends ElementType = "li"> extends PropsWithChildren<CommonRowActionItemProps> {
    textSecondary?: ReactNode;
    endIcon?: ReactNode;
    componentsProps?: RowActionsListItemComponentsProps<MenuItemComponent>;
}

const RowActionsListItemNoRef = <MenuItemComponent extends ElementType = "li">(
    props: RowActionsListItemProps<MenuItemComponent>,
    ref: ForwardedRef<any>,
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

export const RowActionsListItem = forwardRef(RowActionsListItemNoRef) as <MenuItemComponent extends ElementType = "li">(
    props: RowActionsListItemProps<MenuItemComponent> & { ref?: ForwardedRef<any> },
) => ReactElement;

const EndIcon = styled("div")(({ theme }) => ({
    marginLeft: theme.spacing(2),
    display: "flex",
    alignItems: "center",
}));
