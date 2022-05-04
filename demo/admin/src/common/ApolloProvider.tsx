import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, fromPromise, InMemoryCache, PossibleTypesMap } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createErrorDialogApolloLink, useErrorDialog } from "@comet/admin";
import config from "@src/config";
import fragmentTypes from "@src/fragmentTypes.json";
import { UserContext } from "@vivid/react-oidc-client";
import * as React from "react";

const CustomApolloProvider: React.FunctionComponent = ({ children }) => {
    const userContext = React.useContext(UserContext);
    const errorDialog = useErrorDialog();

    const link = ApolloLink.from([
        onError(({ graphQLErrors, operation, forward }) => {
            if (graphQLErrors) {
                if (graphQLErrors.some((x) => x.message === "AccessTokenInvalid")) {
                    return fromPromise(userContext.userManager.signinSilent()).flatMap(() => {
                        if (!userContext.getUser()) {
                            userContext.signOut();
                        }
                        return forward(operation);
                    });
                }
            }
        }),
        createErrorDialogApolloLink({ errorDialog }),

        setContext((operation, { headers = {} }) => {
            return {
                headers: {
                    ...headers,
                    authorization: `Bearer ${userContext.getUser().access_token}`,
                    "x-include-invisible-content": ["Unpublished", "Archived"],
                },
            };
        }),
        createHttpLink({
            uri: `${config.API_URL}/graphql`,
        }),
    ]);

    const possibleTypes: PossibleTypesMap = {};
    for (const type of fragmentTypes.__schema.types) {
        possibleTypes[type.name] = type.possibleTypes.map((possibleType) => possibleType.name);
    }

    const cache = new InMemoryCache({
        possibleTypes: possibleTypes,
    });

    const apolloClient = new ApolloClient({
        link,
        cache,
    });

    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default CustomApolloProvider;
