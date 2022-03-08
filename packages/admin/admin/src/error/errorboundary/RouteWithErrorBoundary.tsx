import * as React from "react";
import { Route, RouteProps } from "react-router";

import { ErrorBoundary } from "./ErrorBoundary";

const RouteWithErrorBoundary: React.FunctionComponent<RouteProps> = (props) => {
    return (
        <ErrorBoundary key={JSON.stringify(props.path)}>
            <Route {...props} />
        </ErrorBoundary>
    );
};
export { RouteWithErrorBoundary };
