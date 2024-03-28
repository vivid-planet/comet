import { ApolloClient } from "@apollo/client";
import * as React from "react";

export interface DependencyInterface {
    displayName: React.ReactNode;
    resolvePath: ({
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
