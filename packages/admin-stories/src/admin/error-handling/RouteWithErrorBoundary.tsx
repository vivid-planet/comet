import { MasterLayout, Menu, MenuItemRouterLink, RouteWithErrorBoundary } from "@comet/admin";
import { Card, CardContent, Typography } from "@mui/material";
import { Alert } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

const ViewWithNoError: React.FunctionComponent = () => {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant={"h5"} gutterBottom>
                    View with No Error
                </Typography>
                <Alert severity={"info"}>
                    <Typography>Use the RouteWithErrorBoundary component to create a boundary for app routes.</Typography>
                    <Typography>Try to click on the second route (Error Route) to display a route which throws an error.</Typography>
                </Alert>
            </CardContent>
        </Card>
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
        <MasterLayout menuComponent={MasterMenu}>
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

storiesOf("@comet/admin/error-handling/error-boundaries", module)
    .addDecorator(storyRouterDecorator())
    .add("RouteWithErrorBoundary", () => <App />);
