import {
    Menu,
    MenuCollapsibleItem,
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
import { match } from "react-router";
import { RouteProps, useRouteMatch } from "react-router-dom";

import { useUserPermissionCheck } from "../userPermissions/hooks/currentUser";

type MasterMenuItemRoute = Omit<MenuItemRouterLinkProps, "to"> & {
    requiredPermission?: string;
    route?: RouteProps;
    to?: string;
    submenu?: MasterMenuElement[];
};

type MasterMenuItemAnchor = MenuItemAnchorLinkProps & {
    requiredPermission?: string;
};

type MasterMenuItemGroup = MenuItemGroupProps & {
    requiredPermission?: string;
    groupItems: MasterMenuItem[];
};

export type MasterMenuItem = MasterMenuItemRoute | MasterMenuItemAnchor;

export type MasterMenuElement = MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemGroup;

export type MasterMenuData = MasterMenuElement[];

type MenuItemRouteElement = {
    menuElement: MenuItemRouterLinkProps;
    hasSubmenu: boolean;
    submenu: MenuItem[];
};

type MenuItemAnchorElement = {
    menuElement: MenuItemAnchorLinkProps;
};

type MenuItemGroupElement = {
    menuElement: MenuItemGroupProps;
    isGroup: boolean;
    groupItems: MenuItem[];
};

type MenuItem = MenuItemRouteElement | MenuItemAnchorElement | MenuItemGroupElement;

export interface MasterMenuProps {
    permanentMenuMinWidth?: number;
    menu: MasterMenuData;
}

export function isMasterMenuItemGroup(item: MasterMenuElement): item is MasterMenuItemGroup {
    return !!item && "groupItems" in item;
}

export function isMasterMenuItemAnchor(item: MasterMenuElement): item is MasterMenuItemAnchor {
    return !!item && "href" in item;
}

export function isMenuItemGroupElement(item: MenuItem): item is MenuItemGroupElement {
    return !!item && "groupItems" in item && "isGroup" in item;
}
function isMenuItemAnchor(item: MenuItem): item is MenuItemAnchorElement {
    return !!item.menuElement && "href" in item.menuElement;
}

function isMenuItemRoute(item: MenuItem): item is MenuItemRouteElement {
    return !!item && "hasSubmenu" in item && "submenu" in item;
}

export function useMenuFromMasterMenuData(items: MasterMenuData): MenuItem[] {
    const isAllowed = useUserPermissionCheck();
    const checkPermission = (item: MasterMenuElement): boolean => !item.requiredPermission || isAllowed(item.requiredPermission);

    const mapFn = (item: MasterMenuElement): MenuItem => {
        if (isMasterMenuItemAnchor(item)) {
            return { menuElement: item };
        }

        if (isMasterMenuItemGroup(item)) {
            const { groupItems, ...menuElement } = item;
            return {
                menuElement,
                isGroup: true,
                groupItems: groupItems.filter(checkPermission).map(mapFn),
            };
        }

        const { route, submenu, to, ...menuItem } = item;
        return {
            menuElement: {
                ...menuItem,
                to: to ?? route?.path?.toString() ?? "",
            },
            hasSubmenu: !!submenu?.length,
            submenu: submenu ? submenu.filter(checkPermission).map(mapFn) : [],
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

    const renderSubmenuItems = (submenu: MenuItemRouteElement["submenu"], match: match) =>
        submenu.flatMap((submenuItem, index) => {
            if (isMenuItemAnchor(submenuItem)) {
                return <MenuItemAnchorLink key={index} {...submenuItem.menuElement} />;
            } else if (isMenuItemRoute(submenuItem)) {
                return <MenuItemRouterLink key={index} {...submenuItem.menuElement} to={`${match.url}${submenuItem.menuElement.to}`} />;
            }
            return [];
        });

    const renderGroupItems = (groupItems: MenuItemGroupElement["groupItems"], match: match) =>
        groupItems.flatMap((groupItem, index) => {
            if (isMenuItemRoute(groupItem)) {
                if (groupItem.hasSubmenu) {
                    return (
                        <MenuCollapsibleItem key={index} {...groupItem.menuElement}>
                            {renderSubmenuItems(groupItem.submenu, match)}
                        </MenuCollapsibleItem>
                    );
                }
                return <MenuItemRouterLink key={index} {...groupItem.menuElement} to={`${match.url}${groupItem.menuElement.to}`} />;
            } else if (isMenuItemAnchor(groupItem)) {
                return <MenuItemAnchorLink key={index} {...groupItem.menuElement} />;
            }
            return [];
        });

    return (
        <Menu variant={useTemporaryMenu ? "temporary" : "permanent"}>
            {menuItems.map((menuElement, index) => {
                if (isMenuItemGroupElement(menuElement)) {
                    return (
                        <MenuItemGroup key={index} {...menuElement.menuElement}>
                            {renderGroupItems(menuElement.groupItems, match)}
                        </MenuItemGroup>
                    );
                } else if (isMenuItemAnchor(menuElement)) {
                    return <MenuItemAnchorLink key={index} {...menuElement.menuElement} />;
                } else if (menuElement.hasSubmenu) {
                    return (
                        <MenuCollapsibleItem key={index} {...menuElement.menuElement}>
                            {renderSubmenuItems(menuElement.submenu, match)}
                        </MenuCollapsibleItem>
                    );
                }
                return <MenuItemRouterLink key={index} {...menuElement.menuElement} to={`${match.url}${menuElement.menuElement.to}`} />;
            })}
        </Menu>
    );
};
