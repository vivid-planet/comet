import { User as OidcUser, UserManager } from "oidc-client";
import * as React from "react";
import { IUser } from "./createUserContextApi";

const defaultIUserApi: IUserContext = {
    oidcUserManager: null,
    isAuthenticated: false,
    isAuthenticating: false,
    isRehydrating: true,
    user: null,
    processTokenInUrl: () => {
        return null as any;
    },
    logoutUser: () => {
        // do nothing
    },
    removeUser: () => {
        // do nothing
    },
    redirectUserToLoginForm: () => {
        // do nothing
    },
};

export interface IUserContext {
    oidcUserManager: UserManager | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    isRehydrating: boolean;
    user: IUser | null;
    processTokenInUrl: () => Promise<OidcUser | undefined>;
    logoutUser: () => void | Promise<any>;
    removeUser: () => void;
    redirectUserToLoginForm: () => void;
    defaultRedirectPath?: string;
}

const UserContext = React.createContext<IUserContext>(defaultIUserApi);

export default UserContext;
