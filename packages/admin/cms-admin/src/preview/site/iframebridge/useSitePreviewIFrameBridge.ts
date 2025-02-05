import { useEffect } from "react";

import { type SitePreviewIFrameMessage, SitePreviewIFrameMessageType } from "./SitePreviewIFrameMessage";

export function useSitePreviewIFrameBridge(onReceiveMessage: (message: SitePreviewIFrameMessage) => void) {
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            let message;
            try {
                message = JSON.parse(event.data);
            } catch {
                // empty
            }
            // Check if message is an iframe message from us -> there are more messaging from e.g webpack,etc.
            if (
                message &&
                Object.prototype.hasOwnProperty.call(message, "cometType") &&
                (message.cometType == SitePreviewIFrameMessageType.OpenLink || message.cometType == SitePreviewIFrameMessageType.SitePreviewLocation)
            ) {
                onReceiveMessage(message as SitePreviewIFrameMessage);
            }
        };

        window.addEventListener("message", handleMessage, false);

        return () => {
            window.removeEventListener("message", handleMessage, false);
        };
    }, [onReceiveMessage]);
}
