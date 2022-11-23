import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { createErrorDialogApolloLink } from "@comet/admin";
import { includeInvisibleContentContext } from "@comet/cms-admin";
import { AuthConfiguration, createAuthorizationLink, RefreshHandler } from "@comet/react-app-auth";
import config from "@src/config";
import fragmentTypes from "@src/fragmentTypes.json";

interface CreateApolloClientOptions {
    authorizationConfig: AuthConfiguration;
    refreshHandler: RefreshHandler;
}

export const createApolloClient = ({ authorizationConfig, refreshHandler }: CreateApolloClientOptions) => {
    const httpLink = new HttpLink({
        uri: `${config.API_URL}/graphql`,
    });

    const link = ApolloLink.from([
        createErrorDialogApolloLink(),
        includeInvisibleContentContext,
        createAuthorizationLink({ authorizationConfig, refreshHandler }),
        httpLink,
    ]);

    const cache = new InMemoryCache({
        possibleTypes: fragmentTypes.possibleTypes,
        typePolicies: {},
    });

    return new ApolloClient({
        link,
        cache,
    });
};
