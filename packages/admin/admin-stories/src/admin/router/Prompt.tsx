import { RouterPrompt } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { storyRouterDecorator } from "../../story-router.decorator";
function Story() {
    return (
        <Switch>
            <Route path="/foo">
                <RouterPrompt
                    message={() => {
                        return "sure?";
                    }}
                    subRoutePath="/foo/s"
                >
                    <Link to="/foo/s/sub">subLink</Link>
                    <Link to="/foo">fooLink</Link>
                    <Route path="/foo">
                        <div>foo</div>
                    </Route>
                    <Route path="/foo/s/sub">
                        <div>sub</div>
                    </Route>
                </RouterPrompt>
            </Route>
            <Redirect to="/foo" />
        </Switch>
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
            <Story />
        </>
    );
}

storiesOf("@comet/admin/router", module)
    .addDecorator(storyRouterDecorator())
    .add("Nested route with non-sub-path route in Prompt", () => <App />);
