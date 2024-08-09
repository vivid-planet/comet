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
    const { cookiePlatformLoaded } = useCookieApi();
    const { previewType } = usePreview();
    const isInPreview = previewType !== "NoPreview";

    if ((cookiePlatformLoaded && consented) || isInPreview) {
        return <>{children}</>;
    }

    if (!cookiePlatformLoaded) {
        return <>{loading}</>;
    }

    return <>{fallback}</>;
};
