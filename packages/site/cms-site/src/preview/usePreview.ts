import { useCallback, useContext } from "react";

import { useIFrameBridge } from "../iframebridge/useIFrameBridge";
import { isWithPreviewPropsData } from "../iframebridge/withPreview";
import { PreviewContext, PreviewContextOptions } from "./PreviewContext";

export interface PreviewHookReturn extends PreviewContextOptions {
    isSelected: (urlOrBlock: string | object, options?: { exactMatch?: boolean }) => boolean | undefined;
    isHovered: (urlOrBlock: string | object, options?: { exactMatch?: boolean }) => boolean | undefined;
}

export function usePreview(): PreviewHookReturn {
    const iFrameBridge = useIFrameBridge();
    const previewContext = useContext(PreviewContext);
    const isSelected = useCallback(
        (urlOrBlock: string | object, options?: { exactMatch?: boolean }) => {
            let url: string;

            if (typeof urlOrBlock === "string") {
                url = urlOrBlock;
            } else if (isWithPreviewPropsData(urlOrBlock) && urlOrBlock.adminMeta) {
                url = urlOrBlock.adminMeta.route;
            } else {
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
        (urlOrBlock: string | object, options?: { exactMatch?: boolean }) => {
            let url: string;

            if (typeof urlOrBlock === "string") {
                url = urlOrBlock;
            } else if (isWithPreviewPropsData(urlOrBlock) && urlOrBlock.adminMeta) {
                url = urlOrBlock.adminMeta.route;
            } else {
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
