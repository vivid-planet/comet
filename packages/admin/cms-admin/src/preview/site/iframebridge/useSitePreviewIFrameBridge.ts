import * as React from "react";

import { SitePreviewIFrameMessage } from "./SitePreviewIFrameMessage";

export function useSitePreviewIFrameBridge(onReceiveMessage: (message: SitePreviewIFrameMessage) => void) {
    const _onReceiveMessage = React.useCallback(
        (message: SitePreviewIFrameMessage) => {
            onReceiveMessage(message);
        },
        [onReceiveMessage],
    );

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                // Check if message is an iframe message from us -> there are more messaging from e.g webpack,etc.
                // eslint-disable-next-line no-prototype-builtins
                if (message.hasOwnProperty("cometType")) {
                    _onReceiveMessage(message as SitePreviewIFrameMessage);
                }
            } catch (e) {
                // empty
            }
        };

        window.addEventListener("message", handleMessage, false);

        return () => {
            window.removeEventListener("message", handleMessage, false);
        };
    }, [_onReceiveMessage]);
}
