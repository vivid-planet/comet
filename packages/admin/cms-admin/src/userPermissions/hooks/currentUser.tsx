import { gql, useQuery } from "@apollo/client";
import { Loading } from "@comet/admin";
import React from "react";

import { ContentScopeInterface } from "../../contentScope/Provider";
import { GQLCurrentUserPermission } from "../../graphql.generated";
import { GQLCurrentUserQuery } from "./currentUser.generated";

export type CurrentUserContext =
    | { currentUser: CurrentUserInterface; isAllowed: (user: CurrentUserInterface, permission?: string) => boolean }
    | undefined;
export const CurrentUserContext = React.createContext<CurrentUserContext>(undefined);

export interface CurrentUserInterface {
    name?: string;
    email?: string;
    language?: string;
    permissions: GQLCurrentUserPermission[];
    contentScopes: ContentScopeInterface[];
}

export const CurrentUserProvider: React.FC = ({ children }) => {
    const { data, error } = useQuery<GQLCurrentUserQuery>(gql`
        query CurrentUser {
            currentUser {
                name
                email
                contentScopes
                permissions {
                    permission
                }
            }
            userPermissionsAvailablePermissions
        }
    `);

    if (error) throw error.message;

    if (!data) return <Loading behavior="fillPageHeight" />;

    const context: CurrentUserContext = {
        currentUser: data.currentUser,
        isAllowed: (user: CurrentUserInterface, permission?: string) => {
            if (user.email === undefined) return false;
            if (!permission) return true;
            return user.permissions.some((p) => p.permission === permission);
        },
    };

    return <CurrentUserContext.Provider value={context}>{children}</CurrentUserContext.Provider>;
};

export function useCurrentUser(): CurrentUserInterface {
    const ret = React.useContext<CurrentUserContext>(CurrentUserContext);
    if (!ret || !ret.currentUser) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    return ret.currentUser;
}
