import { signIn, useSession } from "next-auth/client";
import * as React from "react";

import { IFrameBridgeContext } from "../iframebridge/IFrameBridge";
import { SitePreviewProvider } from "./SitePreviewProvider";

interface SitePreviewPageProps {
    validateLogin?: React.ReactNode;
    loggingIn?: React.ReactNode;
    initializeServiceWorker?: React.ReactNode;
    serviceWorkerNotSupported?: React.ReactNode;
}
export const SitePreviewPage: React.FunctionComponent<SitePreviewPageProps> = ({
    children,
    validateLogin = <div>Checking login...</div>,
    loggingIn = <div>Logging in...</div>,
    initializeServiceWorker = <div>Initializing Service Worker...</div>,
    serviceWorkerNotSupported = <div>Service Worker are required</div>,
}) => {
    const [session, loading] = useSession();

    const [serviceWorkerReady, setServiceWorkerReady] = React.useState(false);
    const [serviceWorkerSupported, setServiceWorkerSupported] = React.useState(true);

    React.useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/access-token-service-worker.js", { scope: "/" });
        } else {
            setServiceWorkerSupported(false);
        }
    }, []);

    // https://next-auth.js.org/tutorials/refresh-token-rotation#client-side
    React.useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            signIn("vivid-planet-idp"); // Force sign in to hopefully resolve error
        }
    }, [session]);

    React.useEffect(() => {
        if (!loading && session && session.accessToken && !session.error) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.active?.postMessage(session.accessToken);
                setServiceWorkerReady(true);
            });
        }
    }, [loading, session]);

    if (loading) {
        return <>{validateLogin}</>;
    }
    if (!session) {
        signIn("vivid-planet-idp"); // See ../api/auth/[...nextauth].ts
        return <>{loggingIn}</>;
    }
    if (!serviceWorkerSupported) {
        return <>{serviceWorkerNotSupported}</>;
    }
    if (!serviceWorkerReady) {
        return <>{initializeServiceWorker}</>;
    }

    return (
        // Legacy context for deprecated IFrameBridge.sendMessage method. Remove in a future version.
        <IFrameBridgeContext.Provider
            value={{
                hasBridge: true,
                showOutlines: false,
                sendSelectComponent: () => {
                    // noop
                },
                sendHoverComponent: () => {
                    // noop
                },
                sendMessage: (message) => {
                    window.parent.postMessage(JSON.stringify(message), "*");
                },
            }}
        >
            <SitePreviewProvider previewPath="/preview">{children}</SitePreviewProvider>
        </IFrameBridgeContext.Provider>
    );
};
