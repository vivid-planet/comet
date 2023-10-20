import { ApolloClient } from "@apollo/client";
import * as React from "react";

export interface DependencyInterface {
    displayName: React.ReactNode;
    getUrl: ({
        rootColumnName,
        jsonPath,
        contentScopeUrl,
        apolloClient,
        id,
    }: {
        rootColumnName: string;
        jsonPath: string;
        contentScopeUrl: string;
        apolloClient: ApolloClient<unknown>;
        id: string;
    }) => Promise<string>;
}
