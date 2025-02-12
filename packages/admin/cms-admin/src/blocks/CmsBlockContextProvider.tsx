import { type ApolloClient, type NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { type DocumentNode } from "@apollo/client/core";
import { type AxiosInstance } from "axios";
import { type ReactNode } from "react";

import { type DocumentInterface, type DocumentType } from "../documents/types";
import { type AllCategories } from "../pages/pageTree/PageTreeContext";
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
    pageTreeCategories: AllCategories;
    pageTreeDocumentTypes: Record<DocumentType, DocumentInterface>;
    additionalPageTreeNodeFragment?: {
        name: string;
        fragment: DocumentNode;
    };
}

interface CmsBlockContextProviderProps extends Omit<CmsBlockContext, "apolloClient"> {
    children?: ReactNode;
}

export const CmsBlockContextProvider = ({ children, ...values }: CmsBlockContextProviderProps) => {
    const apolloClient = useApolloClient();
    return <BlockContextProvider value={{ ...values, apolloClient }}>{children}</BlockContextProvider>;
};
