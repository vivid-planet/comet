import { gql, useQuery } from "@apollo/client";
import { Loading } from "@comet/admin";
import isEqual from "lodash.isequal";
import React from "react";

import { ContentScopeInterface, useContentScope } from "../../contentScope/Provider";
import { GQLCurrentUserQuery } from "./currentUser.generated";

type CurrentUserContext = {
    currentUser: CurrentUserInterface;
    isAllowed: (user: CurrentUserInterface, permission: string, contentScope?: ContentScopeInterface) => boolean;
};
export const CurrentUserContext = React.createContext<CurrentUserContext | undefined>(undefined);

export interface CurrentUserInterface {
    name?: string;
    email?: string;
    language?: string;
    contentScopes: ContentScopeInterface[] | null;
    permissions: {
        permission: string;
        contentScopes: ContentScopeInterface[] | null;
    }[];
    allowedContentScopes: ContentScopeInterface[];
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
                    contentScopes
                }
            }
            currentUserAllowedContentScopes
        }
    `);

    if (error) throw error.message;

    if (!data) return <Loading behavior="fillPageHeight" />;

    const context: CurrentUserContext = {
        currentUser: {
            ...data.currentUser,
            allowedContentScopes: data.currentUserAllowedContentScopes,
        },
        isAllowed:
            isAllowed ??
            ((user: CurrentUserInterface, permission: string, contentScope?: ContentScopeInterface) => {
                if (!user.permissions) return false;
                return user.permissions.some((p) => {
                    if (p.permission !== permission) return false;
                    if (!contentScope) return true;
                    const contentScopes = p.contentScopes || user.contentScopes;
                    if (contentScopes === null) return true;
                    return contentScopes.some((cs) => isEqual(cs, contentScope));
                });
            }),
    };

    return <CurrentUserContext.Provider value={context}>{children}</CurrentUserContext.Provider>;
};

export function useCurrentUser(): CurrentUserInterface {
    const ret = React.useContext(CurrentUserContext);
    if (!ret || !ret.currentUser) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    return ret.currentUser;
}

export function useUserPermissionCheck(): (permission: string) => boolean {
    const context = React.useContext(CurrentUserContext);
    if (!context) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    const contentScope = useContentScope();
    return (permission: string) => context.isAllowed(context.currentUser, permission, contentScope.scope);
}
