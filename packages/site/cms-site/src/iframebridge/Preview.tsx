"use client";
import * as React from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import styled from "styled-components";

import { useIFrameBridge } from "./useIFrameBridge";
import { BLOCK_PREVIEW_CONTAINER_DATA_ATTRIBUTE } from "./utils";

interface Props {
    adminRoute: string;
    label: string;
    enabledAutoScrolling?: boolean;
    children: React.ReactNode;
}

export const Preview: React.FunctionComponent<Props> = ({ adminRoute, children, label, enabledAutoScrolling = true }) => {
    const { addPreviewElement, removePreviewElement, ...iFrameBridge } = useIFrameBridge();
    const isSelected = adminRoute === iFrameBridge.selectedAdminRoute;
    const isHovered = adminRoute === iFrameBridge.hoveredAdminRoute;
    const previewElementContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const previewElement = previewElementContainerRef.current
            ? {
                  label,
                  adminRoute,
                  element: previewElementContainerRef.current,
              }
            : null;

        if (previewElement) {
            addPreviewElement(previewElement);

            return () => {
                removePreviewElement(previewElement);
            };
        }
    }, [label, adminRoute, addPreviewElement, removePreviewElement]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (enabledAutoScrolling) {
                if (isHovered || isSelected) {
                    if (previewElementContainerRef.current?.firstElementChild) {
                        scrollIntoView(previewElementContainerRef.current.firstElementChild, {
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

    if (iFrameBridge.hasBridge) {
        return (
            <PreviewElementContainer ref={previewElementContainerRef} {...{ [BLOCK_PREVIEW_CONTAINER_DATA_ATTRIBUTE]: "" }}>
                {children}
            </PreviewElementContainer>
        );
    }

    return <>{children}</>;
};

export const PreviewElementContainer = styled.div`
    display: contents;
`;
