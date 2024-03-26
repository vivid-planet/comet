"use client";
import * as React from "react";
import scrollIntoView from "scroll-into-view-if-needed";

import { ComponentTitle, Root, Selection } from "./Preview.sc";
import { useIFrameBridge } from "./useIFrameBridge";

interface PreviewProps {
    adminRoute: string;
    type: string;
    enabledAutoScrolling?: boolean;
    children: React.ReactNode;
}

export const Preview: React.FunctionComponent<PreviewProps> = ({ adminRoute, type, children, enabledAutoScrolling = true }) => {
    const iFrameBridge = useIFrameBridge();
    const isSelected = adminRoute === iFrameBridge.selectedAdminRoute;
    const isHovered = adminRoute === iFrameBridge.hoveredAdminRoute;
    const rootEl = React.useRef<HTMLDivElement | null>(null);

    // scroll block into view when it gets selected
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (enabledAutoScrolling) {
                if (isHovered || isSelected) {
                    if (rootEl.current) {
                        scrollIntoView(rootEl.current, {
                            scrollMode: "if-needed",
                            block: "center",
                            inline: "nearest",
                            behavior: "smooth",
                        });
                    }
                }
            }
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [enabledAutoScrolling, isHovered, isSelected]);

    return iFrameBridge.hasBridge ? (
        <Root ref={rootEl} isSelected={isSelected} isHovered={isHovered} showOutlines={iFrameBridge.showOutlines}>
            <Selection
                showOutlines={iFrameBridge.showOutlines}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={() => {
                    iFrameBridge.sendSelectComponent(adminRoute);
                }}
                onMouseEnter={() => {
                    iFrameBridge.sendHoverComponent(adminRoute);
                }}
                onMouseLeave={() => {
                    iFrameBridge.sendHoverComponent(null);
                }}
            >
                {isSelected && <ComponentTitle>{type}</ComponentTitle>}
            </Selection>
            {children}
        </Root>
    ) : (
        <>{children}</>
    );
};
