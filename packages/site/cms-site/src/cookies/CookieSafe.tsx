"use client";
import React from "react";

import { usePreview } from "../preview/usePreview";
import { useCookieApi } from "./CookieApiContext";

type Props = React.PropsWithChildren<{
    consented: boolean;
    fallback: React.ReactNode;
    loading: React.ReactNode;
}>;

export const CookieSafe = ({ consented, fallback, loading, children }: Props) => {
    const [isBeingRenderedOnClient, setIsBeingRenderedOnClient] = React.useState(false);
    const { cookieProviderLoaded } = useCookieApi();
    const { previewType } = usePreview();
    const isInPreview = previewType !== "NoPreview";

    React.useEffect(() => {
        // TODO: figure out if this is resolved with the loading/cookieProviderLoaded stuff.
        // TODO: Find a better alternative to this workaround.
        // This is to prevent broken/missing styles/html, possibly caused during rehydration, due to a mismatch between server- and client-html.
        setIsBeingRenderedOnClient(true);
    }, []);

    if (!isBeingRenderedOnClient || !cookieProviderLoaded) {
        return <>{loading}</>;
    }

    if (consented || isInPreview) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
