import { Stack, StackBreadcrumbs, StackLink, StackPage, StackSwitch, SubRoute, useSubRoutePrefix } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    const urlPrefix = useSubRoutePrefix();
    return (
        <Stack topLevelTitle="Stack">
            <StackBreadcrumbs />
            <SubRoute path={`${urlPrefix}/first`}>
                <StackSwitch>
                    <StackPage name="page1">
                        <p>First Page1</p>
                        <StackLink pageName="page2" payload="test">
                            activate page2
                        </StackLink>
                    </StackPage>
                    <StackPage name="page2">First Page2</StackPage>
                </StackSwitch>
            </SubRoute>
            <SubRoute path={`${urlPrefix}/second`}>
                <StackSwitch>
                    <StackPage name="page1">
                        <p>Second Page1</p>
                        <StackLink pageName="page2" payload="test">
                            activate page2
                        </StackLink>
                    </StackPage>
                    <StackPage name="page2">Second Page2</StackPage>
                </StackSwitch>
            </SubRoute>
        </Stack>
    );
}

function Path() {
    const location = useLocation();
    const [, rerender] = React.useState(0);
    React.useEffect(() => {
        const timer = setTimeout(() => {
            rerender(new Date().getTime());
        }, 100);
        return () => clearTimeout(timer);
    }, []);
    return <div>{location.pathname}</div>;
}

function App() {
    return (
        <>
            <Path />
            <Switch>
                <Route exact path="/">
                    <Redirect to="/foo" />
                </Route>
                <Route path="/foo">
                    <Story />
                </Route>
            </Switch>
        </>
    );
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(storyRouterDecorator())
    .add("Stack Nested one Stack", () => <App />);
