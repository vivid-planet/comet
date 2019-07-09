import { User, UserManager } from "oidc-client";
import * as React from "react";
import createUserContextApi from "../hooks/createUserContextApi";
import UserContext from "../hooks/UserContext";
import useUserProviderEffects from "../hooks/useUserProviderEffects";
import useUserProviderState from "../hooks/useUserProviderState";

export interface IPropsUserProvider {
    oidcUserManager: UserManager;
    defaultRedirectPath?: string;
    whileLoading?: React.ReactNode;
    showOnError?: (errorMsg: string) => React.ReactNode;
}

const UserProvider: React.FC<IPropsUserProvider> = props => {
    const { oidcUserManager, children, whileLoading, showOnError, defaultRedirectPath } = props;

    const state = useUserProviderState();
    const api = createUserContextApi(props, state);

    useUserProviderEffects(oidcUserManager, state);

    if (state.error) {
        if (showOnError) {
            return <>showOnError(state.error)</>;
        } else {
            return <>Fehler aufgetreten; {state.error}</>;
        }
    }

    // handle process-token-url
    if (location.pathname.indexOf("/process-token") === 0) {
        // /process-token#access_token OR /process-token?error=invalid_scope&error_descr...
        if (!state.isAuthenticating && !state.oidcUser) {
            // TODO state-änderungen besser überlegen
            api.processTokenInUrl().then((loggedInUser: User) => {
                window.location.href = defaultRedirectPath ? defaultRedirectPath : "/";
            });
        }
    }

    const { isAuthenticating, isRehydrating, isAuthenticated, redirectUserToLoginForm, user } = api;

    // we are neither rehydrating the user from store nor authenticating the user,
    // theres no more need to wait for any change, there is definitely no user available
    const definitelyNotAuthenticated = !isRehydrating && !isAuthenticating && !isAuthenticated;

    // we are either rehydrating user from store or authenticating the user
    // in both cases we wait for the result
    if ((isRehydrating || isAuthenticating) && !isAuthenticated) {
        return <>{whileLoading}</>;
    }

    if (definitelyNotAuthenticated) {
        redirectUserToLoginForm();
    }

    if (!user) {
        return <>{whileLoading}</>;
    }

    // definitely authenticated, render the content
    return <UserContext.Provider value={api}>{children}</UserContext.Provider>;
};

export default UserProvider;
