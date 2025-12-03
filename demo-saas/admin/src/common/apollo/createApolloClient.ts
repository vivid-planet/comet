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

    const tenantContextLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                ...{ "x-tenant-id": "0d371ebf-1e8f-4082-a4cf-015709a93289" },
            },
        };
    });

    const link = ApolloLink.from([createErrorDialogApolloLink(), includeInvisibleContentContext, tenantContextLink, httpLink]);

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
