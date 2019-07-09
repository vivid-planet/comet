import { User, UserManager } from "oidc-client";
import * as React from "react";
import { IStateApiUserProvider } from "./useUserProviderState";

function useUserProviderEffects(oidcUserManager: UserManager, stateApi: IStateApiUserProvider) {
    React.useLayoutEffect(() => {
        // TODO analyiseren ob man hier auf useEffect( ändern kann.
        if (!oidcUserManager) {
            throw new Error("User provider needs a UserManager instance from oidc-client");
        }
        oidcUserManager.events.addUserSignedOut(stateApi.removeUser);
        oidcUserManager.events.addUserUnloaded(stateApi.removeUser);
        oidcUserManager.events.addAccessTokenExpired(stateApi.removeUser);

        stateApi.setRehydrating(true);
        oidcUserManager.getUser().then((user: User) => {
            if (user && user.access_token && !user.expired) {
                stateApi.setAuthenticateOk(user);
            } else {
                stateApi.removeUser();
            }
            stateApi.setRehydrating(false);
        });

        return function cleanup() {
            oidcUserManager.events.removeUserSignedOut(stateApi.removeUser);
            oidcUserManager.events.removeUserUnloaded(stateApi.removeUser);
            oidcUserManager.events.removeAccessTokenExpired(stateApi.removeUser);
        };
    }, []);
}

export default useUserProviderEffects;
