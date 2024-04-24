"use client";
import * as React from "react";
import styled from "styled-components";
import { useDebouncedCallback } from "use-debounce";

import { AdminMessage, AdminMessageType, IFrameMessage, IFrameMessageType } from "./IFrameMessage";
import { PreviewOverlay } from "./PreviewOverlay";
import { getCombinedPositioningOfElements, getRecursiveChildrenOfPreviewElement } from "./utils";

export type PreviewElement = {
    element: HTMLElement;
    adminRoute: string;
    label: string;
};

export type OverlayElementData = {
    adminRoute: string;
    label: string;
    position: {
        zIndex: number;
        top: number;
        left: number;
        width: number;
        height: number;
    };
};

export interface IFrameBridgeContext {
    hasBridge: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    block?: any;
    showOnlyVisible: boolean;
    selectedAdminRoute?: string;
    hoveredAdminRoute?: string;
    sendSelectComponent: (id: string) => void;
    sendHoverComponent: (route: string | null) => void;
    /**
     * @deprecated Use sendSitePreviewIFrameMessage instead
     */
    sendMessage: (message: IFrameMessage) => void;
    showOutlines: boolean;
    contentScope: unknown;
    previewElementsData: OverlayElementData[];
    addPreviewElement: (element: PreviewElement) => void;
    removePreviewElement: (element: PreviewElement) => void;
}

export const IFrameBridgeContext = React.createContext<IFrameBridgeContext>({
    hasBridge: false,
    showOutlines: false,
    showOnlyVisible: false,
    sendSelectComponent: () => {
        // empty
    },
    sendHoverComponent: () => {
        // empty
    },
    sendMessage: () => {
        //empty
    },
    contentScope: undefined,
    previewElementsData: [],
    removePreviewElement: () => {
        // empty
    },
    addPreviewElement: () => {
        // empty
    },
});

