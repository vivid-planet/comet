import { Icon, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Theme } from "@material-ui/core";
import { ListItemProps } from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/styles";
import { IMenuContext, MenuContext } from "@vivid-planet/react-admin-mui";
import { IMenuLevel } from "@vivid-planet/react-admin-mui/menu/CollapsibleItem";
import * as React from "react";

export interface IMenuItemProps extends IMenuLevel {
    text: string;
    icon?: React.ReactElement;
    secondaryAction?: React.ReactNode;
}

interface IMenuItemStyleProps {
    level: number;
    menuOpen: boolean;
}

// @ts-ignore
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingLeft: ({ level, menuOpen }: IMenuItemStyleProps) => theme.spacing.unit * 2 * (menuOpen ? level : 1),
    },
}));

const Item: React.FunctionComponent<IMenuItemProps & ListItemProps> = ({ text, icon, level, secondaryAction, ...otherProps }) => {
    const context = React.useContext(MenuContext);
    if (!context) throw new Error("Could not find context for menu");

    const classes = useStyles({
        level: level !== undefined ? level : 1,
        menuOpen: context.open,
    });
    if (!icon && !context.open) icon = <Icon>{text.substr(0, 1).toUpperCase()}</Icon>;

    return (
        <ListItem className={classes.root} button {...otherProps}>
            {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={text} primaryTypographyProps={{ noWrap: true }} inset={!icon} />
            {!!secondaryAction && context.open && <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>}
        </ListItem>
    );
};

export default Item;
