import React from "react";

import { useRouter } from "../router/useRouter";

type Props = React.PropsWithChildren<{
    consented: boolean;
    fallback: React.ReactNode;
}>;

// TODO: The Fallback is currently also rendered, when the page has loaded, but the cookie-banner has not been loaded yet.
// - Maybe store the consented cookies in local-storage and use that value until the cookie-banner has been loaded.
// - Maybe add a delay to the localStorage cookie-api, to simulate the loading of the cookie-banner locally.

export const CookieSafe = ({ consented, fallback, children }: Props) => {
    const isInAdminPreview = useRouter().route.length === 0;
    const [isBeingRenderedOnClient, setIsBeingRenderedOnClient] = React.useState(false);

    React.useEffect(() => {
        setIsBeingRenderedOnClient(true);
    }, []);

    // TODO: Find a better better alternative to this workaround.
    // This is to prevent broken/missing styles/html, possibly caused during rehydration, due to a mismatch between server- and client-html.
    if (!isBeingRenderedOnClient) {
        return null;
    }

    if (consented || isInAdminPreview) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
