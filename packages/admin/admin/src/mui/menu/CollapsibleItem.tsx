import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { Collapse, ComponentsOverrides, Fade, List, Menu, Theme, Typography } from "@mui/material";
import { MenuProps } from "@mui/material/Menu/Menu";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { matchPath, useLocation } from "react-router";

import { MenuCollapsibleItemClassKey, styles } from "./CollapsibleItem.styles";
import { MenuItem, MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export interface MenuLevel {
    level?: 1 | 2 | 3;
}

export type MenuChild = React.ReactElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>;

export interface MenuCollapsibleItemProps extends MenuItemProps {
    children: MenuChild | MenuChild[];
    openByDefault?: boolean;
    openedIcon?: React.JSXElementConstructor<SvgIconProps>;
    closedIcon?: React.JSXElementConstructor<SvgIconProps>;
    isMenuOpen?: boolean;
    collapsedMenuTransitionComponent?: MenuProps["TransitionComponent"];
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
    openedIcon: OpenedIcon,
    closedIcon: ClosedIcon,
    children,
    collapsedMenuTransitionComponent = Fade,
    ...otherProps
}) => {
    OpenedIcon = OpenedIcon || (isMenuOpen ? ChevronUp : ChevronRight);
    ClosedIcon = ClosedIcon || (isMenuOpen ? ChevronDown : ChevronRight);

    const itemLevel: MenuLevel["level"] = level ? level : 1;
    let hasSelectedChild = false;
    const location = useLocation();

    const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState<boolean>(openByDefault || hasSelectedChild);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        // set open state manually to false to avoid a menu opening when isMenuOpen state changes
        if (!isMenuOpen) setIsCollapsibleOpen(false);
    }, [isMenuOpen]);

    function checkIfPathInLocation(child: React.ReactElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>) {
        return "to" in child.props && matchPath(location.pathname, { path: child.props.to, strict: true });
    }

    const childElements = React.Children.map(children, (child: MenuChild) => {
        // child is selected
        if (checkIfPathInLocation(child)) {
            hasSelectedChild = true;
        }

        // sub child is selected
        const subChildElements =
            "children" in child.props ? React.Children.map(child?.props?.children, (child: MenuChild) => child) : ([] as MenuChild[]);
        if (subChildElements?.some((child: MenuChild) => child.props && checkIfPathInLocation(child))) {
            hasSelectedChild = true;
        }

        const newItemLevel = itemLevel + 1;

        return React.cloneElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>(child, {
            level: newItemLevel === 1 || newItemLevel === 2 || newItemLevel === 3 ? newItemLevel : undefined,
            isMenuOpen,
        });
    });

    const closeMenu = () => {
        setAnchorEl(null);
        setIsCollapsibleOpen(false);
    };

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (isMenuOpen) return;
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
            setIsCollapsibleOpen(true);
        }
    };

    const handlePopoverClose = (e: React.MouseEvent<HTMLElement>) => {
        if (isMenuOpen) return;
        const el = e.target as HTMLElement;
        const rect = el.getBoundingClientRect();
        const { clientX, clientY } = e;

        if (childElements?.length && clientX + 2 > rect.right && clientY > rect.top && clientY < rect.bottom) return;

        closeMenu();
    };

    const listClasses = [];
    if (hasSelectedChild) listClasses.push(classes.childSelected);
    if (isCollapsibleOpen) listClasses.push(classes.open);

    return (
        <div {...otherProps}>
            <div
                id="menu-item"
                className={classes.listItem}
                aria-haspopup="true"
                aria-controls={isCollapsibleOpen ? "mouse-over-menu" : undefined}
                aria-expanded={isCollapsibleOpen ? "true" : undefined}
                onMouseOver={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <MenuItem
                    primary={primary}
                    showText={isMenuOpen ? showText : itemLevel > 1}
                    secondary={secondary}
                    hasChildElements={!!childElements?.length}
                    isCollapsibleOpen={isCollapsibleOpen}
                    isMenuOpen={isMenuOpen}
                    icon={icon}
                    level={level}
                    onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
                    secondaryAction={
                        itemLevel === 1 && isCollapsibleOpen ? (
                            <OpenedIcon
                                className={`${classes.collapsibleIcon} ${
                                    !isMenuOpen && isCollapsibleOpen && itemLevel === 1 ? classes.colorWhite : classes.colorGrey
                                }`}
                            />
                        ) : (
                            <ClosedIcon
                                className={`${classes.collapsibleIcon} ${
                                    !isMenuOpen && isCollapsibleOpen && itemLevel === 1 ? classes.colorWhite : classes.colorGrey
                                }`}
                            />
                        )
                    }
                    className={listClasses.join(" ")}
                />
            </div>
            {isMenuOpen ? (
                <Collapse in={isCollapsibleOpen} timeout="auto" unmountOnExit>
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
                    open={isCollapsibleOpen}
                    anchorEl={anchorEl}
                    TransitionComponent={collapsedMenuTransitionComponent}
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
