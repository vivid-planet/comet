import { gql, useQuery } from "@apollo/client";
import { FullPageAlert, Loading } from "@comet/admin";
import { createContext, type PropsWithChildren, useContext } from "react";

import { type ContentScopeInterface, useContentScope } from "../../contentScope/Provider";
import { type GQLCurrentUserPermission } from "../../graphql.generated";
import { type GQLCurrentUserQuery } from "./currentUser.generated";

type CurrentUserContext = {
    currentUser: CurrentUserInterface;
    isAllowed: (user: CurrentUserInterface, permission: string, contentScope?: ContentScopeInterface) => boolean;
};
export const CurrentUserContext = createContext<CurrentUserContext | undefined>(undefined);

export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    permissions: GQLCurrentUserPermission[];
    authenticatedUser: {
        name: string;
        email: string;
    } | null;
    allowedContentScopes: ContentScopeInterface[];
    impersonated: boolean;
}

export const CurrentUserProvider = ({ isAllowed, children }: PropsWithChildren<{ isAllowed?: CurrentUserContext["isAllowed"] }>) => {
    const { data, error } = useQuery<GQLCurrentUserQuery>(gql`
        query CurrentUser {
            currentUser {
                id
                name
                email
                authenticatedUser {
                    name
                    email
                }
                permissions {
                    permission
                    contentScopes
                }
                impersonated
            }
        }
    `);

    if (error) {
        return <FullPageAlert severity="error" description={error.message} />;
    }

    if (!data) return <Loading behavior="fillPageHeight" />;

    const context: CurrentUserContext = {
        currentUser: {
            ...data.currentUser,
            impersonated: !!data.currentUser.impersonated,
            authenticatedUser: data.currentUser.authenticatedUser,
            allowedContentScopes: data.currentUser.permissions.flatMap((p) => p.contentScopes),
        },
        isAllowed:
            isAllowed ??
            ((user: CurrentUserInterface, permission: string, contentScope?: ContentScopeInterface) => {
                if (user.email === undefined) return false;
                return user.permissions.some(
                    (p) =>
                        p.permission === permission &&
                        (!contentScope || p.contentScopes.some((cs) => Object.entries(contentScope).every(([scope, value]) => cs[scope] === value))),
                );
            }),
    };

    return <CurrentUserContext.Provider value={context}>{children}</CurrentUserContext.Provider>;
};

export function useCurrentUser(): CurrentUserInterface {
    const ret = useContext(CurrentUserContext);
    if (!ret || !ret.currentUser) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    return ret.currentUser;
}

export function useUserPermissionCheck(): (permission: string) => boolean {
    const context = useContext(CurrentUserContext);
    if (!context) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    const contentScope = useContentScope();
    return (permission: string) => context.isAllowed(context.currentUser, permission, contentScope.scope);
}
