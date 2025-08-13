import { Stack, StackBackButton, StackBreadcrumbs, StackPage, StackSwitch, StackSwitchApiContext } from "@comet/admin";
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

function Story() {
    return (
        <Stack topLevelTitle="Stack">
            <div style={{ display: "flex", flexDirection: "row" }}>
                <StackBackButton />
                <StackBreadcrumbs />
            </div>
            <StackSwitch>
                <StackPage name="page1">
                    <Page1 />
                </StackPage>
                <StackPage name="page2">page2-2</StackPage>
            </StackSwitch>
        </Stack>
    );
}

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const _StackBackButton = () => {
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
