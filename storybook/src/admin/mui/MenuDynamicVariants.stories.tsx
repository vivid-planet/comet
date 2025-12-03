import {
    AppHeader,
    AppHeaderMenuButton,
    CometLogo,
    FillSpace,
    MainContent,
    MainNavigation,
    MainNavigationCollapsibleItem,
    MainNavigationItemAnchorLink,
    MainNavigationItemRouterLink,
    MasterLayout,
    useMainNavigation,
    useWindowSize,
} from "@comet/admin";
import { CometColor, Dashboard, LinkExternal, Settings, Sort } from "@comet/admin-icons";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { matchPath, Route, Switch, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { storyRouterDecorator } from "../../story-router.decorator";

const permanentMenuMinWidth = 1024;
const pathsToAlwaysUseTemporaryMenu = ["/foo3", "/foo4"];

const AppMenu = () => {
    const { open, toggleOpen } = useMainNavigation();
    const windowSize = useWindowSize();
    const location = useLocation();

    let useTemporaryMenu: boolean = windowSize.width < permanentMenuMinWidth;

    if (matchPath(location.pathname, { path: pathsToAlwaysUseTemporaryMenu, strict: true })) {
        useTemporaryMenu = true;
    }

    // Open menu when changing to permanent variant and close when changing to temporary variant.
    useEffect(() => {
        if ((useTemporaryMenu && open) || (!useTemporaryMenu && !open)) {
            toggleOpen();
        }
        // useEffect dependencies must only include `location`, because the function should only be called once after changing the location.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <MainNavigation variant={useTemporaryMenu ? "temporary" : "permanent"}>
            <MainNavigationItemRouterLink primary="Dashboard" icon={<Dashboard />} to="/dashboard" />
            <MainNavigationItemRouterLink primary="Settings" icon={<Settings />} to="/settings" />
            <MainNavigationCollapsibleItem primary="More Items" icon={<Sort />}>
                <MainNavigationItemRouterLink primary="Foo1" to="/foo1" />
                <MainNavigationItemRouterLink primary="Foo2" to="/foo2" />
            </MainNavigationCollapsibleItem>
            <MainNavigationCollapsibleItem primary="Even More Items" secondary="Forcing temporary menu" icon={<Sort />}>
                <MainNavigationItemRouterLink primary="Foo3" to="/foo3" />
                <MainNavigationItemRouterLink primary="Foo4" to="/foo4" />
            </MainNavigationCollapsibleItem>
            <MainNavigationItemAnchorLink
                primary="Comet Admin"
                secondary="View on GitHub"
                target="_blank"
                href="https://github.com/vivid-planet/comet"
                icon={<CometColor />}
                secondaryAction={<LinkExternal />}
            />
        </MainNavigation>
    );
};

const Header = () => (
    <AppHeader>
        <AppHeaderMenuButton />
        <CometLogo />
        <FillSpace />
    </AppHeader>
);

const Content = ({ children }: { children: string }) => (
    <MainContent>
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    {children}
                </Typography>
                <Typography gutterBottom>
                    The menu is permanent by default and is temporary below {permanentMenuMinWidth}px and for the routes:{" "}
                    {pathsToAlwaysUseTemporaryMenu.join(", ")}.
                    <br />
                    This is useful, when specific pages need some extra width.
                </Typography>
                <Divider />
                <br />
                <Typography variant="body2">Links for testing menu-behaviour when location changes without menu-interaction:</Typography>
                <ul>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/settings">Settings</Link>
                    </li>
                    <li>
                        <Link to="/foo1">Foo1</Link>
                    </li>
                    <li>
                        <Link to="/foo2">Foo2</Link>
                    </li>
                    <li>
                        <Link to="/foo3">Foo3</Link>
                    </li>
                    <li>
                        <Link to="/foo4">Foo4</Link>
                    </li>
                </ul>
            </CardContent>
        </Card>
    </MainContent>
);

export default {
    title: "@comet/admin/mui",
    decorators: [storyRouterDecorator()],
};

export const MenuDynamicVariants = {
    render: () => (
        <MasterLayout headerComponent={Header} menuComponent={AppMenu}>
            <Switch>
                <Route path="/" exact render={() => <Content>Root</Content>} />
                <Route path="/dashboard" render={() => <Content>Dashboard</Content>} />
                <Route path="/settings" render={() => <Content>Settings</Content>} />
                <Route path="/foo1" render={() => <Content>Foo 1</Content>} />
                <Route path="/foo2" render={() => <Content>Foo 2</Content>} />
                <Route path="/foo3" render={() => <Content>Foo 3</Content>} />
                <Route path="/foo4" render={() => <Content>Foo 4</Content>} />
            </Switch>
        </MasterLayout>
    ),

    name: "Menu (dynamic variants)",
    parameters: { layout: "fullscreen" },
};
