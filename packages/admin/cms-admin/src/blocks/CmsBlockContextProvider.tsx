import { type ApolloClient, type NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { type AxiosInstance } from "axios";
import { type ReactNode } from "react";

import { BlockContextProvider } from "./context/BlockContextProvider";

export interface CmsBlockContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    damConfig: {
        apiUrl: string;
        apiClient: AxiosInstance;
        maxFileSize: number;
        maxSrcResolution: number;
        allowedImageAspectRatios: string[];
    };
}

interface CmsBlockContextProviderProps extends Omit<CmsBlockContext, "apolloClient"> {
    children?: ReactNode;
}

export const CmsBlockContextProvider = ({ children, ...values }: CmsBlockContextProviderProps) => {
    const apolloClient = useApolloClient();
    return <BlockContextProvider value={{ ...values, apolloClient }}>{children}</BlockContextProvider>;
};
