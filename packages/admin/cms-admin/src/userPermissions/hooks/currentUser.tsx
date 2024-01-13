import { gql, useQuery } from "@apollo/client";
import { Loading } from "@comet/admin";
import React from "react";

import { ContentScopeInterface } from "../../contentScope/Provider";
import { GQLCurrentUserPermission } from "../../graphql.generated";
import { GQLCurrentUserQuery } from "./currentUser.generated";

type CurrentUserContext = { currentUser: CurrentUserInterface; isAllowed: (user: CurrentUserInterface, permission: string) => boolean };
export const CurrentUserContext = React.createContext<CurrentUserContext | undefined>(undefined);

export interface CurrentUserInterface {
    name?: string;
    email?: string;
    language?: string;
    permissions: GQLCurrentUserPermission[];
    contentScopes: ContentScopeInterface[];
}

export const CurrentUserProvider: React.FC<{
    isAllowed?: CurrentUserContext["isAllowed"];
}> = ({ isAllowed, children }) => {
    const { data, error } = useQuery<GQLCurrentUserQuery>(gql`
        query CurrentUser {
            currentUser {
                id
                name
                email
                contentScopes
                permissions {
                    permission
                }
            }
        }
    `);

    if (error) throw error.message;

    if (!data) return <Loading behavior="fillPageHeight" />;

    const context: CurrentUserContext = {
        currentUser: data.currentUser,
        isAllowed:
            isAllowed ??
            ((user: CurrentUserInterface, permission: string) => {
                if (user.email === undefined) return false;
                return user.permissions.some((p) => p.permission === permission);
            }),
    };

    return <CurrentUserContext.Provider value={context}>{children}</CurrentUserContext.Provider>;
};

export function useCurrentUser(): CurrentUserInterface {
    const ret = React.useContext(CurrentUserContext);
    if (!ret || !ret.currentUser) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    return ret.currentUser;
}
