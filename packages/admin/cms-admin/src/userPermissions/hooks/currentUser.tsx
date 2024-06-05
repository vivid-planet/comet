import { gql, useQuery } from "@apollo/client";
import { Loading } from "@comet/admin";
import isEqual from "lodash.isequal";
import React from "react";

import { ContentScopeInterface, useContentScope } from "../../contentScope/Provider";
import { GQLCurrentUserPermission } from "../../graphql.generated";
import { GQLCurrentUserQuery } from "./currentUser.generated";

type CurrentUserContext = {
    currentUser: CurrentUserInterface;
    isAllowed: (user: CurrentUserInterface, permission: string, contentScope?: ContentScopeInterface) => boolean;
};
export const CurrentUserContext = React.createContext<CurrentUserContext | undefined>(undefined);

export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    language: string;
    permissions: GQLCurrentUserPermission[];
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
                language
                permissions {
                    permission
                    contentScopes
                }
            }
        }
    `);

    if (error) throw error.message;

    if (!data) return <Loading behavior="fillPageHeight" />;

    const context: CurrentUserContext = {
        currentUser: {
            ...data.currentUser,
            allowedContentScopes: data.currentUser.permissions.flatMap((p) => p.contentScopes),
        },
        isAllowed:
            isAllowed ??
            ((user: CurrentUserInterface, permission: string, contentScope?: ContentScopeInterface) => {
                if (user.email === undefined) return false;
                const [requiredMainPermission, requiredSubPermission] = permission.split(".");
                return user.permissions.some((p) => {
                    const [mainPermission, subPermission] = p.permission.split(".");
                    if (mainPermission !== requiredMainPermission) return false;
                    if (subPermission && subPermission !== requiredSubPermission) return false;

                    if (!contentScope) return true;
                    return p.contentScopes.some((cs) => isEqual(cs, contentScope));
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
