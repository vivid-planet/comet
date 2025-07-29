import { Route, type RouteProps } from "react-router";

import { ErrorBoundary } from "./ErrorBoundary";

const RouteWithErrorBoundary = (props: RouteProps) => {
    return (
        <ErrorBoundary key={JSON.stringify(props.path)}>
            <Route {...props} />
        </ErrorBoundary>
    );
};
export { RouteWithErrorBoundary };
