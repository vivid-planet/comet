import { gql, useQuery } from "@apollo/client";
import React from "react";

import { GQLCurrentUserContentScope, GQLCurrentUserPermission } from "../../graphql.generated";
import { GQLCurrentUserQuery } from "./currentUser.generated";

const CurrentUserContext = React.createContext<CurrentUser | undefined>(undefined);

type PermissionConfiguration = Record<string, unknown>;

export type UserPermission =
    | {
          permission: string;
          configuration?: PermissionConfiguration;
      }
    | string;

export class CurrentUser {
    name = undefined;
    email = undefined;
    language = undefined;
    permissions: GQLCurrentUserPermission[] = [];
    contentScopes: GQLCurrentUserContentScope[] = [];
    isAllowed(permission?: UserPermission): boolean {
        if (this.email === undefined) return false;
        if (!permission) return true;
        if (typeof permission === "string") return this.permissions.some((p) => p.name === permission);
        return this.permissions.some((p) => p.name === permission.permission && this.checkConfiguration(permission.configuration, p.configuration));
    }

    private checkConfiguration(c1?: PermissionConfiguration, c2?: PermissionConfiguration): boolean {
        if (!c1) return true;
        if (!c2) return false;
        for (const key of Object.keys(c1)) {
            if (c1[key] !== c2[key]) return false;
        }
        return true;
    }
}

export const CurrentUserProvider: React.FC = ({ children }) => {
    const { data, error } = useQuery<GQLCurrentUserQuery>(gql`
        query CurrentUser {
            currentUser {
                name
                email
                contentScopes {
                    scope
                    label
                    values {
                        label
                        value
                    }
                }
                permissions {
                    name
                    configuration
                    overrideContentScopes
                    contentScopes {
                        scope
                        label
                        values {
                            label
                            value
                        }
                    }
                }
            }
        }
    `);

    if (error) {
        return <>Error while loading user: {error.message}</>;
    }
    const currentUser = new CurrentUser();
    if (data?.currentUser) Object.assign(currentUser, data.currentUser);
    return <CurrentUserContext.Provider value={currentUser}>{children}</CurrentUserContext.Provider>;
};

export function useCurrentUser(): CurrentUser {
    const ret = React.useContext<CurrentUser | undefined>(CurrentUserContext);
    if (!ret) throw new Error("CurrentUser not found. Make sure CurrentUserContext exists.");
    return ret;
}
