import * as React from "react";
import { useRouteMatch } from "react-router";
import scrollIntoView from "scroll-into-view-if-needed";

import * as sc from "./HoverPreviewComponent.sc";
import { useIFrameBridge } from "./useIFrameBridge";

interface IHoverPreviewComponentProps {
    componentSlug: string;
}
export const HoverPreviewComponent: React.FunctionComponent<IHoverPreviewComponentProps> = ({ children, componentSlug }) => {
    const match = useRouteMatch();
    const iFrameBridge = useIFrameBridge();
    const rootEl = React.useRef<HTMLDivElement | null>(null);

    const componentRoute = componentSlug.startsWith("#") ? `${match.url}${componentSlug}` : `${match.url}/${componentSlug}`;

    const isHovered = iFrameBridge.hoveredSiteRoute?.includes(componentRoute) ?? false;
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (isHovered) {
                if (rootEl.current) {
                    scrollIntoView(rootEl.current, {
                        scrollMode: "if-needed",
                        block: "center",
                        inline: "nearest",
                        behavior: "smooth",
                    });
                }
            }
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [isHovered]);

    return (
        <sc.Root
            ref={rootEl}
            onMouseOver={(e) => {
                if (iFrameBridge.iFrameReady) {
                    iFrameBridge.sendHoverComponent(componentRoute);
                    e.stopPropagation();
                }
            }}
            onMouseLeave={(e) => {
                if (iFrameBridge.iFrameReady) {
                    iFrameBridge.sendHoverComponent(null);
                    e.stopPropagation();
                }
            }}
        >
            <sc.Hover isHovered={isHovered} />
            <sc.Children>{children}</sc.Children>
        </sc.Root>
    );
};
