import { type ReactNode, useEffect } from "react";
import { useLocation } from "react-router";

import { useIFrameBridge } from "./useIFrameBridge";

export const SelectPreviewComponent = ({ children }: { children?: ReactNode }) => {
    const location = useLocation();
    const iFrameBridge = useIFrameBridge();

    useEffect(() => {
        if (iFrameBridge.iFrameReady) {
            iFrameBridge.sendSelectComponent(`${location.pathname}${location.hash}`);
        }
    }, [location.pathname, iFrameBridge, location.hash]);

    return <>{children}</>;
};
