import * as React from "react";

import { IFrameBridgeProvider } from "../iframebridge/IFrameBridge";
import { SitePreviewProvider } from "./SitePreviewProvider";

export const PreviewPage: React.FunctionComponent = ({ children }) => {
    return (
        <IFrameBridgeProvider>
            <SitePreviewProvider previewPath="/preview">{children}</SitePreviewProvider>
        </IFrameBridgeProvider>
    );
};
