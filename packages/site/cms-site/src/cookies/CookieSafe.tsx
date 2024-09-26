"use client";

import { usePreview } from "../preview/usePreview";
import { useCookieApi } from "./CookieApiContext";

type Props = React.PropsWithChildren<{
    consented: boolean;
    fallback: React.ReactNode;
    loading: React.ReactNode;
}>;

export const CookieSafe = ({ consented, fallback, loading, children }: Props) => {
    const { initialized } = useCookieApi();
    const { previewType } = usePreview();
    const isInPreview = previewType !== "NoPreview";

    if ((initialized && consented) || isInPreview) {
        return <>{children}</>;
    }

    if (!initialized) {
        return <>{loading}</>;
    }

    return <>{fallback}</>;
};
