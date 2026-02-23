import { Alert, MainNavigation, MainNavigationItemRouterLink, MasterLayout, RouteWithErrorBoundary } from "@comet/admin";
import { Card, CardContent, Typography } from "@mui/material";
import { matchPath, Navigate, useLocation } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

const ViewWithNoError = () => {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    View with No Error
                </Typography>
                <Alert severity="info">
                    <Typography>Use the RouteWithErrorBoundary component to create a boundary for app routes.</Typography>
                    <Typography>Try to click on the second route (Error Route) to display a route which throws an error.</Typography>
                </Alert>
            </CardContent>
        </Card>
    );
};

const ViewWithError = () => {
    throw new Error("Some error occurred");
    return (
        <div>
            <Typography>Error</Typography>
        </div>
    );
};

function MasterMenu() {
    return (
        <MainNavigation>
            <MainNavigationItemRouterLink primary="No Error Route" to="/no-error-route" />
            <MainNavigationItemRouterLink primary="Error Route" to="/error-route" />
        </MainNavigation>
    );
}

export default {
    title: "@comet/admin/error-handling/error-boundaries",
    decorators: [storyRouterDecorator()],
};

export const _RouteWithErrorBoundary = {
    render: () => {
        const location = useLocation();
        return (
            <MasterLayout menuComponent={MasterMenu}>
                <RouteWithErrorBoundary path="/no-error-route" component={ViewWithNoError} />
                <RouteWithErrorBoundary path="/error-route" component={ViewWithError} />
                {matchPath({ path: "/", end: true }, location.pathname) && <Navigate to="/no-error-route" replace />}
            </MasterLayout>
        );
    },

    name: "RouteWithErrorBoundary",
};
