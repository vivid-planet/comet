import { gql, useQuery } from "@apollo/client";
import { Loading } from "@comet/admin";
import omit from "lodash.omit";
import { createContext, type PropsWithChildren, useContext } from "react";

import { type ContentScope, useContentScope } from "../../contentScope/Provider";
import { type GQLPermission } from "../../graphql.generated";
import { type GQLCurrentUserQuery } from "./currentUser.generated";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PermissionOverrides {} // This interface can be overwritten to add custom permissions
export type Permission = GQLPermission | PermissionOverrides[keyof PermissionOverrides];

interface CurrentUserContext {
    currentUser: CurrentUserInterface;
    isAllowed: (user: CurrentUserInterface, permission: Permission, contentScope?: ContentScope) => boolean;
}
export const CurrentUserContext = createContext<CurrentUserContext | undefined>(undefined);

export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    impersonated: boolean;
    authenticatedUser: {
        name: string;
        email: string;
    } | null;
    permissions: {
        permission: Permission;
        contentScopes: ContentScope[];
    }[];
    allowedContentScopes: {
        scope: ContentScope;
        label: { [key in keyof ContentScope]: string };
    }[];
}

export const CurrentUserProvider = ({ isAllowed, children }: PropsWithChildren<{ isAllowed?: CurrentUserContext["isAllowed"] }>) => {
    const { data, error } = useQuery<GQLCurrentUserQuery>(gql`
        query CurrentUser {
            currentUser {
                id
                name
                email
                impersonated
                authenticatedUser {
                    name
                    email
                }
                permissions {
                    permission
                    contentScopes
                }
                allowedContentScopes {
                    scope
                    label
                }
            }
        }
    `);

    if (error) {
        return <>Cannot load user: {error.message}</>;
    }

    if (!data) return <Loading behavior="fillPageHeight" />;

    const context: CurrentUserContext = {
        currentUser: {
            id: data.currentUser.id,
            name: data.currentUser.name,
            email: data.currentUser.email,
            permissions: data.currentUser.permissions.map((p) => ({
                permission: p.permission as Permission,
                contentScopes: p.contentScopes,
            })),
            authenticatedUser: data.currentUser.authenticatedUser && omit(data.currentUser.authenticatedUser, "__typename"),
            allowedContentScopes: data.currentUser.allowedContentScopes.map((acs) => omit(acs, "__typename")),
            impersonated: !!data.currentUser.impersonated,
        },
        isAllowed:
            isAllowed ??
            ((user: CurrentUserInterface, permission: Permission, contentScope?: ContentScope) => {
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

export function useUserPermissionCheck(): (permission: Permission) => boolean {
    const context = useContext(CurrentUserContext);
    if (!context) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    const contentScope = useContentScope();
    return (permission) => context.isAllowed(context.currentUser, permission, contentScope.scope);
}
