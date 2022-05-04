import { useStoredState } from "@comet/admin";
import React from "react";
import { Redirect, useLocation } from "react-router";

interface RedirectToPersistedDamLocationProps {
    stateKey: string;
}

export const RedirectToPersistedDamLocation: React.VoidFunctionComponent<RedirectToPersistedDamLocationProps> = ({ stateKey }) => {
    const location = useLocation();
    const isInitialRender = React.useRef(true);
    const [persistedDamLocation, setPersistedDamLocation] = useStoredState<string>(stateKey, location.pathname, window.sessionStorage);

    React.useEffect(() => {
        setPersistedDamLocation(location.pathname);
    }, [location.pathname, setPersistedDamLocation]);

    React.useEffect(() => {
        isInitialRender.current = false;
        // the redirect should only happen on initial render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{isInitialRender.current && <Redirect to={persistedDamLocation} />}</>;
};
