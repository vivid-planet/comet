import { AppHeader, AppHeaderMenuButton, MainNavigation, MainNavigationItemRouterLink, MasterLayout, Stack } from "@comet/admin";
import { Dashboard } from "@comet/admin-icons";
import { ComponentType } from "react";
import { Route } from "react-router";

export function masterLayoutDecorator() {
    const MasterHeader = () => (
        <AppHeader>
            <AppHeaderMenuButton />
        </AppHeader>
    );

    const MasterMenu = () => (
        <MainNavigation>
            <MainNavigationItemRouterLink primary="Example Page" to="/" icon={<Dashboard />} />
        </MainNavigation>
    );

    return (Story: ComponentType) => {
        return (
            <MasterLayout menuComponent={MasterMenu} headerComponent={MasterHeader}>
                <Story />
            </MasterLayout>
        );
    };
}

export function stackRouteDecorator(topLevelTitle = "Example Page") {
    return (Story: ComponentType) => {
        return (
            <Route
                render={() => (
                    <Stack topLevelTitle={topLevelTitle}>
                        <Story />
                    </Stack>
                )}
            />
        );
    };
}
