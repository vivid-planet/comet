import { Stack, StackBreadcrumbs, StackPage, useStackSwitch } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";

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

function App() {
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
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(storyRouterDecorator())
    .add("Stack Ref Api", () => <App />);
