import { Stack, StackBreadcrumbs, StackPage, useStackSwitch } from "@comet/admin";
import { matchPath, Navigate, useLocation } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    const [StackSwitch, api] = useStackSwitch();
    // demonstrate how to access the StackSwitchApi in the component where StackSwich is created (useStackSwitchApi doesn't work)
    return (
        <div>
            <button
                onClick={() => {
                    api.activatePage("page2", "foo");
                }}
            >
                page2
            </button>
            <Stack topLevelTitle="Stack">
                <StackBreadcrumbs />
                <StackSwitch>
                    <StackPage name="page1">
                        <div>page1</div>
                    </StackPage>
                    <StackPage name="page2">
                        <div>page2</div>
                    </StackPage>
                </StackSwitch>
            </Stack>
        </div>
    );
}

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const StackRefApi = () => {
    const location = useLocation();
    if (matchPath({ path: "/", end: true }, location.pathname)) {
        return <Navigate to="/foo" replace />;
    }
    return <Story />;
};
