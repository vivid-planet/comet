import * as React from "react";
import { useLocation } from "react-router";

import { useIFrameBridge } from "./useIFrameBridge";

export const SelectPreviewComponent: React.FunctionComponent = ({ children }) => {
    const location = useLocation();
    const iFrameBridge = useIFrameBridge();

    React.useEffect(() => {
        if (iFrameBridge.iFrameReady) {
            iFrameBridge.sendSelectComponent(`${location.pathname}${location.hash}`);
        }
    }, [location.pathname, iFrameBridge, location.hash]);

    return <>{children}</>;
};
