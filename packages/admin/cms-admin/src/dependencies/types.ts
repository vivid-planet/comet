import { ApolloClient } from "@apollo/client";
import { ReactNode } from "react";

export interface DependencyInterface {
    displayName: ReactNode;
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