import { ApolloClient, ApolloLink } from "@apollo/client";
import { includeInvisibleContentContext } from "@comet/admin-cms";
import { createAuthorizationLink } from "@comet/react-app-auth";

import { authorizationConfig } from "../authorization/authorizationConfig";
import { refreshHandler } from "../authorization/refreshHandler";
import { inMemoryCache } from "./inMemoryCache";
import { httpLink } from "./links/httpLink";

const link = ApolloLink.from([
    includeInvisibleContentContext,
    createAuthorizationLink({ authorizationConfig, refreshHandler: refreshHandler }),
    httpLink,
]);

export const apolloClient = new ApolloClient({
    link,
    cache: inMemoryCache,
});
