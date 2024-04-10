import { gql, useQuery } from "@apollo/client";
import { Loading } from "@comet/admin";
import { Typography } from "@mui/material";
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
    name?: string;
    email?: string;
    locale?: string;
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
                locale
                permissions {
                    permission
                    contentScopes
                }
            }
        }
    `);

    if (error) return <Typography gutterBottom>{error.message}</Typography>;
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
                return user.permissions.some(
                    (p) => p.permission === permission && (!contentScope || p.contentScopes.some((cs) => isEqual(cs, contentScope))),
                );
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
