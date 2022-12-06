import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { createErrorDialogApolloLink } from "@comet/admin";
import { includeInvisibleContentContext } from "@comet/cms-admin";
import config from "@src/config";
import fragmentTypes from "@src/fragmentTypes.json";

export const createApolloClient = () => {
    const httpLink = new HttpLink({
        uri: `${config.API_URL}/graphql`,
    });

    const link = ApolloLink.from([createErrorDialogApolloLink(), includeInvisibleContentContext, httpLink]);

    const cache = new InMemoryCache({
        possibleTypes: fragmentTypes.possibleTypes,
        typePolicies: {},
    });

    return new ApolloClient({
        link,
        cache,
    });
};