export const IFrameBridgeProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const [block, setBlock] = React.useState<unknown | undefined>(undefined);
    const [showOnlyVisible, setShowOnlyVisible] = React.useState<boolean>(false);
    const [selectedAdminRoute, setSelectedAdminRoute] = React.useState<string | undefined>(undefined);
    const [hoveredAdminRoute, setHoveredAdminRoute] = React.useState<string | undefined>(undefined);
    const [showOutlines, setShowOutlines] = React.useState<boolean>(false);
    const [contentScope, setContentScope] = React.useState<unknown>(undefined);
    const [previewElements, setPreviewElements] = React.useState<PreviewElement[]>([]);
    const [recalculatePreviewDataIndex, setRecalculatePreviewDataIndex] = React.useState<number>(0);

    const childrenWrapperRef = React.useRef<HTMLDivElement>(null);

    const triggerRecalculationOfPreviewData = React.useCallback(() => {
        setRecalculatePreviewDataIndex((index) => index + 1);
    }, []);

    React.useEffect(() => {
        if (childrenWrapperRef.current) {
            const mutationObserver = new MutationObserver(() => {
                triggerRecalculationOfPreviewData();
            });

            const resizeObserver = new ResizeObserver(() => {
                triggerRecalculationOfPreviewData();
            });

            mutationObserver.observe(childrenWrapperRef.current, { childList: true, subtree: true });
            resizeObserver.observe(childrenWrapperRef.current);

            return () => {
                mutationObserver.disconnect();
                resizeObserver.disconnect();
            };
        }
    }, [triggerRecalculationOfPreviewData]);

    const calculatedPreviewElementsData: OverlayElementData[] = React.useMemo(() => {
        return previewElements
            .map((previewElement) => {
                const childNodes = getRecursiveChildrenOfPreviewElement(previewElement.element);
                const positioning = getCombinedPositioningOfElements(childNodes);

                return {
                    adminRoute: previewElement.adminRoute,
                    label: previewElement.label,
                    position: {
                        top: positioning.top,
                        left: positioning.left,
                        width: positioning.width,
                        height: positioning.height,
                    },
                };
            })
            .sort((previousElementData, nextElementData) => {
                const previousSize = previousElementData.position.width * previousElementData.position.height;
                const nextSize = nextElementData.position.width * nextElementData.position.height;
                return nextSize - previousSize;
            })
            .map((elementData, index) => {
                return {
                    ...elementData,
                    position: {
                        ...elementData.position,
                        zIndex: index + 1,
                    },
                };
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewElements, recalculatePreviewDataIndex]);

    const sendMessage = (message: IFrameMessage) => {
        window.parent.postMessage(JSON.stringify(message), "*");
    };

    const debounceDeactivateOutlines = useDebouncedCallback(() => {
        setShowOutlines(false);
    }, 2500);

    const onReceiveMessage = React.useCallback(
        (message: AdminMessage) => {
            switch (message.cometType) {
                case AdminMessageType.Block:
                    setBlock(message.data.block);
                    break;
                case AdminMessageType.ShowOnlyVisible:
                    setShowOnlyVisible(message.data.showOnlyVisible);
                    break;
                case AdminMessageType.SelectComponent:
                    setSelectedAdminRoute(
                        message.data.adminRoute.lastIndexOf("#") > 0
                            ? message.data.adminRoute.substr(0, message.data.adminRoute.lastIndexOf("#"))
                            : message.data.adminRoute,
                    );
                    break;
                case AdminMessageType.HoverComponent:
                    setHoveredAdminRoute(message.data.adminRoute);
                    setShowOutlines(true);
                    debounceDeactivateOutlines();
                    break;
                case AdminMessageType.ContentScope:
                    setContentScope(message.data.contentScope);
                    break;
            }
        },
        [debounceDeactivateOutlines],
    );

    React.useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const handleMessage = (e: MessageEvent) => {
            try {
                const message = JSON.parse(e.data);
                // Check if message is an iframe message from us -> there are more messaging from e.g webpack,etc.
                // eslint-disable-next-line no-prototype-builtins
                if (message.hasOwnProperty("cometType")) {
                    onReceiveMessage(message as AdminMessage);
                }
            } catch (e) {
                // empty
            }
        };

        window.addEventListener("message", handleMessage, false);

        sendMessage({ cometType: IFrameMessageType.Ready });

        return () => {
            window.removeEventListener("message", handleMessage, false);
        };
    }, [onReceiveMessage]);

    const addPreviewElement = React.useCallback(
        (element: PreviewElement) => {
            setPreviewElements((prev) => [...prev, element]);
        },
        [setPreviewElements],
    );

    const removePreviewElement = React.useCallback(
        (element: PreviewElement) => {
            setPreviewElements((prev) => prev.filter((el) => el.adminRoute !== element.adminRoute));
        },
        [setPreviewElements],
    );

    return (
        <IFrameBridgeContext.Provider
            value={{
                showOutlines,
                hasBridge: true,
                block,
                showOnlyVisible,
                selectedAdminRoute,
                hoveredAdminRoute,
                sendSelectComponent: (adminRoute: string) => {
                    setSelectedAdminRoute(adminRoute);
                    sendMessage({ cometType: IFrameMessageType.SelectComponent, data: { adminRoute } });
                },
                sendHoverComponent: (route: string | null) => {
                    sendMessage({ cometType: IFrameMessageType.HoverComponent, data: { route } });
                },
                sendMessage,
                contentScope,
                previewElementsData: calculatedPreviewElementsData,
                addPreviewElement,
                removePreviewElement,
            }}
        >
            <div
                onMouseMove={() => {
                    setShowOutlines(true);
                    debounceDeactivateOutlines();
                }}
            >
                <PreviewOverlay />
                <ChildrenWrapper ref={childrenWrapperRef}>{children}</ChildrenWrapper>
            </div>
        </IFrameBridgeContext.Provider>
    );
};

const ChildrenWrapper = styled.div`
    position: relative;
    z-index: 1;
`;
