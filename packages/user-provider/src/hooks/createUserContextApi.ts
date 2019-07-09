import { User as OidcUser } from "oidc-client";
import { IPropsUserProvider } from "../components/UserProvider";
import { IUserContext } from "./UserContext";
import { IStateApiUserProvider } from "./useUserProviderState";

// oidc default attributes:
//  profile: name family_name given_name middle_name nickname preferred_username profile picture website gender birthdate zoneinfo locale updated_at
//  email: email email_verified
//  address: formatted street_address locality region postal_code country
//  phone: phone_number phone_number_verified

export interface IUser {
    id: string;
    email: string;
    roles: string[];
    // gender: string; // muss vermutlich nicht teil des libUsers sein
    // title: string;
    firstname: string;
    lastname: string;
    [key: string]: any;
}

export function libFormatUser(oidcUser: OidcUser): IUser {
    const { roles, sub, email, given_name, family_name, ...rest } = oidcUser.profile;

    const normalizedRoles: string[] =
        roles && typeof roles === "string" // the oidc converts an array with one item to a string, we transfer it bach to an array here
            ? [roles]
            : roles // otherwise we expect it to be an array
            ? roles
            : [];
    return {
        id: sub,
        email: email ? email : undefined,
        roles: normalizedRoles,
        firstname: given_name ? given_name : undefined,
        lastname: family_name ? family_name : undefined,
        ...rest,
    };
}

function createUserContextApi(props: IPropsUserProvider, stateApi: IStateApiUserProvider): IUserContext {
    const { oidcUserManager, defaultRedirectPath } = props;

    async function processTokenInUrl() {
        stateApi.setAuthenticating(true);
        try {
            const user = await oidcUserManager.signinRedirectCallback();
            if (user) {
                stateApi.setAuthenticateOk(user);
                stateApi.setAuthenticating(false);
                return user;
            } else {
                removeUser();
                stateApi.setAuthenticating(false);
            }
        } catch (e) {
            stateApi.setError(e.message);
        }
    }

    function redirectUserToLoginForm() {
        oidcUserManager.signinRedirect();
    }

    function removeUser() {
        oidcUserManager.removeUser();
        stateApi.removeUser();
    }

    function logoutUser() {
        const settings = oidcUserManager.settings;
        if (settings.post_logout_redirect_uri) {
            return new Promise((resolve, reject) => {
                const req = new XMLHttpRequest();
                req.open("GET", settings.post_logout_redirect_uri!);
                req.setRequestHeader("x-requested-with", "XMLHttpRequest");
                req.withCredentials = true;
                req.onload = () => {
                    if (req.status === 200) {
                        removeUser();
                        resolve();
                    } else {
                        reject();
                    }
                };
                req.send();
            });
        } else {
            removeUser();
        }
    }

    return {
        oidcUserManager,
        isAuthenticated: stateApi.isAuthenticated,
        isAuthenticating: stateApi.isAuthenticating,
        isRehydrating: stateApi.isRehydrating,
        user: stateApi.oidcUser ? libFormatUser(stateApi.oidcUser) : null,
        processTokenInUrl,
        logoutUser,
        removeUser,
        redirectUserToLoginForm,
        defaultRedirectPath,
    };
}

export default createUserContextApi;
