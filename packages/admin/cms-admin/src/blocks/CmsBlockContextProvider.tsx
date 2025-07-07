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
    /**
     * Specifies which dimensions of the content scope should be used for the page tree scope.
     *
     * @example
     * // Dimension "domain" is used for the page tree scope
     * <CmsBlockContextProvider pageTreeScopeParts={["domain"]} />
     */
    // TODO move to CometConfigProvider in Comet v8
    pageTreeScopeParts?: string[];
}

interface CmsBlockContextProviderProps extends Omit<CmsBlockContext, "apolloClient"> {
    children?: ReactNode;
}

export const CmsBlockContextProvider = ({ children, ...values }: CmsBlockContextProviderProps) => {
    const apolloClient = useApolloClient();
    return <BlockContextProvider value={{ ...values, apolloClient }}>{children}</BlockContextProvider>;
};
