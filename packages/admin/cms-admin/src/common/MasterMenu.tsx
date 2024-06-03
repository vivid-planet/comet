import {
    Menu,
    MenuCollapsibleItem,
    MenuCollapsibleItemProps,
    MenuContext,
    MenuItemAnchorLink,
    MenuItemAnchorLinkProps,
    MenuItemGroup,
    MenuItemGroupProps,
    MenuItemRouterLink,
    MenuItemRouterLinkProps,
    useWindowSize,
} from "@comet/admin";
import * as React from "react";
import { RouteProps, useRouteMatch } from "react-router-dom";

import { useUserPermissionCheck } from "../userPermissions/hooks/currentUser";

type MasterMenuItemBase = {
    requiredPermission?: string;
};

type MasterMenuItemRoute = MasterMenuItemBase &
    Omit<MenuItemRouterLinkProps, "to"> & {
        type: "route";
        route?: RouteProps;
        to?: string;
    };

type MasterMenuItemCollapsible = MasterMenuItemBase &
    Omit<MenuCollapsibleItemProps, "children"> & {
        type: "collapsible";
        items?: Array<MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemCollapsible>;
        route?: RouteProps;
    };

type MasterMenuItemAnchor = MasterMenuItemBase &
    MenuItemAnchorLinkProps & {
        type: "anchor";
    };

type MasterMenuItemGroup = MasterMenuItemBase &
    MenuItemGroupProps & {
        type: "group";
        items: Array<MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemCollapsible>;
    };

export type MasterMenuItem = MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemCollapsible | MasterMenuItemGroup;

export type MasterMenuData = MasterMenuItem[];

type MenuItemRouteElement = {
    type: "route";
    menuElement: MenuItemRouterLinkProps;
};

type MenuCollapsibleElement = {
    type: "collapsible";
    menuElement: Omit<MenuCollapsibleItemProps, "children">;
    items: MenuItem[];
};

type MenuItemAnchorElement = {
    type: "anchor";
    menuElement: MenuItemAnchorLinkProps;
};

type MenuItemGroupElement = {
    type: "group";
    menuElement: MenuItemGroupProps;
    items: MenuItem[];
};

type MenuItem = MenuItemRouteElement | MenuItemAnchorElement | MenuCollapsibleElement | MenuItemGroupElement;

export interface MasterMenuProps {
    permanentMenuMinWidth?: number;
    menu: MasterMenuData;
}

export function isMenuItemGroup(item: MenuItem): item is MenuItemGroupElement {
    return item.type === "group";
}
export function isMenuItemAnchor(item: MenuItem): item is MenuItemAnchorElement {
    return item.type === "anchor";
}

export function isMenuItemRoute(item: MenuItem): item is MenuItemRouteElement {
    return item.type === "route";
}

export function isMenuItemCollapsible(item: MenuItem): item is MenuCollapsibleElement {
    return item.type === "collapsible";
}

export function useMenuFromMasterMenuData(items: MasterMenuData): MenuItem[] {
    const isAllowed = useUserPermissionCheck();
    const checkPermission = (item: MasterMenuItem): boolean => !item.requiredPermission || isAllowed(item.requiredPermission);

    const mapFn = (item: MasterMenuItem): MenuItem => {
        if (item.type === "anchor") {
            return { type: "anchor", menuElement: item };
        }

        if (item.type === "group") {
            const { items, ...menuElement } = item;
            return {
                type: "group",
                menuElement,
                items: items.filter(checkPermission).map(mapFn),
            };
        }

        if (item.type === "collapsible") {
            const { route, items, ...menuElement } = item;
            return {
                type: "collapsible",
                menuElement,
                items: items ? items.filter(checkPermission).map(mapFn) : [],
            };
        }

        const { route, to, ...menuItem } = item;
        return {
            type: "route",
            menuElement: {
                ...menuItem,
                to: to ?? route?.path?.toString() ?? "",
            },
        };
    };
    return items.filter(checkPermission).map(mapFn);
}

export const MasterMenu: React.FC<MasterMenuProps> = ({ menu, permanentMenuMinWidth = 1024 }) => {
    const menuItems = useMenuFromMasterMenuData(menu);
    const { open, toggleOpen } = React.useContext(MenuContext);
    const windowSize = useWindowSize();
    const match = useRouteMatch();
    const useTemporaryMenu: boolean = windowSize.width < permanentMenuMinWidth;

    // Open menu when changing to permanent variant and close when changing to temporary variant.
    React.useEffect(() => {
        if ((useTemporaryMenu && open) || (!useTemporaryMenu && !open)) {
            toggleOpen();
        }
        // useEffect dependencies must only include `location`, because the function should only be called once after changing the location.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const renderSubmenuItems = (items: MenuCollapsibleElement["items"]) =>
        items.flatMap((item, index) => {
            if (isMenuItemCollapsible(item)) {
                return (
                    <MenuCollapsibleItem key={index} {...item.menuElement}>
                        {renderSubmenuItems(item.items)}
                    </MenuCollapsibleItem>
                );
            } else if (isMenuItemAnchor(item)) {
                return <MenuItemAnchorLink key={index} {...item.menuElement} />;
            } else if (isMenuItemRoute(item)) {
                return <MenuItemRouterLink key={index} {...item.menuElement} to={`${match.url}${item.menuElement.to}`} />;
            }
            return [];
        });

    const renderGroupItems = (items: MenuItemGroupElement["items"]) =>
        items.flatMap((groupItem, index) => {
            if (isMenuItemCollapsible(groupItem) && !!groupItem.items.length) {
                return (
                    <MenuCollapsibleItem key={index} {...groupItem.menuElement}>
                        {renderSubmenuItems(groupItem.items)}
                    </MenuCollapsibleItem>
                );
            } else if (isMenuItemRoute(groupItem)) {
                return <MenuItemRouterLink key={index} {...groupItem.menuElement} to={`${match.url}${groupItem.menuElement.to}`} />;
            } else if (isMenuItemAnchor(groupItem)) {
                return <MenuItemAnchorLink key={index} {...groupItem.menuElement} />;
            }
            return [];
        });

    return (
        <Menu variant={useTemporaryMenu ? "temporary" : "permanent"}>
            {menuItems.map((menuElement, index) => {
                switch (menuElement.type) {
                    case "group":
                        return (
                            <MenuItemGroup key={index} {...menuElement.menuElement}>
                                {renderGroupItems(menuElement.items)}
                            </MenuItemGroup>
                        );
                    case "collapsible":
                        return (
                            <MenuCollapsibleItem key={index} {...menuElement.menuElement}>
                                {renderSubmenuItems(menuElement.items)}
                            </MenuCollapsibleItem>
                        );
                    case "anchor":
                        return <MenuItemAnchorLink key={index} {...menuElement.menuElement} />;
                    case "route":
                        return <MenuItemRouterLink key={index} {...menuElement.menuElement} to={`${match.url}${menuElement.menuElement.to}`} />;
                }
            })}
        </Menu>
    );
};
