import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { DocumentNode } from "@apollo/client/core";
import { BlockContextProvider } from "@comet/blocks-admin";
import { AxiosInstance } from "axios";
import { ReactNode } from "react";

import { DocumentInterface, DocumentType } from "../documents/types";
import { AllCategories } from "../pages/pageTree/PageTreeContext";

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
