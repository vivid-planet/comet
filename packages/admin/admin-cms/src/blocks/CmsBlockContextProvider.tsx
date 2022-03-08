import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { BlockContextProvider } from "@comet/admin-blocks";
import { UserContext } from "@vivid/react-oidc-client";
import { AxiosInstance } from "axios";
import * as React from "react";

import { AllCategories } from "../pages/pageTree/PageTreeContext";
interface CmsBlockContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    damConfig: {
        apiUrl: string;
        apiClient: AxiosInstance;
        maxFileSize: string;
        maxSrcResolution: string;
        allowedImageAspectRatios: string[];
    };
    pageTreeCategories?: AllCategories;
}

interface Props extends Omit<CmsBlockContext, "apolloClient"> {
    children: React.ReactNode;
}

function CmsBlockContextProvider({ children, ...values }: Props): React.ReactElement {
    const apolloClient = useApolloClient();

    const userContext = React.useContext(UserContext);
    React.useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/access-token-service-worker.js", { scope: "/" });
        } else {
            // eslint-disable-next-line no-console
            console.error("Service Worker is required.");
        }
        function setServiceWorkerAccessToken() {
            if (!userContext.getUser().access_token) return;
            navigator.serviceWorker.ready.then((registration) => {
                if (registration.active) {
                    registration.active.postMessage(userContext.getUser().access_token);
                }
            });
        }
        setServiceWorkerAccessToken();
        userContext.userManager.events.addUserLoaded(setServiceWorkerAccessToken);
        return () => {
            userContext.userManager.events.removeUserLoaded(setServiceWorkerAccessToken);
        };
    }, [userContext]);

    return <BlockContextProvider value={{ ...values, apolloClient }}>{children}</BlockContextProvider>;
}

export { CmsBlockContext, CmsBlockContextProvider };
