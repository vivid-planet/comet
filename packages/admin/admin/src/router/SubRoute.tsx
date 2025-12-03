import { createContext, type ReactNode, useContext } from "react";
import { __RouterContext, matchPath, Route, type RouteChildrenProps, useLocation, useRouteMatch } from "react-router";

interface SubRoutesContext {
    path: string;
}
const SubRoutesContext = createContext<SubRoutesContext | undefined>(undefined);

export function SubRouteIndexRoute({ children }: { children?: ReactNode | ((props: RouteChildrenProps) => ReactNode) }) {
    const location = useLocation();
    const match = useRouteMatch();
    const urlPrefix = useSubRoutePrefix();

    const matchIndex = matchPath(location.pathname, { path: match.url, exact: true });
    const routeProps = matchIndex ? { path: match.url, exact: true } : { path: urlPrefix };

    return (
        <SubRoute path={`${urlPrefix}/index`}>
            <Route {...routeProps}>{children}</Route>
        </SubRoute>
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
    const routerContext = useContext(__RouterContext);
    const subRoutesContext = useContext(SubRoutesContext);
    let ret;
    if (subRoutesContext?.path) {
        ret = subRoutesContext.path;
        if (routerContext?.match?.url && routerContext.match.url.startsWith(subRoutesContext.path)) {
            ret = routerContext.match.url;
        }
    } else {
        ret = routerContext?.match?.url || "";
    }
    ret = ret.replace(/\/$/, ""); //remove trailing slash
    return ret;
}
