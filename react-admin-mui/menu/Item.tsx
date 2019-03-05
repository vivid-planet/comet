import { Icon, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { ListItemProps } from "@material-ui/core/ListItem";
import { MenuContext } from "@vivid-planet/react-admin-mui";
import { IMenuLevel } from "@vivid-planet/react-admin-mui/menu/CollapsibleItem";
import * as React from "react";
import * as sc from "./Item.sc";

export interface IMenuItemProps extends IMenuLevel {
    text: string;
    icon?: React.ReactElement;
    secondaryAction?: React.ReactNode;
    enableMargin?: boolean;
}

type MuiListItemProps = Pick<ListItemProps, Exclude<keyof ListItemProps, "innerRef">>;

const Item: React.FunctionComponent<IMenuItemProps & MuiListItemProps> = ({ text, icon, level, secondaryAction, ...otherProps }) => {
    const context = React.useContext(MenuContext);
    if (!context) throw new Error("Could not find context for menu");

    if (!icon && !context.open) icon = <Icon>{text.substr(0, 1).toUpperCase()}</Icon>;
    if (level === undefined) level = 1;

    return (
        <sc.ListItem level={level} menuOpen={context.open} button {...otherProps}>
            {!!icon && <sc.ListItemIcon selected={otherProps.selected}>{icon}</sc.ListItemIcon>}
            <sc.ListItemText level={level} selected={otherProps.selected} primary={text} inset={!icon} />
            {!!secondaryAction && context.open && (
                <sc.ListItemSecondaryAction selected={otherProps.selected}>{secondaryAction}</sc.ListItemSecondaryAction>
            )}
        </sc.ListItem>
    );
};

export default Item;
