import { useStoredState } from "@comet/admin";
import React from "react";
import { Redirect, useLocation, useRouteMatch } from "react-router";

interface RedirectToPersistedDamLocationProps {
    stateKey: string;
}

export const RedirectToPersistedDamLocation: React.VoidFunctionComponent<RedirectToPersistedDamLocationProps> = ({ stateKey }) => {
    const location = useLocation();
    const match = useRouteMatch();

    const isInitialRender = React.useRef(true);
    const [persistedDamLocation, setPersistedDamLocation] = useStoredState<string>(stateKey, location.pathname, window.sessionStorage);

    React.useEffect(() => {
        setPersistedDamLocation(location.pathname);
    }, [location.pathname, setPersistedDamLocation]);

    React.useEffect(() => {
        isInitialRender.current = false;
    }, []);

    if (
        // the redirect should only happen on initial render
        isInitialRender.current &&
        // only redirect on exact match ("/" in image block and "/{domain}/{lang}/assets" in DAM)
        match.isExact
    ) {
        return <Redirect to={persistedDamLocation} />;
    }

    return null;
};
