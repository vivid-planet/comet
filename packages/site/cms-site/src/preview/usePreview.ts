import * as React from "react";

import { useIFrameBridge } from "../iframebridge/useIFrameBridge";
import { PreviewContext, PreviewContextOptions } from "./PreviewContext";

export interface PreviewHookReturn extends PreviewContextOptions {
    isSelected: (url: string) => boolean;
    isHovered: (url: string) => boolean;
}

export function usePreview(): PreviewHookReturn {
    const iFrameBridge = useIFrameBridge();
    const previewContext = React.useContext(PreviewContext);
    const isSelected = React.useCallback(
        (url: string) => {
            return url === iFrameBridge.selectedAdminRoute;
        },
        [iFrameBridge.selectedAdminRoute],
    );

    const isHovered = React.useCallback(
        (url: string) => {
            return url === iFrameBridge.hoveredAdminRoute;
        },
        [iFrameBridge.hoveredAdminRoute],
    );
    return { ...previewContext, isSelected, isHovered };
}
