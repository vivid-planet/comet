import { MasterLayout, RouteWithErrorBoundary } from "@comet/admin";
import { SitePreview, useCurrentUser } from "@comet/cms-admin";
import { CircularProgress } from "@mui/material";
import ContentScopeProvider from "@src/common/ContentScopeProvider";
import * as React from "react";
import { Redirect, Route, RouteProps, Switch } from "react-router-dom";

import MasterHeader from "./MasterHeader";
import MasterMenu from "./MasterMenu";
import { pages } from "./pages/pages";

export const Routes: React.FC = () => {
    const user = useCurrentUser();
    if (!user) return <CircularProgress />;

    const routesForUser: RouteProps[] = pages
        .flatMap((page) => [page.route && { ...page.route, requiredPermission: page.requiredPermission }, ...(page.routes ?? [])])
        .filter((route) => route && user.isAllowed(route.requiredPermission)) as RouteProps[];
    return (
        <ContentScopeProvider>
            {({ match }) => (
                <Switch>
                    {/* @TODO: add preview to contentScope once site is capable of contentScope */}
                    <Route path={`${match.path}/preview`} render={(props) => <SitePreview {...props} />} />
                    <Route
                        render={() => (
                            <MasterLayout headerComponent={MasterHeader} menuComponent={MasterMenu}>
                                <Switch>
                                    {typeof routesForUser[0]?.path === "string" && (
                                        <Redirect to={`${match.url}${routesForUser[0].path}`} exact={true} from={match.path} />
                                    )}
                                    {routesForUser.map((route, index) => (
                                        <RouteWithErrorBoundary key={index} {...route} path={`${match.path}${route.path}`} />
                                    ))}
                                </Switch>
                            </MasterLayout>
                        )}
                    />
                </Switch>
            )}
        </ContentScopeProvider>
    );
};
