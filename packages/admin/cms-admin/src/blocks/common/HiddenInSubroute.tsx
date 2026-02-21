import { type ReactNode, useContext } from "react";
import { matchPath, UNSAFE_RouteContext, useLocation } from "react-router";

export const HiddenInSubroute = ({ children }: { children?: ReactNode }) => {
    const routeContext = useContext(UNSAFE_RouteContext);
    const currentMatch = routeContext.matches[routeContext.matches.length - 1];
    const matchUrl = currentMatch?.pathnameBase ?? "";
    const location = useLocation();
    const isExact = !!matchPath({ path: matchUrl, end: true }, location.pathname);

    if (!isExact) return null;
    return <>{children}</>;
};
