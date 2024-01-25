import { gql, useQuery } from "@apollo/client";
import { Loading } from "@comet/admin";
import { Button, Typography } from "@mui/material";
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

    // As this Provider is very high up in the tree, don't rely on ErrorBoundary or a configured intl-Provider here
    if (error) {
        const isUnauthenticated = error.graphQLErrors.some(
            (e) => e.extensions?.exception?.status === 401 || e.extensions?.code === "UNAUTHENTICATED",
        );
        return (
            <>
                <Typography gutterBottom>{isUnauthenticated ? "Your access-token is invalid. Re-login might help." : error.message}</Typography>
                {isUnauthenticated && (
                    <Button href="/" color="info" variant="outlined">
                        {
                            // eslint-disable-next-line @calm/react-intl/missing-formatted-message
                        }
                        Re-Login
                    </Button>
                )}
            </>
        );
    }

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
