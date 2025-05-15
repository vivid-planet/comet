"use client";
import { type PropsWithChildren, useEffect, useState } from "react";

import { PreviewContext } from "../preview/PreviewContext";
import { sendSitePreviewIFrameMessage } from "./iframebridge/sendSitePreviewIFrameMessage";
import { type SitePreviewIFrameLocationMessage, SitePreviewIFrameMessageType } from "./iframebridge/SitePreviewIFrameMessage";

const SitePreview = ({ children }: PropsWithChildren) => {
    const [pathname, setPathname] = useState<string>(window.location.pathname);
    const [searchParams, setSearchParams] = useState<string>(window.location.search);

    useEffect(() => {
        function updateLocation() {
            setPathname(window.location.pathname);
            setSearchParams(window.location.search);
        }

        function sendUpstreamMessage() {
            const message: SitePreviewIFrameLocationMessage = {
                cometType: SitePreviewIFrameMessageType.SitePreviewLocation,
                data: { search: searchParams, pathname },
            };
            sendSitePreviewIFrameMessage(message);
        }

        sendUpstreamMessage();
        window.addEventListener("load", sendUpstreamMessage);
        window.addEventListener("popstate", updateLocation);

        return () => {
            window.removeEventListener("load", sendUpstreamMessage);
            window.removeEventListener("popstate", updateLocation);
        };
    }, [pathname, searchParams]);

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

export const SitePreviewProvider = ({ children }: PropsWithChildren) => {
    return <SitePreview>{children}</SitePreview>;
};
