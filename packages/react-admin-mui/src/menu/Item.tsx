import { ListItemProps } from "@material-ui/core/ListItem";
import { ListItemIconProps } from "@material-ui/core/ListItemIcon";
import { ListItemTextProps } from "@material-ui/core/ListItemText";
import * as React from "react";
import { IMenuLevel, MenuContext } from "./index";
import * as sc from "./Item.sc";

export interface IMenuItemSelected {
    selected?: boolean;
}

export interface IMenuItemTextProps extends IMenuItemSelected {
    level: number;
}

export interface IListItemProps {
    level: number;
    hasIcon: boolean;
    menuOpen: boolean;
    enableMargin?: boolean;
}

export interface IMenuItemProps extends IMenuLevel {
    text: string;
    icon?: React.ReactElement;
    secondaryAction?: React.ReactNode;
    enableMargin?: boolean;
    listItemTextComponent?: React.ComponentType<IMenuItemTextProps & ListItemTextProps>;
    listItemIconComponent?: React.ComponentType<IMenuItemSelected & ListItemIconProps>;
    listItemComponent?: React.ComponentType<IListItemProps>;
}

type MuiListItemProps = Pick<ListItemProps, Exclude<keyof ListItemProps, "innerRef">>;

export const MenuItem: React.FunctionComponent<IMenuItemProps & MuiListItemProps> = ({
    text,
    icon,
    level,
    secondaryAction,
    listItemTextComponent: ListItemText = sc.DefaultListItemText,
    listItemIconComponent: ListItemIcon = sc.DefaultListItemIcon,
    listItemComponent: ListItem = sc.DefaultListItem,
    ...otherProps
}) => {
    const context = React.useContext(MenuContext);
    if (!context) throw new Error("Could not find context for menu");
    const hasIcon = !!icon;

    if (!icon && !context.open) icon = <sc.TextIcon selected={otherProps.selected}>{text.substr(0, 1).toUpperCase()}</sc.TextIcon>;
    if (level === undefined) level = 1;

    return (
        <ListItem level={level} hasIcon={hasIcon} menuOpen={context.open} button {...otherProps}>
            {!!icon && <ListItemIcon selected={otherProps.selected}>{icon}</ListItemIcon>}
            <ListItemText level={level} selected={otherProps.selected} primary={text} inset={!icon} />
            {!!secondaryAction && context.open && (
                <sc.ListItemSecondaryAction selected={otherProps.selected}>{secondaryAction}</sc.ListItemSecondaryAction>
            )}
        </ListItem>
    );
};
