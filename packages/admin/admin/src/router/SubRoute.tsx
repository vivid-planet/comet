import * as React from "react";
import { matchPath, Route, useLocation, useRouteMatch } from "react-router";

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

    return <Route {...routeProps}>{children}</Route>;
}

export function SubRoute({ children, path }: { children: React.ReactNode; path: string }) {
    return <SubRoutesContext.Provider value={{ path }}>{children}</SubRoutesContext.Provider>;
}

export function useSubRoutePrefix() {
    const match = useRouteMatch();
    const subRoutesContext = React.useContext(SubRoutesContext);
    let ret = subRoutesContext?.path || match.url;
    ret = ret.replace(/\/$/, ""); //remove trailing slash
    return ret;
}
