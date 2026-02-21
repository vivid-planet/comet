import { useStoredState } from "@comet/admin";
import { useContext, useEffect, useRef } from "react";
import { matchPath, Navigate, UNSAFE_RouteContext, useLocation } from "react-router";

interface RedirectToPersistedDamLocationProps {
    stateKey: string;
}

export const RedirectToPersistedDamLocation = ({ stateKey }: RedirectToPersistedDamLocationProps) => {
    const location = useLocation();
    const routeContext = useContext(UNSAFE_RouteContext);
    const currentMatch = routeContext.matches[routeContext.matches.length - 1];
    const matchUrl = currentMatch?.pathnameBase ?? "";
    const isExact = !!matchPath({ path: matchUrl, end: true }, location.pathname);

    const isInitialRender = useRef(true);
    const [persistedDamLocation, setPersistedDamLocation] = useStoredState<string>(stateKey, location.pathname, window.sessionStorage);

    useEffect(() => {
        setPersistedDamLocation(location.pathname);
    }, [location.pathname, setPersistedDamLocation]);

    useEffect(() => {
        isInitialRender.current = false;
    }, []);

    if (
        // the redirect should only happen on initial render
        isInitialRender.current &&
        // only redirect on exact match ("/" in image block and "/{domain}/{lang}/assets" in DAM)
        isExact
    ) {
        return <Navigate to={persistedDamLocation} replace />;
    }

    return null;
};
