import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { createErrorDialogApolloLink } from "@comet/admin";
import { includeInvisibleContentContext } from "@comet/cms-admin";
import fragmentTypes from "@src/fragmentTypes.json";

export const createApolloClient = (apiUrl: string) => {
    const httpLink = new HttpLink({
        uri: `${apiUrl}/graphql`,
    });

    const link = ApolloLink.from([createErrorDialogApolloLink(), includeInvisibleContentContext, httpLink]);

    const cache = new InMemoryCache({
        possibleTypes: fragmentTypes.possibleTypes,
        typePolicies: {},
    });

    return new ApolloClient({
        link,
        cache,
        defaultOptions: {
            // useQuery uses watchQuery while client.query uses query
            watchQuery: {
                fetchPolicy: "cache-and-network",
            },
        },
    });
};
