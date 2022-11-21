import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { DocumentNode } from "@apollo/client/core";
import { BlockContextProvider } from "@comet/blocks-admin";
import { useAuthorization } from "@comet/react-app-auth";
import { AxiosInstance } from "axios";
import * as React from "react";

import { DocumentInterface, DocumentType } from "../documents/types";
import { AllCategories } from "../pages/pageTree/PageTreeContext";
export interface CmsBlockContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    damConfig: {
        apiUrl: string;
        apiClient: AxiosInstance;
        maxFileSize: string;
        maxSrcResolution: string;
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

    const authorization = useAuthorization();
    React.useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/access-token-service-worker.js", { scope: "/" });
        } else {
            // eslint-disable-next-line no-console
            console.error("Service Worker is required.");
        }
        const subscription = authorization?.authorizationManager.onOAuthChange((oAuth) => {
            navigator.serviceWorker.ready.then((registration) => {
                if (registration.active) {
                    if (oAuth?.accessToken) {
                        registration.active.postMessage(oAuth.accessToken);
                    }
                }
            });
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [authorization]);

    return <BlockContextProvider value={{ ...values, apolloClient }}>{children}</BlockContextProvider>;
};
