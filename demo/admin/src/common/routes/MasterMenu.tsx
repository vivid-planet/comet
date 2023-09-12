import { Menu, MenuCollapsibleItem, MenuContext, MenuItemRouterLink, useWindowSize } from "@comet/admin";
import { useMenuForCurrentUser } from "@comet/cms-admin";
import * as React from "react";
import { useRouteMatch } from "react-router";

import { routeMenu } from "./routes";

const permanentMenuMinWidth = 1024;

const MasterMenu: React.FC = () => {
    const { open, toggleOpen } = React.useContext(MenuContext);
    const windowSize = useWindowSize();
    const match = useRouteMatch();

    const menu = useMenuForCurrentUser(routeMenu, match.url);

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
            {menu.map((menuItem, index) =>
                menuItem.hasSubMenu ? (
                    <MenuCollapsibleItem key={index} {...menuItem.menuItem}>
                        {menuItem.subMenu.map((subMenu, index) => (
                            <MenuItemRouterLink key={index} {...subMenu.menuItem} />
                        ))}
                    </MenuCollapsibleItem>
                ) : (
                    <MenuItemRouterLink key={index} {...menuItem.menuItem} />
                ),
            )}
        </Menu>
    );
};

export default MasterMenu;
