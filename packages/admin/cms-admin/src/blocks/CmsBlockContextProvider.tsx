import { type ApolloClient, type NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { type PropsWithChildren } from "react";

import { useCometConfig } from "../config/CometConfigContext";
import { BlockContextProvider } from "./context/BlockContextProvider";

export interface CmsBlockContext {
    apiUrl: string;
    apolloClient: ApolloClient<NormalizedCacheObject>;
}

export const CmsBlockContextProvider = ({ children }: PropsWithChildren) => {
    const { apiUrl } = useCometConfig();
    const apolloClient = useApolloClient();
    return <BlockContextProvider value={{ apiUrl, apolloClient }}>{children}</BlockContextProvider>;
};
