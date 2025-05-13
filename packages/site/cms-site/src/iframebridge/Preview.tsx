"use client";

import { type PropsWithChildren, useEffect, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";

import styles from "./Preview.module.scss";
import { useIFrameBridge } from "./useIFrameBridge";
import { BLOCK_PREVIEW_CONTAINER_DATA_ATTRIBUTE, PREVIEW_ELEMENT_SCROLLED_INTO_VIEW_EVENT } from "./utils";

interface Props extends PropsWithChildren {
    adminRoute: string;
    label: string;
    enabledAutoScrolling?: boolean;
}

export const Preview = ({ adminRoute, children, label, enabledAutoScrolling = true }: Props) => {
    const { addPreviewElement, removePreviewElement, ...iFrameBridge } = useIFrameBridge();
    const isSelected = adminRoute === iFrameBridge.selectedAdminRoute;
    const isHovered = adminRoute === iFrameBridge.hoveredAdminRoute;
    const previewElementContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

    useEffect(() => {
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

                        setTimeout(() => {
                            previewElementContainerRef.current?.dispatchEvent(new Event(PREVIEW_ELEMENT_SCROLLED_INTO_VIEW_EVENT));
                        }, 600);
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
            <div ref={previewElementContainerRef} className={styles.previewElementContainer} {...{ [BLOCK_PREVIEW_CONTAINER_DATA_ATTRIBUTE]: "" }}>
                {children}
            </div>
        );
    }

    return <>{children}</>;
};
