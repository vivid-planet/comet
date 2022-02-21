import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import { Collapse, ComponentsOverrides, List, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { matchPath, useLocation } from "react-router";

import { MenuItem, MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export type MenuCollapsibleItemClassKey = "root" | "childSelected" | "listItem" | "open";

const styles = (theme: Theme) =>
    createStyles<MenuCollapsibleItemClassKey, MenuCollapsibleItemProps>({
        root: {},
        childSelected: {
            color: theme.palette.primary.main,
            "& $listItem": {
                "& [class*='MuiListItemText-root']": {
                    color: theme.palette.primary.main,
                },
                "& [class*='MuiListItemIcon-root']": {
                    color: theme.palette.primary.main,
                },
            },
        },
        listItem: {},
        open: {},
    });

export interface MenuLevel {
    level?: 1 | 2;
}

type MenuChild = React.ReactElement<MenuItemRouterLinkProps>;

export interface MenuCollapsibleItemProps extends MenuItemProps {
    children: MenuChild | MenuChild[];
    openByDefault?: boolean;
    openedIcon?: React.ReactNode;
    closedIcon?: React.ReactNode;
}

const CollapsibleItem: React.FC<WithStyles<typeof styles> & MenuCollapsibleItemProps> = ({
    classes,
    level,
    primary,
    secondary,
    icon,
    openByDefault = false,
    openedIcon = <ChevronUp />,
    closedIcon = <ChevronDown />,
    children,
    ...otherProps
}) => {
    const itemLevel: 1 | 2 = level ? level : 1;
    let hasSelectedChild: boolean = false;
    const location = useLocation();

    const childElements = React.Children.map(children, (child: MenuChild) => {
        if (matchPath(location.pathname, { path: child.props.to, strict: true })) {
            hasSelectedChild = true;
        }

        const newItemLevel = itemLevel + 1;

        return React.cloneElement<MenuLevel>(child, {
            level: newItemLevel === 1 || newItemLevel === 2 ? newItemLevel : undefined,
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
                <List disablePadding>{childElements}</List>
            </Collapse>
        </div>
    );
};

export const MenuCollapsibleItem = withStyles(styles, { name: "CometAdminMenuCollapsibleItem" })(CollapsibleItem);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenuCollapsibleItem: MenuCollapsibleItemClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMenuCollapsibleItem: MenuCollapsibleItemProps;
    }

    interface Components {
        CometAdminMenuCollapsibleItem?: {
            defaultProps?: ComponentsPropsList["CometAdminMenuCollapsibleItem"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuCollapsibleItem"];
        };
    }
}
