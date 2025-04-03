import { gql, useQuery } from "@apollo/client";
import { Loading } from "@comet/admin";
import { createContext, type PropsWithChildren, useContext } from "react";

import { removeTypenameKeys } from "../../common/removeTypenameKeys";
import { useContentScope } from "../../contentScope/Provider";
import { type GQLCurrentUserQuery } from "./currentUser.generated";

export interface ContentScope {
    [key: string]: unknown;
}

type CurrentUserContext = {
    currentUser: CurrentUserInterface;
    isAllowed: (user: CurrentUserInterface, permission: string, contentScope?: ContentScope) => boolean;
};
export const CurrentUserContext = createContext<CurrentUserContext | undefined>(undefined);

export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    permissions: {
        permission: string;
        contentScopes: ContentScope[];
    }[];
    authenticatedUser: {
        name: string;
        email: string;
    } | null;
    allowedContentScopes: {
        scope: ContentScope;
        label: { [key in keyof ContentScope]: string };
    }[];
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
                allowedContentScopes {
                    scope
                    label
                }
                impersonated
            }
        }
    `);

    if (error) {
        return <>Cannot load user: {error.message}</>;
    }

    if (!data) return <Loading behavior="fillPageHeight" />;

    const context: CurrentUserContext = {
        currentUser: removeTypenameKeys(data.currentUser),
        isAllowed:
            isAllowed ??
            ((user: CurrentUserInterface, permission: string, contentScope?: ContentScope) => {
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
