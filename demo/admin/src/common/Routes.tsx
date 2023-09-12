import { MasterLayout, RouteWithErrorBoundary } from "@comet/admin";
import { SitePreview, useRoutesForCurrentUser } from "@comet/cms-admin";
import ContentScopeProvider from "@src/common/ContentScopeProvider";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import MasterHeader from "./routes/MasterHeader";
import MasterMenu from "./routes/MasterMenu";
import { routeMenu } from "./routes/routes";

export const Routes: React.FC = () => {
    const routes = useRoutesForCurrentUser(routeMenu);
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
                                    <Redirect to={`${match.url}${routes[0].path}`} exact={true} from={match.path} />
                                    {routes.map((route, index) => (
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
