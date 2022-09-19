import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, PossibleTypesMap } from "@apollo/client";
import { createErrorDialogApolloLink } from "@comet/admin";
import { includeInvisibleContentContext, offsetLimitPagination } from "@comet/cms-admin";
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

    const possibleTypes: PossibleTypesMap = {};
    for (const type of fragmentTypes.__schema.types) {
        possibleTypes[type.name] = type.possibleTypes.map((possibleType) => possibleType.name);
    }

    const cache = new InMemoryCache({
        possibleTypes,
        typePolicies: {
            Query: {
                fields: {
                    damItemsList: offsetLimitPagination(["folderId", "includeArchived", "filter", "sortColumnName", "sortDirection"]),
                },
            },
        },
    });

    return new ApolloClient({
        link,
        cache,
    });
};
