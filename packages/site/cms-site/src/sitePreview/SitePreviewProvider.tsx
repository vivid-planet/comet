"use client";
import { usePathname } from "next/navigation";
import * as React from "react";

import { PreviewContext } from "../preview/PreviewContext";
import { sendSitePreviewIFrameMessage } from "./iframebridge/sendSitePreviewIFrameMessage";
import { SitePreviewIFrameLocationMessage, SitePreviewIFrameMessageType } from "./iframebridge/SitePreviewIFrameMessage";

const SitePreview: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();

    React.useEffect(() => {
        function sendUpstreamMessage() {
            const message: SitePreviewIFrameLocationMessage = {
                cometType: SitePreviewIFrameMessageType.SitePreviewLocation,
                data: { search: location.search, pathname },
            };
            sendSitePreviewIFrameMessage(message);
        }
        sendUpstreamMessage();
        window.addEventListener("load", sendUpstreamMessage);
        () => {
            window.removeEventListener("load", sendUpstreamMessage);
        };
    }, [pathname]);

    return (
        <PreviewContext.Provider
            value={{
                previewType: "SitePreview",
                showPreviewSkeletons: false,
            }}
        >
            {children}
        </PreviewContext.Provider>
    );
};

export const SitePreviewProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    return <SitePreview>{children}</SitePreview>;
};
