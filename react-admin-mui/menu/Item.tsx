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
}

type MuiListItemProps = Pick<ListItemProps, Exclude<keyof ListItemProps, "innerRef">>;

const Item: React.FunctionComponent<IMenuItemProps & MuiListItemProps> = ({ text, icon, level, secondaryAction, ...otherProps }) => {
    const context = React.useContext(MenuContext);
    if (!context) throw new Error("Could not find context for menu");

    if (!icon && !context.open) icon = <Icon>{text.substr(0, 1).toUpperCase()}</Icon>;

    return (
        <sc.ListItem level={level !== undefined ? level : 1} menuOpen={context.open} button {...otherProps}>
            {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={text} primaryTypographyProps={{ noWrap: true }} inset={!icon} />
            {!!secondaryAction && context.open && <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>}
        </sc.ListItem>
    );
};

export default Item;
