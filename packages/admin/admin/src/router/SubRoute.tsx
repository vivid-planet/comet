import * as React from "react";
import { __RouterContext, matchPath, Route, useLocation, useRouteMatch } from "react-router";

interface SubRoutesContext {
    path: string;
}
const SubRoutesContext = React.createContext<SubRoutesContext | undefined>(undefined);

export function SubRouteIndexRoute({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const match = useRouteMatch();
    const subRoutesContext = React.useContext(SubRoutesContext);
    const urlPrefix = subRoutesContext?.path || match.url;

    const matchIndex = matchPath(location.pathname, { path: match.url, exact: true });
    const routeProps = matchIndex ? { path: match.url, exact: true } : { path: urlPrefix };

    return (
        <SubRoute path={`${urlPrefix}/index`}>
            <Route {...routeProps}>{children}</Route>
        </SubRoute>
    );
}

export function SubRoute({ children, path }: { children: React.ReactNode; path: string }) {
    return <SubRoutesContext.Provider value={{ path }}>{children}</SubRoutesContext.Provider>;
}

export function useSubRoutePrefix() {
    const routerContext = React.useContext(__RouterContext);
    const subRoutesContext = React.useContext(SubRoutesContext);
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
