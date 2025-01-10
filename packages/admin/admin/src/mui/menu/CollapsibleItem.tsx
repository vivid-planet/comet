import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { Collapse, ComponentsOverrides, Fade, List, Menu, Theme, Typography, useThemeProps } from "@mui/material";
import { Children, cloneElement, MouseEvent, ReactElement, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { matchPath, useLocation } from "react-router";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { CollapsibleIndicator, ItemTitle, MenuCollapsibleItemClassKey, MenuItem, OwnerState, Root } from "./CollapsibleItem.styles";
import { MenuContext } from "./Context";
import { MenuItem as CometMenuItem, MenuItemLevel, MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export type MenuChild = ReactElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>;

export interface MenuCollapsibleItemProps
    extends Omit<MenuItemProps, "slotProps">,
        ThemedComponentBaseProps<{
            root: "div";
            menuItem: typeof CometMenuItem;
            itemTitle: typeof Typography;
            collapsibleIndicator: "div";
        }> {
    children: MenuChild | MenuChild[];
    openByDefault?: boolean;
    isMenuOpen?: boolean;
    iconMapping?: {
        openDropdown?: ReactNode;
        closeDropdown?: ReactNode;
        firstLevelHoverIndicator?: ReactNode;
        secondLevelHoverIndicator?: ReactNode;
    };
}

export const MenuCollapsibleItem = (inProps: MenuCollapsibleItemProps) => {
    const {
        classes,
        level = 1,
        primary,
        secondary,
        isMenuOpen,
        icon,
        openByDefault,
        children,
        slotProps,
        iconMapping,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminMenuCollapsibleItem",
    });

    const {
        openDropdown: openDropdownIcon = <ChevronDown color="inherit" fontSize="inherit" />,
        closeDropdown: closeDropdownIcon = <ChevronUp color="inherit" fontSize="inherit" />,
        firstLevelHoverIndicator: firstLevelHoverIndicatorIcon = <ChevronRight color="inherit" fontSize="inherit" />,
        secondLevelHoverIndicator: secondLevelHoverIndicatorIcon = <ChevronRight color="inherit" fontSize="inherit" />,
    } = iconMapping ?? {};

    const { drawerVariant } = useContext(MenuContext);
    const itemLevel: MenuItemLevel = level ?? 1;
    const hasSelectedChild = useRef(false);
    const location = useLocation();

    const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(openByDefault || hasSelectedChild.current);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // set open state manually to false to avoid a menu opening when isMenuOpen state changes
        if (!isMenuOpen) setIsSubmenuOpen(false);
    }, [isMenuOpen]);

    const childElements = useMemo(() => {
        function checkIfPathInLocation(child: ReactElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>) {
            return "to" in child.props && matchPath(location.pathname, { path: child.props.to, strict: true });
        }
        hasSelectedChild.current = false;

        return Children.map(children, (child: MenuChild) => {
            // child is selected
            if (checkIfPathInLocation(child)) {
                hasSelectedChild.current = true;
                setIsSubmenuOpen(true);
            }

            // sub child is selected
            const subChildElements =
                "children" in child.props ? Children.map(child?.props?.children, (child: MenuChild) => child) : ([] as MenuChild[]);
            if (subChildElements?.some((child: MenuChild) => child.props && checkIfPathInLocation(child))) {
                hasSelectedChild.current = true;
                setIsSubmenuOpen(true);
            }

            const newItemLevel = itemLevel + 1;

            return cloneElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>(child, {
                level: newItemLevel === 1 || newItemLevel === 2 || newItemLevel === 3 ? newItemLevel : undefined,
                isMenuOpen,
                isCollapsibleOpen: isSubmenuOpen,
            });
        });
    }, [children, isMenuOpen, isSubmenuOpen, itemLevel, location.pathname]);

    const closeMenu = () => {
        setAnchorEl(null);
        setIsSubmenuOpen(false);
    };

    const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
        if (isMenuOpen) return;
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
            setIsSubmenuOpen(true);
        }
    };

    const handlePopoverClose = (e: MouseEvent<HTMLElement>) => {
        if (isMenuOpen) return;
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const { clientX, clientY } = e;

        if (childElements?.length && clientX + 2 > rect.right && clientY > rect.top && clientY < rect.bottom) return;

        closeMenu();
    };

    let itemId,
        mouseOverMenuId = undefined;
    if (typeof primary === "string") {
        itemId = `menu-item-${primary?.replace(/\s/g, "-").toLowerCase()}`;
        mouseOverMenuId = `item-hover-menu-${primary?.replace(/\s/g, "-").toLowerCase()}`;
    }

    const ownerState: OwnerState = {
        childSelected: hasSelectedChild.current,
        open: isSubmenuOpen,
        menuOpen: Boolean(isMenuOpen),
        subMenuOpen: Boolean(isSubmenuOpen),
        level: itemLevel,
        variant: drawerVariant,
    };

    let collapsibleIndicatorIcon: ReactNode = null;

    if (isMenuOpen) {
        if (isSubmenuOpen) {
            collapsibleIndicatorIcon = closeDropdownIcon;
        } else {
            collapsibleIndicatorIcon = openDropdownIcon;
        }
    } else {
        if (level === 1) {
            collapsibleIndicatorIcon = firstLevelHoverIndicatorIcon;
        } else if (level === 2) {
            collapsibleIndicatorIcon = secondLevelHoverIndicatorIcon;
        }
    }

    return (
        <Root {...slotProps?.root} {...restProps} ownerState={ownerState}>
            <MenuItem
                id={itemId}
                aria-haspopup="true"
                aria-controls={isSubmenuOpen ? mouseOverMenuId : undefined}
                aria-expanded={isSubmenuOpen ? "true" : undefined}
                onMouseOver={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                primary={primary}
                secondary={secondary}
                hasSubitems={!!childElements?.length}
                isCollapsibleOpen={isSubmenuOpen}
                isMenuOpen={isMenuOpen}
                icon={icon}
                level={level}
                onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                secondaryAction={<CollapsibleIndicator ownerState={ownerState}>{collapsibleIndicatorIcon}</CollapsibleIndicator>}
                ownerState={ownerState}
                {...slotProps?.menuItem}
            />
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
                    open={isSubmenuOpen && anchorEl !== null}
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
                    {itemLevel === 1 && <ItemTitle>{primary}</ItemTitle>}
                    {childElements}
                </Menu>
            ) : (
                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>{childElements}</List>
                </Collapse>
            )}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenuCollapsibleItem: MenuCollapsibleItemClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMenuCollapsibleItem: MenuCollapsibleItemProps;
    }

    interface Components {
        CometAdminMenuCollapsibleItem?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMenuCollapsibleItem"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuCollapsibleItem"];
        };
    }
}
