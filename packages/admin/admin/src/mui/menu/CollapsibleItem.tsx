import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { Collapse, ComponentsOverrides, Fade, List, Menu, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { matchPath, useLocation } from "react-router";

import { MenuItem, MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export type MenuCollapsibleItemClassKey = "root" | "childSelected" | "listItem" | "open" | "itemTitle";

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
        itemTitle: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: 12,
            padding: "15px 15px 20px 15px",
            lineHeight: "16px",
            color: theme.palette.grey[500],
        },
        listItem: {},
        open: {},
    });

export interface MenuLevel {
    level?: 1 | 2 | 3;
}

export type MenuChild = React.ReactElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>;

export interface MenuCollapsibleItemProps extends MenuItemProps {
    children: MenuChild | MenuChild[];
    openByDefault?: boolean;
    openedIcon?: React.ReactNode;
    closedIcon?: React.ReactNode;
    isMenuOpen?: boolean;
}

const CollapsibleItem: React.FC<WithStyles<typeof styles> & MenuCollapsibleItemProps> = ({
    classes,
    level,
    primary,
    secondary,
    showText = true,
    isMenuOpen,
    icon,
    openByDefault = false,
    openedIcon,
    closedIcon,
    children,
    ...otherProps
}) => {
    openedIcon = openedIcon || (isMenuOpen ? <ChevronUp /> : <ChevronRight fontSize="small" />);
    closedIcon = closedIcon || (isMenuOpen ? <ChevronDown /> : <ChevronRight fontSize="small" />);

    const itemLevel: MenuLevel["level"] = level ? level : 1;
    let hasSelectedChild = false;
    const location = useLocation();

    React.useEffect(() => {
        // set open state manually to false to avoid a menu opening when isMenuOpen state changes
        if (!isMenuOpen) setOpen(false);
    }, [isMenuOpen]);

    const childElements = React.Children.map(children, (child: MenuChild) => {
        if ("to" in child.props && matchPath(location.pathname, { path: child.props.to, strict: true })) {
            hasSelectedChild = true;
        }

        const newItemLevel = itemLevel + 1;

        return React.cloneElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>(child, {
            level: newItemLevel === 1 || newItemLevel === 2 || newItemLevel === 3 ? newItemLevel : undefined,
            isMenuOpen,
        });
    });

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (isMenuOpen) return;
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
            setOpen(true);
        }
    };

    const closeMenu = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    const handlePopoverClose = (e: React.MouseEvent<HTMLElement>) => {
        if (isMenuOpen) return;
        const el = e.target as HTMLElement;
        const rect = el.getBoundingClientRect();
        const { clientX, clientY } = e;

        if (childElements?.length && clientX + 2 > rect.right && clientY > rect.top && clientY < rect.bottom) return;

        closeMenu();
    };

    const [open, setOpen] = React.useState<boolean>(openByDefault || hasSelectedChild);

    const listClasses = [classes.root];
    if (hasSelectedChild) listClasses.push(classes.childSelected);
    if (open) listClasses.push(classes.open);

    return (
        <div {...otherProps} className={listClasses.join(" ")}>
            <div
                id="menu-item"
                className={classes.listItem}
                aria-haspopup="true"
                aria-controls={open ? "mouse-over-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                onMouseOver={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <MenuItem
                    primary={primary}
                    showText={isMenuOpen ? showText : level === 2 || level === 3}
                    secondary={secondary}
                    hasChildElements={!!childElements?.length}
                    isCollapsibleOpen={open}
                    isMenuOpen={isMenuOpen}
                    icon={icon}
                    level={level}
                    onClick={() => setOpen(!open)}
                    secondaryAction={open ? openedIcon : closedIcon}
                />
            </div>
            {isMenuOpen ? (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List disablePadding>{childElements}</List>
                </Collapse>
            ) : (
                <Menu
                    id="mouse-over-menu"
                    MenuListProps={{
                        "aria-labelledby": "menu-item",
                        onMouseLeave: closeMenu,
                        style: { pointerEvents: "auto" },
                    }}
                    sx={{
                        pointerEvents: "none",
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    TransitionComponent={Fade}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "center",
                        horizontal: "left",
                    }}
                    onClose={handlePopoverClose}
                >
                    <List disablePadding>
                        {itemLevel === 1 && (
                            <Typography className={classes.itemTitle} variant="h3">
                                {primary}
                            </Typography>
                        )}
                        {childElements}
                    </List>
                </Menu>
            )}
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
