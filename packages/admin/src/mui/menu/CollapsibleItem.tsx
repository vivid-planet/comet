import { Collapse, List } from "@material-ui/core";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { matchPath, useLocation } from "react-router";

import { MenuItem, MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export type CometAdminMenuCollapsibleItemClassKeys = "root" | "childSelected" | "listItem" | "open";

const styles = () =>
    createStyles<CometAdminMenuCollapsibleItemClassKeys, any>({
        root: {},
        childSelected: {},
        listItem: {},
        open: {},
    });

export interface MenuLevel {
    level?: 1 | 2;
}

type MenuChild = React.ReactElement<MenuItemRouterLinkProps>;

interface MenuCollapsibleItemProps extends MenuItemProps {
    children: MenuChild[];
}

export interface MenuCollapsibleItemThemeProps {
    openByDefault?: boolean;
    openedIcon?: React.ReactNode;
    closedIcon?: React.ReactNode;
}

const CollapsibleItem: React.FC<WithStyles<typeof styles> & MenuCollapsibleItemThemeProps & MenuCollapsibleItemProps> = ({
    classes,
    theme,
    level,
    primary,
    secondary,
    icon,
    openByDefault = false,
    openedIcon = <ArrowUpIcon />,
    closedIcon = <ArrowDownIcon />,
    children,
    ...otherProps
}) => {
    if (!level) level = 1;
    let hasSelectedChild: boolean = false;
    const location = useLocation();

    const childElements = React.Children.map(children, (child: MenuChild) => {
        if (matchPath(location.pathname, { path: child.props.to, strict: true })) {
            hasSelectedChild = true;
        }

        return React.cloneElement<MenuLevel>(child, {
            level: level + 1,
        });
    });

    const [open, setOpen] = React.useState<boolean>(openByDefault || hasSelectedChild);

    const listClasses = [classes.root];
    if (hasSelectedChild) listClasses.push(classes.childSelected);
    if (open) listClasses.push(classes.open);

    return (
        <div {...otherProps} className={listClasses.join(" ")}>
            <div className={classes.listItem}>
                <MenuItem
                    primary={primary}
                    secondary={secondary}
                    icon={icon}
                    level={level}
                    onClick={() => setOpen(!open)}
                    secondaryAction={open ? openedIcon : closedIcon}
                />
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List>{childElements}</List>
            </Collapse>
        </div>
    );
};

export const MenuCollapsibleItem = withStyles(styles, { name: "CometAdminMenuCollapsibleItem", withTheme: true })(CollapsibleItem);
