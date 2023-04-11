import * as React from "react";

import { RowActionsIconItem, RowActionsIconItemComponentsProps, RowActionsIconItemProps } from "./RowActionsIconItem";
import { RowActionsListItem, RowActionsListItemComponentsProps, RowActionsListItemProps } from "./RowActionsListItem";
import { RowActionsMenuContext } from "./RowActionsMenu";

export interface CommonRowActionItemProps {
    icon?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

export type RowActionsItemPropsComponentsProps = RowActionsIconItemComponentsProps & RowActionsListItemComponentsProps;

export interface RowActionsItemProps extends Omit<RowActionsIconItemProps, "componentsProps">, Omit<RowActionsListItemProps, "componentsProps"> {
    componentsProps?: RowActionsItemPropsComponentsProps;
    children?: React.ReactNode;
}

export const RowActionsItem = ({ icon, children, onClick, componentsProps, ...restListItemProps }: RowActionsItemProps) => {
    const { level, closeAllMenus } = React.useContext(RowActionsMenuContext);

    if (level === 1) {
        return (
            <RowActionsIconItem
                icon={icon}
                tooltip={children}
                onClick={onClick}
                componentsProps={{ iconButton: componentsProps?.iconButton, tooltip: componentsProps?.tooltip }}
            />
        );
    }

    return (
        <RowActionsListItem
            icon={icon}
            onClick={(event) => {
                onClick?.(event);
                closeAllMenus?.();
            }}
            componentsProps={{
                menuItem: componentsProps?.menuItem,
                listItemIcon: componentsProps?.listItemIcon,
                listItemText: componentsProps?.listItemText,
            }}
            {...restListItemProps}
        >
            {children}
        </RowActionsListItem>
    );
};
