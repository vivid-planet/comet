import { Menu, MenuCollapsibleItem, MenuContext, MenuItemRouterLink, useWindowSize } from "@comet/admin";
import { CurrentUser, useCurrentUser } from "@comet/cms-admin";
import * as React from "react";
import { useRouteMatch } from "react-router";

import { Page } from "./pages/page.type";
import { pages } from "./pages/pages";

const permanentMenuMinWidth = 1024;

const MenuItem = ({ basePath, page, user }: { basePath: string; page: Page; user: CurrentUser }) => {
    if (!page.menu) return <></>;
    if (page.menu.subMenu !== undefined) {
        const { subMenu: _, ...menu } = page.menu;
        return (
            <MenuCollapsibleItem {...menu}>
                {page.menu.subMenu
                    .filter((subMenu) => subMenu && user.isAllowed(subMenu.requiredPermission || page.requiredPermission))
                    .map((subMenu, index) => (
                        <MenuItemRouterLink key={index} {...subMenu} to={`${basePath}${subMenu.to}`} />
                    ))}
            </MenuCollapsibleItem>
        );
    } else {
        const route = page.route ? page.route.path : page.routes && page.routes[0] && page.routes[0].path;
        return <MenuItemRouterLink to={`${basePath}${route}`} {...page.menu} />;
    }
};

const MasterMenu: React.FC = () => {
    const { open, toggleOpen } = React.useContext(MenuContext);
    const windowSize = useWindowSize();
    const match = useRouteMatch();
    const user = useCurrentUser();

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
            {pages
                .filter((page) => user && page.menu && user.isAllowed(page.requiredPermission))
                .map((page, index) => (
                    <MenuItem key={index} page={page} user={user} basePath={match.url} />
                ))}
        </Menu>
    );
};

export default MasterMenu;
