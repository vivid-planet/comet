import { Stack, StackBreadcrumbs, StackPage, StackSwitch, StackSwitchApiContext } from "@comet/admin";
import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

function Page1() {
    const switchApi = useContext(StackSwitchApiContext);
    return (
        <button
            onClick={(e) => {
                switchApi.activatePage("page2", "test");
            }}
        >
            activate page2
        </button>
    );
}

function Page2() {
    return (
        <Stack topLevelTitle="Stack Nested">
            <StackBreadcrumbs />
            <StackSwitch>
                <StackPage name="page1">
                    <Page1 />
                </StackPage>
                <StackPage name="page2">page2-2</StackPage>
            </StackSwitch>
        </Stack>
    );
}

function Story() {
    return (
        <Stack topLevelTitle="Stack">
            <StackBreadcrumbs />
            <StackSwitch>
                <StackPage name="page1">
                    <Page1 />
                </StackPage>
                <StackPage name="page2">
                    <Page2 />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const StackNested = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="/foo" />
            </Route>
            <Route path="/foo">
                <Story />
            </Route>
        </Switch>
    );
};
