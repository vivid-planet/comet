import { ApolloClient } from "@apollo/client";
import * as React from "react";

export interface DependencyInterface {
    displayName: React.ReactNode;
    resolveRoute: ({
        rootColumnName,
        jsonPath,
        apolloClient,
        id,
    }: {
        rootColumnName?: string;
        jsonPath?: string;
        apolloClient: ApolloClient<unknown>;
        id: string;
    }) => Promise<string>;
}
