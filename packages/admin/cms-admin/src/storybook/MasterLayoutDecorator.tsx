import { AppHeader, AppHeaderMenuButton, MainNavigation, MainNavigationItemRouterLink, MasterLayout, useWindowSize } from "@comet/admin";
import { Dashboard, Store } from "@comet/admin-icons";
import { useTheme } from "@mui/material";
import type { Decorator } from "@storybook/react-vite";

const MasterHeader = () => (
    <AppHeader>
        <AppHeaderMenuButton />
    </AppHeader>
);

const MasterMenu = () => {
    const windowSize = useWindowSize();
    const { breakpoints } = useTheme();
    const useTemporaryMenu = windowSize.width < breakpoints.values.md;

    return (
        <MainNavigation variant={useTemporaryMenu ? "temporary" : "permanent"}>
            <MainNavigationItemRouterLink primary="Dashboard" to="/" icon={<Dashboard />} />
            <MainNavigationItemRouterLink primary="Products" to="/products" icon={<Store />} />
        </MainNavigation>
    );
};

export const MasterLayoutDecorator: Decorator = (Story) => (
    <MasterLayout menuComponent={MasterMenu} headerComponent={MasterHeader}>
        <Story />
    </MasterLayout>
);
