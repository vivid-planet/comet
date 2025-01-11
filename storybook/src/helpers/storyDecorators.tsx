import { AppHeader, AppHeaderMenuButton, MasterLayout, Menu, MenuItemRouterLink, Stack, useWindowSize } from "@comet/admin";
import { Dashboard } from "@comet/admin-icons";
import { useTheme } from "@mui/material";
import { ComponentType } from "react";
import { Route } from "react-router";

export function masterLayoutDecorator() {
    const MasterHeader = () => (
        <AppHeader>
            <AppHeaderMenuButton />
        </AppHeader>
    );

    const MasterMenu = () => {
        const windowSize = useWindowSize();
        const { breakpoints } = useTheme();
        const useTemporaryMenu: boolean = windowSize.width < breakpoints.values.md;

        return (
            <Menu variant={useTemporaryMenu ? "temporary" : "permanent"}>
                <MenuItemRouterLink primary="Example Page" to="/" icon={<Dashboard />} />
            </Menu>
        );
    };

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
