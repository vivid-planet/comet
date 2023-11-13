import { gql, useQuery } from "@apollo/client";
import React from "react";

import { GQLCurrentUserPermission } from "../../graphql.generated";
import { GQLCurrentUserQuery } from "./currentUser.generated";

const CurrentUserContext = React.createContext<CurrentUser | undefined>(undefined);

export type UserPermission = string;

export type ContentScope = {
    [key: string]: string;
};

export class CurrentUser {
    name = undefined;
    email = undefined;
    language = undefined;
    permissions: GQLCurrentUserPermission[] = [];
    contentScopes: ContentScope[] = [];
    isAllowed(permission?: UserPermission): boolean {
        if (this.email === undefined) return false;
        if (!permission) return true;
        return this.permissions.some((p) => p.permission === permission);
    }
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

    const currentUser = new CurrentUser();
    if (data?.currentUser) Object.assign(currentUser, data.currentUser);
    return <CurrentUserContext.Provider value={currentUser}>{children}</CurrentUserContext.Provider>;
};

export function useCurrentUser(): CurrentUser {
    const ret = React.useContext<CurrentUser | undefined>(CurrentUserContext);
    if (!ret) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    return ret;
}
