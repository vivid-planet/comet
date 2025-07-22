"use client";

import { type PropsWithChildren } from "react";

import { useIFrameBridge } from "../iframebridge/useIFrameBridge";
import { PreviewContext } from "./PreviewContext";

let currentEncryptedContentScope: string | null = null;
if (typeof window !== "undefined") {
    // monkey patch the fetch function to include the scope in the headers
    const originalFetch = window.fetch;
    window.fetch = async (input, init: RequestInit = {}) => {
        const headers = new Headers(init.headers);
        if (currentEncryptedContentScope) {
            headers.set("X-Block-Preview", currentEncryptedContentScope);
        }
        return originalFetch(input, { ...init, headers });
    };
}

export const BlockPreviewProvider = ({ children }: PropsWithChildren) => {
    const { encryptedContentScope } = useIFrameBridge();
    currentEncryptedContentScope = encryptedContentScope;

    return (
        <PreviewContext.Provider
            value={{
                previewType: "BlockPreview",
                showPreviewSkeletons: true,
            }}
        >
            {children}
        </PreviewContext.Provider>
    );
};
