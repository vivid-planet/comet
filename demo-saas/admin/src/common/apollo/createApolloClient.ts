import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createErrorDialogApolloLink } from "@comet/admin";
import { includeInvisibleContentContext } from "@comet/cms-admin";
import fragmentTypes from "@src/fragmentTypes.json";

export const createApolloClient = (apiUrl: string) => {
    const httpLink = new HttpLink({
        uri: `${apiUrl}/graphql`,
        credentials: "include",
    });

    const tenantContext = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                ...{ "x-tenant-id": "f9c86c6c-0625-46c0-9be5-bee3a14cc7f4" },
            },
        };
    });

    const link = ApolloLink.from([createErrorDialogApolloLink(), includeInvisibleContentContext, tenantContext, httpLink]);

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
