import { useStoredState } from "@comet/admin";
import React from "react";
import { Redirect, useLocation, useRouteMatch } from "react-router";

export interface PersistedDamLocationContextApi {
    persistedDamLocation: string;
    setPersistedDamLocation: (pathname: string) => void;
    reset: () => void;
}

const PersistedDamLocationContext = React.createContext<PersistedDamLocationContextApi | undefined>(undefined);

export const usePersistedDamLocation = (): PersistedDamLocationContextApi | undefined => {
    return React.useContext(PersistedDamLocationContext);
};

interface RedirectToPersistedDamLocationProps {
    stateKey: string;
    children: JSX.Element;
}

export const RedirectToPersistedDamLocation: React.VoidFunctionComponent<RedirectToPersistedDamLocationProps> = ({ stateKey, children }) => {
    const location = useLocation();
    const match = useRouteMatch();

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

    const reset = React.useCallback(() => {
        setPersistedDamLocation(match.url);
    }, [match.url, setPersistedDamLocation]);

    return (
        <PersistedDamLocationContext.Provider
            value={{
                persistedDamLocation,
                setPersistedDamLocation,
                reset,
            }}
        >
            {/* only redirect on exact match ("/" in image block and "/{domain}/{lang}/assets" in DAM) */}
            {isInitialRender.current && match.isExact && <Redirect to={persistedDamLocation} />}
            {children}
        </PersistedDamLocationContext.Provider>
    );
};
