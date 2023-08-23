import { useRouter } from "next/router";
import * as React from "react";

import { PreviewContext } from "../preview/PreviewContext";
import { sendSitePreviewIFrameMessage } from "./iframebridge/sendSitePreviewIFrameMessage";
import { SitePreviewIFrameLocationMessage, SitePreviewIFrameMessageType } from "./iframebridge/SitePreviewIFrameMessage";

interface Props {
    previewPath?: string;
}

export const SitePreviewProvider: React.FunctionComponent<Props> = ({ children }) => {
    const router = useRouter();

    React.useEffect(() => {
        function sendUpstreamMessage() {
            const url = new URL(router.asPath, window.location.origin);
            const { pathname, searchParams } = url;

            const message: SitePreviewIFrameLocationMessage = {
                cometType: SitePreviewIFrameMessageType.SitePreviewLocation,
                data: { search: searchParams.toString(), pathname },
            };
            sendSitePreviewIFrameMessage(message);
        }
        sendUpstreamMessage();
        window.addEventListener("load", sendUpstreamMessage);
        () => {
            window.removeEventListener("load", sendUpstreamMessage);
        };
    }, [router]);

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
