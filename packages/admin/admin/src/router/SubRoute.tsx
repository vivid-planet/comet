import { createContext, type ReactNode, useContext } from "react";
import { matchPath, type PathMatch, UNSAFE_RouteContext, useLocation } from "react-router";

interface SubRoutesContext {
    path: string;
}
const SubRoutesContext = createContext<SubRoutesContext | undefined>(undefined);

export function SubRouteIndexRoute({ children }: { children?: ReactNode | ((match: PathMatch | null) => ReactNode) }) {
    const location = useLocation();
    const routeContext = useContext(UNSAFE_RouteContext);
    const currentMatch = routeContext.matches[routeContext.matches.length - 1];
    const matchUrl = currentMatch?.pathnameBase ?? "";
    const urlPrefix = useSubRoutePrefix();

    const matchIndex = matchPath({ path: matchUrl, end: true }, location.pathname);
    const path = matchIndex ? matchUrl : urlPrefix;
    const match = matchPath({ path, end: !!matchIndex }, location.pathname);

    return (
        <SubRoute path={`${urlPrefix}/index`}>{typeof children === "function" ? <>{children(match)}</> : match ? <>{children}</> : null}</SubRoute>
    );
}

export function SubRoute({ children, path }: { children?: ReactNode; path: string }) {
    const subRoutePrefix = useSubRoutePrefix();
    if (path.startsWith("./")) {
        path = subRoutePrefix + path.substring(1);
    }
    return <SubRoutesContext.Provider value={{ path }}>{children}</SubRoutesContext.Provider>;
}

export function useSubRoutePrefix() {
    const routeContext = useContext(UNSAFE_RouteContext);
    const currentMatch = routeContext.matches[routeContext.matches.length - 1];
    const matchUrl = currentMatch?.pathnameBase ?? "";
    const subRoutesContext = useContext(SubRoutesContext);
    let ret;
    if (subRoutesContext?.path) {
        ret = subRoutesContext.path;
        if (matchUrl && matchUrl.startsWith(subRoutesContext.path)) {
            ret = matchUrl;
        }
    } else {
        ret = matchUrl || "";
    }
    ret = ret.replace(/\/$/, ""); //remove trailing slash
    return ret;
}
