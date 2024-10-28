import { RouterTab, RouterTabs, SubRoute } from "@comet/admin";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    const match = useRouteMatch();
    return (
        <div>
            <SubRoute path={`${match.url}/cmp1`}>
                <RouterTabs>
                    <RouterTab label="Tab 1" path="">
                        Tab 1 Content
                    </RouterTab>
                    <RouterTab label="Tab 2" path="/form2">
                        Tab 2 Content
                    </RouterTab>
                </RouterTabs>
            </SubRoute>
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

export default {
    title: "@comet/admin/tabs",
    decorators: [storyRouterDecorator()],
};

export const RouterTabsInSubRoute = () => <App />;

RouterTabsInSubRoute.storyName = "Router Tabs in SubRoute";
