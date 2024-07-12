import { ForcePromptRoute, RouterPrompt } from "@comet/admin";
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
                        return "rly?";
                    }}
                    subRoutePath="/foo"
                >
                    <ul>
                        <li>
                            <Link to="/foo/sub1">/foo/sub1</Link> (no prompt)
                        </li>
                        <li>
                            <Link to="/foo/sub2">/foo/sub2</Link> (force prompt)
                        </li>
                        <li>
                            <Link to="/foo">/foo</Link> (back)
                        </li>
                    </ul>
                    <Route path="/foo/sub1">
                        <div>sub1</div>
                    </Route>
                    <ForcePromptRoute path="/foo/sub2">
                        <div>sub2</div>
                    </ForcePromptRoute>
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
    .add("ForcePromptRoute", () => <App />);
