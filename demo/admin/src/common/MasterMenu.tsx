import { Menu, MenuCollapsibleItem, MenuContext, MenuItemRouterLink, useWindowSize } from "@comet/admin";
import { Assets, Dashboard, Data, PageTree, Snips, Wrench } from "@comet/admin-icons";
import * as React from "react";
import { useIntl } from "react-intl";
import { useRouteMatch } from "react-router";

const permanentMenuMinWidth = 1024;

const MasterMenu: React.FC = () => {
    const { open, toggleOpen } = React.useContext(MenuContext);
    const windowSize = useWindowSize();
    const intl = useIntl();
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
            <MenuItemRouterLink
                primary={intl.formatMessage({ id: "cometDemo.menu.dashboard", defaultMessage: "Dashboard" })}
                icon={<Dashboard />}
                to={`${match.url}/dashboard`}
            />
            <MenuCollapsibleItem primary={intl.formatMessage({ id: "cometDemo.menu.pageTree", defaultMessage: "Page tree" })} icon={<PageTree />}>
                <MenuItemRouterLink
                    primary={intl.formatMessage({ id: "cometDemo.menu.pageTree.mainNavigation", defaultMessage: "Main navigation" })}
                    to={`${match.url}/pages/pagetree/main-navigation`}
                />
                <MenuItemRouterLink
                    primary={intl.formatMessage({ id: "cometDemo.menu.pageTree.topMenu", defaultMessage: "Top menu" })}
                    to={`${match.url}/pages/pagetree/top-menu`}
                />
            </MenuCollapsibleItem>

            <MenuCollapsibleItem
                primary={intl.formatMessage({ id: "cometDemo.menu.structuredContent", defaultMessage: "Structured Content" })}
                icon={<Data />}
            >
                <MenuItemRouterLink
                    primary={intl.formatMessage({ id: "cometDemo.menu.news", defaultMessage: "News" })}
                    to={`${match.url}/structured-content/news`}
                />
            </MenuCollapsibleItem>
            <MenuItemRouterLink
                primary={intl.formatMessage({ id: "cometDemo.menu.dam", defaultMessage: "Assets" })}
                icon={<Assets />}
                to={`${match.url}/assets`}
            />
            <MenuCollapsibleItem
                primary={intl.formatMessage({ id: "cometDemo.menu.projectSnips", defaultMessage: "Project snips" })}
                icon={<Snips />}
            >
                <MenuItemRouterLink
                    primary={intl.formatMessage({ id: "cometDemo.menu.mainMenu", defaultMessage: "Main menu" })}
                    to={`${match.url}/project-snips/main-menu`}
                />
            </MenuCollapsibleItem>
            <MenuCollapsibleItem primary={intl.formatMessage({ id: "cometDemo.menu.system", defaultMessage: "System" })} icon={<Wrench />}>
                <MenuItemRouterLink
                    primary={intl.formatMessage({ id: "cometDemo.menu.publisher", defaultMessage: "Publisher" })}
                    to={`${match.url}/system/publisher`}
                />
                <MenuItemRouterLink
                    primary={intl.formatMessage({ id: "cometDemo.menu.redirects", defaultMessage: "Redirects" })}
                    to={`${match.url}/system/redirects`}
                />
            </MenuCollapsibleItem>
            <MenuItemRouterLink
                primary={intl.formatMessage({ id: "cometDemo.menu.componentDemo", defaultMessage: "Component demo" })}
                to={`${match.url}/component-demo`}
                icon={<Snips />}
            />
            <MenuItemRouterLink primary="Products" to={`${match.url}/products`} icon={<Snips />} />
        </Menu>
    );
};

export default MasterMenu;
