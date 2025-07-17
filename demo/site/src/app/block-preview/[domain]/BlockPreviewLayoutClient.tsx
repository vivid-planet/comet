"use client";
import { type PublicSiteConfig } from "@src/site-configs";
import { type PropsWithChildren, useEffect } from "react";

let currentSiteConfigDomain;
if (typeof window !== "undefined") {
    // monkey patch the fetch function to include the scope in the headers
    const originalFetch = window.fetch;
    window.fetch = async (input, init: RequestInit = {}) => {
        const headers = new Headers(init.headers);
        if (currentSiteConfigDomain) {
            headers.set("X-Comet-Block-Preview-Domain", currentSiteConfigDomain);
        }
        return originalFetch(input, { ...init, headers });
    };
}
export function BlockPreviewLayoutClient({ siteConfig, children }: Readonly<PropsWithChildren<{ siteConfig: PublicSiteConfig }>>) {
    useEffect(() => {
        currentSiteConfigDomain = siteConfig.scope.domain;
    }, [siteConfig]);
    return children;
}
