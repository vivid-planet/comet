import { type ApolloClient } from "@apollo/client";
import { createContext } from "react";

export interface BlockContext {
    apiUrl: string;
    apolloClient: ApolloClient<object>;
    damBasePath: string;
}

export const CustomBlockContext = createContext<Omit<BlockContext, "apiUrl" | "apolloClient" | "damBasePath"> | undefined>(undefined);
