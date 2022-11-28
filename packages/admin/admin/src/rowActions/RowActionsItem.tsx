import * as React from "react";

import { RowActionsIconItem, RowActionsIconItemComponentsProps, RowActionsIconItemProps } from "./RowActionsIconItem";
import { RowActionsListItem, RowActionsListItemComponentsProps, RowActionsListItemProps } from "./RowActionsListItem";
import { RowActionsMenuContext } from "./RowActionsMenu";

export interface CommonRowActionItemProps {
    icon?: React.ReactNode;
    text?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

export type RowActionsItemPropsComponentsProps = RowActionsIconItemComponentsProps & RowActionsListItemComponentsProps;

export interface RowActionsItemProps extends Omit<RowActionsIconItemProps, "componentsProps">, Omit<RowActionsListItemProps, "componentsProps"> {
    componentsProps?: RowActionsItemPropsComponentsProps;
}

export const RowActionsItem = ({ icon, text, onClick, componentsProps, ...restListItemProps }: RowActionsItemProps) => {
    const { level, closeAllMenus } = React.useContext(RowActionsMenuContext);

    if (level === 1) {
        return (
            <RowActionsIconItem
                icon={icon}
                text={text}
                onClick={onClick}
                componentsProps={{ iconButton: componentsProps?.iconButton, tooltip: componentsProps?.tooltip }}
            />
        );
    }

    return (
        <RowActionsListItem
            icon={icon}
            text={text}
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
        />
    );
};
