import * as React from "react";

import { SitePreviewIFrameMessage, SitePreviewIFrameMessageType } from "./SitePreviewIFrameMessage";

export interface SitePreviewIFrameBridgeContext {
    sendMessage: (message: SitePreviewIFrameMessage) => void;
}

export const SitePreviewIFrameBridgeContext = React.createContext<SitePreviewIFrameBridgeContext>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendMessage: (message: SitePreviewIFrameMessage) => {
        //empty
    },
});

export const SitePreviewIFrameBridgeProvider: React.FunctionComponent = ({ children }) => {
    const sendMessage = (message: SitePreviewIFrameMessage) => {
        window.parent.postMessage(JSON.stringify(message), "*");
    };

    React.useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        sendMessage({ cometType: SitePreviewIFrameMessageType.Ready });
    }, []);

    return (
        <SitePreviewIFrameBridgeContext.Provider
            value={{
                sendMessage,
            }}
        >
            <div>{children}</div>
        </SitePreviewIFrameBridgeContext.Provider>
    );
};
