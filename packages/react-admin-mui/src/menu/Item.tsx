import { ListItemProps } from "@material-ui/core/ListItem";
import * as React from "react";
import { IMenuLevel, MenuContext } from "./index";
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
    const hasIcon = !!icon;

    if (!icon && !context.open) icon = <sc.TextIcon selected={otherProps.selected}>{text.substr(0, 1).toUpperCase()}</sc.TextIcon>;
    if (level === undefined) level = 1;

    return (
        <sc.ListItem level={level} hasIcon={hasIcon} menuOpen={context.open} button {...otherProps}>
            {!!icon && <sc.ListItemIcon selected={otherProps.selected}>{icon}</sc.ListItemIcon>}
            <sc.ListItemText level={level} selected={otherProps.selected} primary={text} inset={!icon} />
            {!!secondaryAction && context.open && (
                <sc.ListItemSecondaryAction selected={otherProps.selected}>{secondaryAction}</sc.ListItemSecondaryAction>
            )}
        </sc.ListItem>
    );
};

export default Item;
