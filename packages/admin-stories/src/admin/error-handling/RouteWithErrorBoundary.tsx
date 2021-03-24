import { MasterLayout, Menu, MenuItemRouterLink, RouteWithErrorBoundary } from "@comet/admin";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";

const ViewWithNoError: React.FunctionComponent = () => {
    return (
        <div>
            <Typography>View with No Error</Typography>
        </div>
    );
};

const ViewWithError: React.FunctionComponent = () => {
    const potentialError = null;

    //@ts-ignore This should really throw an error ;-)
    potentialError.produceError();
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
