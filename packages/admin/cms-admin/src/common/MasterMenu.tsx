import {
    MainNavigation,
    MainNavigationCollapsibleItem,
    type MainNavigationCollapsibleItemProps,
    MainNavigationItemAnchorLink,
    type MainNavigationItemAnchorLinkProps,
    MainNavigationItemGroup,
    type MainNavigationItemGroupProps,
    MainNavigationItemRouterLink,
    type MainNavigationItemRouterLinkProps,
    useMainNavigation,
    useWindowSize,
} from "@comet/admin";
import { type ReactNode, useEffect } from "react";
import { type RouteProps, useRouteMatch } from "react-router-dom";

import { useUserPermissionCheck } from "../userPermissions/hooks/currentUser";

type MasterMenuItemBase = {
    requiredPermission?: string;
};

type MasterMenuItemRoute = MasterMenuItemBase &
    Omit<MainNavigationItemRouterLinkProps, "to"> & {
        type: "route";
        route?: RouteProps;
        to?: string;
        badgeContent?: ReactNode;
    };

type MasterMenuItemCollapsible = MasterMenuItemBase &
    Omit<MainNavigationCollapsibleItemProps, "children"> & {
        type: "collapsible";
        items?: Array<MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemCollapsible>;
        route?: RouteProps;
    };

type MasterMenuItemAnchor = MasterMenuItemBase &
    MainNavigationItemAnchorLinkProps & {
        type: "externalLink";
    };

type MasterMenuItemGroup = MasterMenuItemBase &
    MainNavigationItemGroupProps & {
        type: "group";
        items: Array<
            (MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemCollapsible) & {
                icon: ReactNode;
            }
        >;
    };

export type MasterMenuItem =
    | ((MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemCollapsible) & {
          icon: ReactNode;
      })
    | MasterMenuItemGroup;

export type MasterMenuData = MasterMenuItem[];

type MenuItemRouteElement = {
    type: "route";
    menuElement: MainNavigationItemRouterLinkProps;
};

type MenuItemCollapsibleElement = {
    type: "collapsible";
    menuElement: Omit<MainNavigationCollapsibleItemProps, "children">;
    items: MenuItem[];
};

type MenuItemAnchorElement = {
    type: "externalLink";
    menuElement: MainNavigationItemAnchorLinkProps;
};

type MenuItemGroupElement = {
    type: "group";
    menuElement: Omit<MainNavigationItemGroupProps, "children">;
    items: MenuItem[];
};

type MenuItem = MenuItemRouteElement | MenuItemAnchorElement | MenuItemCollapsibleElement | MenuItemGroupElement;

export interface MasterMenuProps {
    permanentMenuMinWidth?: number;
    menu: MasterMenuData;
}

export function useMenuFromMasterMenuData(items: MasterMenuData): MenuItem[] {
    const isAllowed = useUserPermissionCheck();
    const checkPermission = (item: MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemCollapsible | MasterMenuItemGroup): boolean => {
        if (!item.requiredPermission) {
            if (item.type === "collapsible" || item.type === "group") {
                return (item.items || []).some(checkPermission);
            }
            return true;
        }
        return isAllowed(item.requiredPermission);
    };

    const mapFn = (item: MasterMenuItemRoute | MasterMenuItemAnchor | MasterMenuItemCollapsible | MasterMenuItemGroup): MenuItem => {
        if (item.type === "externalLink") {
            const { requiredPermission, type, ...menuElement } = item;
            return { type, menuElement };
        }

        if (item.type === "group") {
            const { items, requiredPermission, type, ...menuElement } = item;
            return {
                type,
                menuElement,
                items: items.filter(checkPermission).map(mapFn),
            };
        }

        if (item.type === "collapsible") {
            const { route, items, requiredPermission, type, ...menuElement } = item;
            return {
                type,
                menuElement,
                items: items ? items.filter(checkPermission).map(mapFn) : [],
            };
        }

        const { route, to, requiredPermission, type, ...menuItem } = item;
        return {
            type,
            menuElement: {
                ...menuItem,
                to: to ?? route?.path?.toString() ?? "",
            },
        };
    };
    return items.filter(checkPermission).map(mapFn);
}

export const MasterMenu = ({ menu, permanentMenuMinWidth = 1024 }: MasterMenuProps) => {
    const menuItems = useMenuFromMasterMenuData(menu);
    const { open, toggleOpen } = useMainNavigation();
    const windowSize = useWindowSize();
    const match = useRouteMatch();
    const useTemporaryMenu: boolean = windowSize.width < permanentMenuMinWidth;

    // Open menu when changing to permanent variant and close when changing to temporary variant.
    useEffect(() => {
        if ((useTemporaryMenu && open) || (!useTemporaryMenu && !open)) {
            toggleOpen();
        }
        // useEffect dependencies must only include `location`, because the function should only be called once after changing the location.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const renderMenuItems = (items: MenuItemGroupElement["items"] | MenuItemCollapsibleElement["items"]) =>
        items.flatMap((item, index) => {
            if (item.type === "collapsible") {
                return (
                    <MainNavigationCollapsibleItem key={index} {...item.menuElement}>
                        {renderMenuItems(item.items)}
                    </MainNavigationCollapsibleItem>
                );
            } else if (item.type === "externalLink") {
                return <MainNavigationItemAnchorLink key={index} {...item.menuElement} />;
            } else if (item.type === "route") {
                return <MainNavigationItemRouterLink key={index} {...item.menuElement} to={`${match.url}${item.menuElement.to}`} />;
            }
            return [];
        });

    return (
        <MainNavigation variant={useTemporaryMenu ? "temporary" : "permanent"}>
            {menuItems.map((menuElement, index) => {
                switch (menuElement.type) {
                    case "group":
                        return (
                            <MainNavigationItemGroup key={index} {...menuElement.menuElement}>
                                {renderMenuItems(menuElement.items)}
                            </MainNavigationItemGroup>
                        );
                    case "collapsible":
                        return (
                            <MainNavigationCollapsibleItem key={index} {...menuElement.menuElement}>
                                {renderMenuItems(menuElement.items)}
                            </MainNavigationCollapsibleItem>
                        );
                    case "externalLink":
                        return <MainNavigationItemAnchorLink key={index} {...menuElement.menuElement} />;
                    case "route":
                        return (
                            <MainNavigationItemRouterLink key={index} {...menuElement.menuElement} to={`${match.url}${menuElement.menuElement.to}`} />
                        );
                }
            })}
        </MainNavigation>
    );
};
