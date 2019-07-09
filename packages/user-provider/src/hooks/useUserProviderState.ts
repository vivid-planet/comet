import { User as OidcUser } from "oidc-client";
import * as React from "react";

interface IUserStatusState {
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    isRehydrating: boolean;
    error: string | null;
    oidcUser: OidcUser | null;
}
export interface IStateApiUserProvider extends IUserStatusState {
    setAuthenticating: (doingAuth: boolean) => void;
    setRehydrating: (doingRehydrate: boolean) => void;
    setAuthenticateOk: (user: OidcUser) => void;
    setError: (error: string) => void;
    removeUser: () => void;
}

enum ActionTypes {
    Authenticating = "USER_AUTHENTICATING",
    Rehydrating = "USER_REHYDRATING",
    AuthenticateOk = "USER_AUTHENTICATE_OK",
    RemoveUser = "USER_REMOVE",
    ErrorOccured = "ERROR_OCCURED",
}

type SupportedActions =
    | { type: ActionTypes.Authenticating; authenticating: boolean }
    | { type: ActionTypes.Rehydrating; rehydrating: boolean }
    | { type: ActionTypes.AuthenticateOk; oidcUser: OidcUser }
    | { type: ActionTypes.ErrorOccured; error: string }
    | { type: ActionTypes.RemoveUser };

const defaultsState: IUserStatusState = {
    isAuthenticated: false,
    isAuthenticating: false,
    error: null,
    isRehydrating: true, // important
    oidcUser: null,
};

const reducer = (state: IUserStatusState = defaultsState, action: SupportedActions) => {
    switch (action.type) {
        case ActionTypes.Authenticating: {
            // if (state.isAuthenticating === action.authenticating) return state;
            return {
                ...state,
                isAuthenticating: action.authenticating,
            };
        }
        case ActionTypes.Rehydrating: {
            return {
                ...state,
                isRehydrating: action.rehydrating,
            };
        }
        case ActionTypes.AuthenticateOk: {
            return {
                ...state,
                isAuthenticated: true,
                oidcUser: action.oidcUser,
            };
        }
        case ActionTypes.RemoveUser: {
            return { ...state, isAuthenticated: false, oidcUser: null };
        }
        case ActionTypes.ErrorOccured: {
            return { ...state, error: action.error, isAuthenticating: false, oidcUser: null, isAuthenticated: false, isRehydrating: false };
        }
        default:
            return state;
    }
};

function useUserProviderState(): IStateApiUserProvider {
    const [{ isAuthenticating, isRehydrating, isAuthenticated, oidcUser, error }, dispatch] = React.useReducer<
        React.Reducer<IUserStatusState, SupportedActions>
    >(reducer, defaultsState);

    return {
        isAuthenticating,
        isRehydrating,
        isAuthenticated,
        oidcUser,
        error,
        setError: (errorString: string) => dispatch({ type: ActionTypes.ErrorOccured, error: errorString }),
        setAuthenticating: (doingAuth: boolean) => dispatch({ type: ActionTypes.Authenticating, authenticating: doingAuth }),
        setRehydrating: (doingRehydrate: boolean) => dispatch({ type: ActionTypes.Rehydrating, rehydrating: doingRehydrate }),
        setAuthenticateOk: (user: OidcUser) => dispatch({ type: ActionTypes.AuthenticateOk, oidcUser: user }),
        removeUser: () => dispatch({ type: ActionTypes.RemoveUser }),
    };
}

export default useUserProviderState;
