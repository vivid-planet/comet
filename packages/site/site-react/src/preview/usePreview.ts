import { useCallback, useContext } from "react";

import { useIFrameBridge } from "../iframebridge/useIFrameBridge";
import { PreviewContext, type PreviewContextOptions } from "./PreviewContext";

interface PreviewHookReturn extends PreviewContextOptions {
    isSelected: (url: string, options?: { exactMatch?: boolean }) => boolean;
    isHovered: (url: string, options?: { exactMatch?: boolean }) => boolean;
}

export function usePreview(): PreviewHookReturn {
    const iFrameBridge = useIFrameBridge();
    const previewContext = useContext(PreviewContext);
    const isSelected = useCallback(
        (url: string, options?: { exactMatch?: boolean }) => {
            if (!iFrameBridge.selectedAdminRoute) {
                return false;
            }

            const exactMatch = options?.exactMatch ?? true;

            if (exactMatch) {
                return url === iFrameBridge.selectedAdminRoute;
            } else {
                return iFrameBridge.selectedAdminRoute?.startsWith(url);
            }
        },
        [iFrameBridge.selectedAdminRoute],
    );

    const isHovered = useCallback(
        (url: string, options?: { exactMatch?: boolean }) => {
            if (!iFrameBridge.hoveredAdminRoute) {
                return false;
            }

            const exactMatch = options?.exactMatch ?? true;

            if (exactMatch) {
                return url === iFrameBridge.hoveredAdminRoute;
            } else {
                return iFrameBridge.hoveredAdminRoute?.startsWith(url);
            }
        },
        [iFrameBridge.hoveredAdminRoute],
    );
    return { ...previewContext, isSelected, isHovered };
}
