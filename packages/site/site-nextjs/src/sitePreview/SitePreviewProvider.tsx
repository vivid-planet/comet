"use client";
import { PreviewContext } from "@comet/site-react";
import { usePathname, useSearchParams } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

import { sendSitePreviewIFrameMessage } from "./iframebridge/sendSitePreviewIFrameMessage";
import { type SitePreviewIFrameLocationMessage, SitePreviewIFrameMessageType } from "./iframebridge/SitePreviewIFrameMessage";

const SitePreview = ({ children }: PropsWithChildren) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        function sendUpstreamMessage() {
            const message: SitePreviewIFrameLocationMessage = {
                cometType: SitePreviewIFrameMessageType.SitePreviewLocation,
                data: { search: searchParams.toString(), pathname },
            };
            sendSitePreviewIFrameMessage(message);
        }
        sendUpstreamMessage();
        window.addEventListener("load", sendUpstreamMessage);
        return () => {
            window.removeEventListener("load", sendUpstreamMessage);
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
