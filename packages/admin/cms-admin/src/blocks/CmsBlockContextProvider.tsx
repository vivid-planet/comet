import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { DocumentNode } from "@apollo/client/core";
import { BlockContextProvider } from "@comet/blocks-admin";
import { AxiosInstance } from "axios";
import * as React from "react";

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
    children: React.ReactNode;
}

export const CmsBlockContextProvider: React.FunctionComponent<CmsBlockContextProviderProps> = ({ children, ...values }): React.ReactElement => {
    const apolloClient = useApolloClient();
    return <BlockContextProvider value={{ ...values, apolloClient }}>{children}</BlockContextProvider>;
};
