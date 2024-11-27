import { AppHeader, AppHeaderMenuButton, MasterLayout, Menu, MenuItemRouterLink, Stack } from "@comet/admin";
import { Dashboard } from "@comet/admin-icons";
import React from "react";
import { Route } from "react-router";

export function masterLayoutDecorator() {
    const MasterHeader = () => (
        <AppHeader>
            <AppHeaderMenuButton />
        </AppHeader>
    );

    const MasterMenu = () => (
        <Menu>
            <MenuItemRouterLink primary="Example Page" to="/" icon={<Dashboard />} />
        </Menu>
    );

    return (Story: React.ComponentType) => {
        return (
            <MasterLayout menuComponent={MasterMenu} headerComponent={MasterHeader}>
                <Story />
            </MasterLayout>
        );
    };
}

export function stackRouteDecorator(topLevelTitle = "Example Page") {
    return (Story: React.ComponentType) => {
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
