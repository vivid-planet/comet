import { type ComponentType, type PropsWithChildren, type ReactNode } from "react";
import { matchPath, useLocation } from "react-router";

import { ErrorBoundary } from "./ErrorBoundary";

interface RouteWithErrorBoundaryProps {
    path: string;
    component?: ComponentType<any>;
    children?: ReactNode;
}

const RouteWithErrorBoundary = ({ path, component: Component, children }: PropsWithChildren<RouteWithErrorBoundaryProps>) => {
    const location = useLocation();
    const match = matchPath({ path, end: false }, location.pathname);
    if (!match) return null;
    return <ErrorBoundary key={JSON.stringify(path)}>{Component ? <Component /> : children}</ErrorBoundary>;
};
export { RouteWithErrorBoundary };
