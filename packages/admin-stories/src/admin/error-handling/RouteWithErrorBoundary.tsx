import { MasterLayout, Menu, MenuItemRouterLink, RouteWithErrorBoundary } from "@comet/admin";
import { Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";

const ViewWithNoError: React.FunctionComponent = () => {
    return (
        <div>
            <Typography variant={"h5"}>View with No Error</Typography>

            <Alert severity={"info"}>
                <Typography>Use the ErrorBoundary component to create a boundary for app routes.</Typography>
                <Typography>Try to click on the second route (Error Route) to display a route which throws an error.</Typography>
            </Alert>
        </div>
    );
};

const ViewWithError: React.FunctionComponent = () => {
    throw new Error("Some error occured");
    return (
        <div>
            <Typography>Error</Typography>
        </div>
    );
};

function MasterMenu() {
    return (
        <Menu>
            <MenuItemRouterLink primary={"No Error Route"} to={`/no-error-route`} />
            <MenuItemRouterLink primary={"Error Route"} to={`/error-route`} />
        </Menu>
    );
}

function App() {
    return (
        <MasterLayout menuComponent={MasterMenu} hideToolbarMenuIcon>
            <Switch>
                <RouteWithErrorBoundary path={`/no-error-route`} component={ViewWithNoError} />
                <RouteWithErrorBoundary path={`/error-route`} component={ViewWithError} />
                <Route exact path="/">
                    <Redirect to="/no-error-route" />
                </Route>
            </Switch>
        </MasterLayout>
    );
}

storiesOf("@comet/admin/error-handling", module)
    .addDecorator(StoryRouter())
    .add("RouteWithErrorBoundary", () => <App />);
