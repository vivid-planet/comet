import { ApolloClient, useApolloClient } from "@apollo/client";
import { BlockContextProvider } from "@comet/blocks-admin";
import { ReactNode } from "react";

import { useCometConfig } from "../config/CometConfigContext";

export interface CmsBlockContext {
    apiUrl: string;
    apolloClient: ApolloClient<object>;
}

export const CmsBlockContextProvider = ({ children, ...values }: { children: ReactNode }) => {
    const { apiUrl } = useCometConfig();
    const apolloClient = useApolloClient();

    const context: CmsBlockContext = {
        apiUrl,
        apolloClient,
    };

    return <BlockContextProvider value={context}>{children}</BlockContextProvider>;
};
