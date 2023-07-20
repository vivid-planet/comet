import { SubRouteIndexRoute, useSubRoutePrefix } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { storyRouterDecorator } from "../../story-router.decorator";

function Cmp1() {
    const urlPrefix = useSubRoutePrefix();
    return (
        <div>
            <Switch>
                <Route path={`${urlPrefix}/sub`}>
                    <p>Cmp1-Sub</p>
                </Route>
                <SubRouteIndexRoute>
                    <p>Cmp1-Index</p>
                    <Link to={`${urlPrefix}/sub`}>to-cmp1-sub</Link>
                </SubRouteIndexRoute>
            </Switch>
        </div>
    );
}

function Story() {
    return (
        <div>
            <Switch>
                <SubRouteIndexRoute>
                    <Cmp1 />
                </SubRouteIndexRoute>
                <Route path="/sub">Sub</Route>
            </Switch>
        </div>
    );
}

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

storiesOf("@comet/admin/router", module)
    .addDecorator(storyRouterDecorator())
    .add("Subroute nested index", () => <App />);
