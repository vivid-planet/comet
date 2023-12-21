import React from "react";

import { Tooltip } from "./common/Tooltip";

export interface EllipsisTooltipProps {
    children?: React.ReactNode;
}

export const EllipsisTooltip = ({ children }: EllipsisTooltipProps) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLSpanElement>(null);

    const [renderWithTooltip, setRenderWithTooltip] = React.useState(false);

    const updateRenderWithTooltip = React.useCallback(() => {
        if (rootRef.current && contentRef.current) {
            setRenderWithTooltip(contentRef.current.offsetWidth > rootRef.current.clientWidth);
        }
        // The dependency array items must be `.current`, otherwise the callback will not be called, when the html-element is rendered.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rootRef.current, contentRef.current]);

    React.useEffect(() => {
        const rootElement = rootRef.current;
        const resizeObserver = new ResizeObserver(updateRenderWithTooltip);
        const mutationObserver = new MutationObserver(updateRenderWithTooltip);

        if (rootElement) {
            resizeObserver.observe(rootElement);
            mutationObserver.observe(rootElement, {
                characterData: true,
                childList: true,
                subtree: true,
            });
        }

        return () => {
            if (rootElement) {
                resizeObserver.unobserve(rootElement);
            }

            mutationObserver.disconnect();
        };
    }, [rootRef, contentRef, updateRenderWithTooltip]);

    const content = <span ref={contentRef}>{children}</span>;

    return (
        <div
            style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}
            ref={rootRef}
        >
            {renderWithTooltip ? (
                <Tooltip PopperProps={{ anchorEl: rootRef.current }} title={children}>
                    {content}
                </Tooltip>
            ) : (
                content
            )}
        </div>
    );
};
