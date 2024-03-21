import { Stack, StackBreadcrumbs, StackLink, StackPage, StackSwitch } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

function Path() {
    const location = useLocation();
    const [, rerender] = React.useState(0);
    React.useEffect(() => {
        const timer = setTimeout(() => {
            rerender(new Date().getTime());
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    return <div>{location.pathname}</div>;
}
function Page2() {
    return (
        <Stack topLevelTitle="Stack Nested">
            <StackBreadcrumbs />
            <StackSwitch>
                <StackPage name="page1">
                    <StackLink payload="test" pageName="page2-2">
                        activate page2-2
                    </StackLink>
                </StackPage>
                <StackPage name="page2-2">page2</StackPage>
            </StackSwitch>
        </Stack>
    );
}

function Story() {
    return (
        <>
            <Path />
            <Stack topLevelTitle="Stack">
                <StackBreadcrumbs />
                <StackSwitch>
                    <StackPage name="page1">
                        <Page2 />
                    </StackPage>
                    <StackPage name="page2">page2</StackPage>
                </StackSwitch>
            </Stack>
        </>
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
    .add("Stack Nested On Initial Page", () => <App />);
