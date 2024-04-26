import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { Collapse, ComponentsOverrides, Fade, List, Menu, SvgIconProps, Theme, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { useMemo, useRef } from "react";
import { matchPath, useLocation } from "react-router";

import { MenuCollapsibleItemClassKey, styles } from "./CollapsibleItem.styles";
import { MenuContext } from "./Context";
import { MenuItem, MenuItemLevel, MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export type MenuChild = React.ReactElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>;

export interface MenuCollapsibleItemProps extends MenuItemProps {
    children: MenuChild | MenuChild[];
    openByDefault?: boolean;
    openedIcon?: React.JSXElementConstructor<SvgIconProps>;
    closedIcon?: React.JSXElementConstructor<SvgIconProps>;
    isMenuOpen?: boolean;
}

const CollapsibleItem: React.FC<WithStyles<typeof styles> & MenuCollapsibleItemProps> = ({
    classes,
    level,
    primary,
    secondary,
    isMenuOpen,
    icon,
    openByDefault = false,
    openedIcon: OpenedIcon,
    closedIcon: ClosedIcon,
    children,
    ...otherProps
}) => {
    OpenedIcon = OpenedIcon || (isMenuOpen ? ChevronUp : ChevronRight);
    ClosedIcon = ClosedIcon || (isMenuOpen ? ChevronDown : ChevronRight);

    const { drawerVariant } = React.useContext(MenuContext);
    const itemLevel: MenuItemLevel = level ?? 1;
    const hasSelectedChild = useRef(false);
    const location = useLocation();

    const [isSubmenuOpen, setIsSubmenuOpen] = React.useState<boolean>(openByDefault || hasSelectedChild.current);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | undefined>(undefined);

    React.useEffect(() => {
        // set open state manually to false to avoid a menu opening when isMenuOpen state changes
        if (!isMenuOpen) setIsSubmenuOpen(false);
    }, [isMenuOpen]);

    const childElements = useMemo(() => {
        function checkIfPathInLocation(child: React.ReactElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>) {
            return "to" in child.props && matchPath(location.pathname, { path: child.props.to, strict: true });
        }
        hasSelectedChild.current = false;

        return React.Children.map(children, (child: MenuChild) => {
            // child is selected
            if (checkIfPathInLocation(child)) {
                hasSelectedChild.current = true;
            }

            // sub child is selected
            const subChildElements =
                "children" in child.props ? React.Children.map(child?.props?.children, (child: MenuChild) => child) : ([] as MenuChild[]);
            if (subChildElements?.some((child: MenuChild) => child.props && checkIfPathInLocation(child))) {
                hasSelectedChild.current = true;
            }

            const newItemLevel = itemLevel + 1;

            return React.cloneElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>(child, {
                level: newItemLevel === 1 || newItemLevel === 2 || newItemLevel === 3 ? newItemLevel : undefined,
                isMenuOpen,
                isCollapsibleOpen: isSubmenuOpen,
            });
        });
    }, [children, isMenuOpen, isSubmenuOpen, itemLevel, location.pathname]);

    const closeMenu = () => {
        setAnchorEl(undefined);
        setIsSubmenuOpen(false);
    };

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (isMenuOpen) return;
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
            setIsSubmenuOpen(true);
        }
    };

    const handlePopoverClose = (e: React.MouseEvent<HTMLElement>) => {
        if (isMenuOpen) return;
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const { clientX, clientY } = e;

        if (childElements?.length && clientX + 2 > rect.right && clientY > rect.top && clientY < rect.bottom) return;

        closeMenu();
    };

    const listClasses = [classes.root];
    if (hasSelectedChild.current) listClasses.push(classes.childSelected);
    if (isSubmenuOpen) listClasses.push(classes.open);

    let itemId,
        mouseOverMenuId = undefined;
    if (typeof primary === "string") {
        itemId = `menu-item-${primary?.replace(/\s/g, "-").toLowerCase()}`;
        mouseOverMenuId = `item-hover-menu-${primary?.replace(/\s/g, "-").toLowerCase()}`;
    }

    return (
        <div {...otherProps} className={listClasses.join(" ")}>
            <div
                id={itemId}
                className={classes.listItem}
                aria-haspopup="true"
                aria-controls={isSubmenuOpen ? mouseOverMenuId : undefined}
                aria-expanded={isSubmenuOpen ? "true" : undefined}
                onMouseOver={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <MenuItem
                    primary={primary}
                    secondary={secondary}
                    hasSubitems={!!childElements?.length}
                    isCollapsibleOpen={isSubmenuOpen}
                    isMenuOpen={isMenuOpen}
                    icon={icon}
                    level={level}
                    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                    secondaryAction={
                        itemLevel === 1 && isSubmenuOpen ? (
                            <OpenedIcon
                                className={`${classes.collapsibleIcon} ${
                                    !isMenuOpen && isSubmenuOpen && itemLevel === 1
                                        ? classes.collapsibleIconColorWhite
                                        : classes.collapsibleIconColorGrey
                                }`}
                            />
                        ) : (
                            <ClosedIcon
                                className={`${classes.collapsibleIcon} ${
                                    !isMenuOpen && isSubmenuOpen && itemLevel === 1
                                        ? classes.collapsibleIconColorWhite
                                        : classes.collapsibleIconColorGrey
                                }`}
                            />
                        )
                    }
                />
            </div>
            {!isMenuOpen && drawerVariant === "permanent" ? (
                <Menu
                    id={mouseOverMenuId}
                    MenuListProps={{
                        "aria-labelledby": itemId,
                        onMouseLeave: closeMenu,
                        style: { pointerEvents: "auto", paddingBottom: itemLevel == 1 ? 10 : undefined },
                        disablePadding: itemLevel !== 2,
                    }}
                    sx={{
                        pointerEvents: "none",
                    }}
                    open={isSubmenuOpen}
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
                    {itemLevel === 1 && (
                        <Typography className={classes.itemTitle} variant="h3">
                            {primary}
                        </Typography>
                    )}
                    {childElements}
                </Menu>
            ) : (
                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>{childElements}</List>
                </Collapse>
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
