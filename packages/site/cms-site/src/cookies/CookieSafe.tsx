"use client";
import React from "react";

import { usePreview } from "../preview/usePreview";

type Props = React.PropsWithChildren<{
    consented: boolean;
    fallback: React.ReactNode;
}>;

// TODO: The Fallback is currently also rendered, when the page has loaded, but the cookie-banner has not been loaded yet.
// - Maybe store the consented cookies in local-storage and use that value until the cookie-banner has been loaded.

export const CookieSafe = ({ consented, fallback, children }: Props) => {
    const [isBeingRenderedOnClient, setIsBeingRenderedOnClient] = React.useState(false);
    const { previewType } = usePreview();
    const isInPreview = previewType !== "NoPreview";

    React.useEffect(() => {
        setIsBeingRenderedOnClient(true);
    }, []);

    // TODO: Find a better better alternative to this workaround.
    // This is to prevent broken/missing styles/html, possibly caused during rehydration, due to a mismatch between server- and client-html.
    if (!isBeingRenderedOnClient) {
        return null;
    }

    if (consented || isInPreview) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
