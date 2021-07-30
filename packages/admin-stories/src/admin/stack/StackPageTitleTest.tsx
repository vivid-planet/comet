import { Stack, StackBreadcrumbs, StackPage, StackSwitch, StackSwitchApiContext } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

function Page1() {
    const switchApi = React.useContext(StackSwitchApiContext);
    return (
        <>
            <button
                onClick={(e) => {
                    switchApi.activatePage("page2", "test");
                }}
            >
                activate page2
            </button>
        </>
    );
}

// When StackPage.title is of type React.Node, sometimes this happens:

// Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.

// Try to reconstruct this behavior...

// Seen here:
// https://gitlab.vivid-planet.com/vivid/comet/-/commit/0d4647071f1eb42e852b5fd90c9e5d0760710da5
// https://gitlab.vivid-planet.com/vivid/comet/-/merge_requests/1219/diffs?commit_id=3ed51b606a42288ec8a2f1e91de85282c8ed37e1

function Page2() {
    return (
        <Stack topLevelTitle="Stack Nested">
            <StackBreadcrumbs />
            <StackSwitch>
                <StackPage name="page1" title={<h1>page1</h1>}>
                    <Page1 />
                </StackPage>
                <StackPage name="page2" title={<h1>page2</h1>}>
                    page2-2
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

function Story() {
    return (
        <Stack topLevelTitle="Stack">
            <StackBreadcrumbs />
            <StackSwitch>
                <StackPage name="page1" title={<h1>page1</h1>}>
                    <Page1 />
                </StackPage>
                <StackPage name="page2" title={<h1>page2</h1>}>
                    <Page2 />
                </StackPage>
            </StackSwitch>
        </Stack>
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
    .add("Stack Nested", () => <App />);
