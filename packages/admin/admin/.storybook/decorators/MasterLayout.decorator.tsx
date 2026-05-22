import { AppHeader, AppHeaderMenuButton, MainNavigation, MainNavigationItemRouterLink, MasterLayout, useWindowSize } from "@comet/admin";
import { Dashboard } from "@comet/admin-icons";
import { useTheme } from "@mui/material";
import type { Decorator } from "@storybook/react-vite";

function MasterHeader() {
    return (
        <AppHeader>
            <AppHeaderMenuButton />
        </AppHeader>
    );
}

function MasterMenu() {
    const windowSize = useWindowSize();
    const { breakpoints } = useTheme();
    const useTemporaryMenu = windowSize.width < breakpoints.values.md;

    return (
        <MainNavigation variant={useTemporaryMenu ? "temporary" : "permanent"}>
            <MainNavigationItemRouterLink primary="Example Page" to="/" icon={<Dashboard />} />
        </MainNavigation>
    );
}

export const MasterLayoutDecorator: Decorator = (Story) => (
    <MasterLayout menuComponent={MasterMenu} headerComponent={MasterHeader}>
        <Story />
    </MasterLayout>
);
