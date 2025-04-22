import { AppHeader, AppHeaderMenuButton, MainNavigation, MainNavigationItemRouterLink, MasterLayout, Stack, useWindowSize } from "@comet/admin";
import { Dashboard } from "@comet/admin-icons";
import { useTheme } from "@mui/material";
import { type Decorator } from "@storybook/react/*";
import { type ComponentType, useEffect } from "react";
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
            <MainNavigation variant={useTemporaryMenu ? "temporary" : "permanent"}>
                <MainNavigationItemRouterLink primary="Example Page" to="/" icon={<Dashboard />} />
            </MainNavigation>
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
export const heightCommunicationDecorator = (): Decorator => {
    return (Story) => {
        useEffect(() => {
            const sendHeightToParent = () => {
                if (window.parent !== window) {
                    window.parent.postMessage({ type: "document-height", height: document.body.scrollHeight }, "*");
                }
            };

            sendHeightToParent();

            const resizeObserver = new ResizeObserver(sendHeightToParent);
            resizeObserver.observe(document.body);

            const mutationObserver = new MutationObserver(sendHeightToParent);
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
            });

            return () => {
                resizeObserver.disconnect();
                mutationObserver.disconnect();
            };
        }, []);

        return <Story />;
    };
};
