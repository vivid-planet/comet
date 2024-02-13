import * as React from "react";

import { RowActionsIconItem, RowActionsIconItemComponentsProps, RowActionsIconItemProps } from "./RowActionsIconItem";
import { RowActionsListItem, RowActionsListItemComponentsProps, RowActionsListItemProps } from "./RowActionsListItem";
import { RowActionsMenuContext } from "./RowActionsMenu";

export interface CommonRowActionItemProps {
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

export type RowActionsItemPropsComponentsProps<T extends React.ElementType = "li"> = RowActionsIconItemComponentsProps &
    RowActionsListItemComponentsProps<T>;

export interface RowActionsItemProps<T extends React.ElementType = "li">
    extends Omit<RowActionsIconItemProps, "componentsProps">,
        Omit<RowActionsListItemProps<T>, "componentsProps"> {
    componentsProps?: RowActionsItemPropsComponentsProps<T>;
    children?: React.ReactNode;
}

export function RowActionsItem<MenuItemComponent extends React.ElementType = "li">({
    icon,
    children,
    disabled,
    onClick,
    componentsProps,
    ...restListItemProps
}: RowActionsItemProps<MenuItemComponent>): React.ReactElement<RowActionsItemProps<MenuItemComponent>> {
    const { level, closeAllMenus } = React.useContext(RowActionsMenuContext);

    if (level === 1) {
        return (
            <RowActionsIconItem
                icon={icon}
                disabled={disabled}
                tooltip={children}
                onClick={onClick}
                componentsProps={{ iconButton: componentsProps?.iconButton, tooltip: componentsProps?.tooltip }}
            />
        );
    }

    return (
        <RowActionsListItem<MenuItemComponent>
            icon={icon}
            disabled={disabled}
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
}
