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

type MenuItemRoute = {
    menuElement: MenuItemRouterLinkProps;
    hasSubmenu: boolean;
    submenu: MenuItem[];
};

type MenuItemAnchor = {
    menuElement: MenuItemAnchorLinkProps;
};

type MenuItemGroupElement = {
    menuElement: MenuItemGroupProps;
    isGroup: boolean;
    groupItems: MenuItem[];
};

type MenuItem = MenuItemRoute | MenuItemAnchor | MenuItemGroupElement;

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
function isMenuItemAnchor(item: MenuItem): item is MenuItemAnchor {
    return !!item.menuElement && "href" in item.menuElement;
}

function isMenuItemRoute(item: MenuItem): item is MenuItemRoute {
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
            hasSubmenu: !!submenu,
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

    return (
        <Menu variant={useTemporaryMenu ? "temporary" : "permanent"}>
            {menuItems.map((menuElement, index) =>
                isMenuItemAnchor(menuElement) ? (
                    <MenuItemAnchorLink key={index} {...menuElement.menuElement} />
                ) : isMenuItemGroupElement(menuElement) ? (
                    <MenuItemGroup key={index} {...menuElement.menuElement}>
                        {menuElement.groupItems.flatMap((groupItem, index) =>
                            isMenuItemRoute(groupItem) ? (
                                groupItem.hasSubmenu ? (
                                    <MenuCollapsibleItem key={index} {...groupItem.menuElement}>
                                        {groupItem.submenu.flatMap((submenuItem, index) =>
                                            isMenuItemAnchor(submenuItem) ? (
                                                <MenuItemAnchorLink key={index} {...submenuItem.menuElement} />
                                            ) : isMenuItemRoute(submenuItem) ? (
                                                <MenuItemRouterLink
                                                    key={index}
                                                    {...submenuItem.menuElement}
                                                    to={`${match.url}${submenuItem.menuElement.to}`}
                                                />
                                            ) : (
                                                []
                                            ),
                                        )}
                                    </MenuCollapsibleItem>
                                ) : (
                                    <MenuItemRouterLink key={index} {...groupItem.menuElement} to={`${match.url}${groupItem.menuElement.to}`} />
                                )
                            ) : isMenuItemAnchor(groupItem) ? (
                                <MenuItemAnchorLink key={index} {...groupItem.menuElement} />
                            ) : (
                                []
                            ),
                        )}
                    </MenuItemGroup>
                ) : menuElement.hasSubmenu ? (
                    <MenuCollapsibleItem key={index} {...menuElement.menuElement}>
                        {menuElement.submenu.flatMap((submenuItem, index) =>
                            isMenuItemAnchor(submenuItem) ? (
                                <MenuItemAnchorLink key={index} {...submenuItem.menuElement} />
                            ) : isMenuItemRoute(submenuItem) ? (
                                <MenuItemRouterLink key={index} {...submenuItem.menuElement} to={`${match.url}${submenuItem.menuElement.to}`} />
                            ) : (
                                []
                            ),
                        )}
                    </MenuCollapsibleItem>
                ) : (
                    <MenuItemRouterLink key={index} {...menuElement.menuElement} to={`${match.url}${menuElement.menuElement.to}`} />
                ),
            )}
        </Menu>
    );
};
