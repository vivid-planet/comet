import * as React from "react";
import { Route, useHistory } from "react-router";

import {
    AdminMessage,
    AdminMessageType,
    IAdminBlockMessage,
    IAdminHoverComponentMessage,
    IAdminSelectComponentMessage,
    IAdminShowOnlyVisibleMessage,
    IFrameMessage,
    IFrameMessageType,
} from "./IFrameMessage";

export interface IFrameBridgeContext {
    iFrameRef: React.Ref<HTMLIFrameElement>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendBlockState: (blockState: any) => void; // TODO: only PageBlock is supported currently
    sendShowOnlyVisible: (showOnlyVisible: boolean) => void;
    iFrameReady: boolean;
    hoveredSiteRoute: string | null;
    sendSelectComponent: (adminRoute: string) => void;
    sendHoverComponent: (adminRoute: string | null) => void;
}

export const IFrameBridgeContext = React.createContext<IFrameBridgeContext>({
    iFrameRef: React.createRef(),
    sendBlockState: () => {
        // empty
    },
    sendShowOnlyVisible: () => {
        // empty
    },
    iFrameReady: false,
    hoveredSiteRoute: null,
    sendSelectComponent: () => {
        // empty
    },
    sendHoverComponent: () => {
        // empty
    },
});

interface IFrameBridgeProviderProps {
    onReceiveMessage?: (message: IFrameMessage) => void;
}
export const IFrameBridgeProvider: React.FunctionComponent<IFrameBridgeProviderProps> = ({ children, onReceiveMessage }) => {
    const iFrameRef = React.useRef<HTMLIFrameElement>(null);
    const [iFrameReady, setIFrameReady] = React.useState(false);

    const [hoveredSiteRoute, setHoveredSiteRoute] = React.useState<string | null>(null);

    const history = useHistory();
    const sendMessage = React.useCallback(
        (message: AdminMessage) => {
            if (!iFrameReady) {
                throw Error("iFrame not ready");
            }

            if (iFrameRef && iFrameRef.current && iFrameRef.current.contentWindow) {
                iFrameRef.current.contentWindow.postMessage(JSON.stringify(message), "*");
            }
        },
        [iFrameReady],
    );
    const _onReceiveMessage = React.useCallback(
        (message: IFrameMessage) => {
            onReceiveMessage?.(message);
            switch (message.cometType) {
                case IFrameMessageType.Ready:
                    setIFrameReady(true);
                    break;
                case IFrameMessageType.SelectComponent:
                    history.push(message.data.adminRoute);
                    break;
                case IFrameMessageType.HoverComponent:
                    setHoveredSiteRoute(message.data.route);
                    break;
            }
        },
        [history, onReceiveMessage],
    );

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                // Check if message is an iframe message from us -> there are more messaging from e.g webpack,etc.
                // eslint-disable-next-line no-prototype-builtins
                if (message.hasOwnProperty("cometType")) {
                    _onReceiveMessage(message as IFrameMessage);
                }
            } catch (e) {
                // empty
            }
        };

        window.addEventListener("message", handleMessage, false);

        return () => {
            window.removeEventListener("message", handleMessage, false);
        };
    }, [_onReceiveMessage]);

    const sendSelectComponent = React.useCallback(
        (adminRoute: string) => {
            const message: IAdminSelectComponentMessage = { cometType: AdminMessageType.SelectComponent, data: { adminRoute } };
            sendMessage(message);
        },
        [sendMessage],
    );

    return (
        <Route>
            {() => {
                return (
                    <IFrameBridgeContext.Provider
                        value={{
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            sendBlockState: (blockState: any) => {
                                const message: IAdminBlockMessage = {
                                    cometType: AdminMessageType.Block,
                                    data: {
                                        block: blockState, // @TODO: refactor block to blockState
                                    },
                                };
                                sendMessage(message);
                            },
                            sendShowOnlyVisible: (showOnlyVisible: boolean) => {
                                const message: IAdminShowOnlyVisibleMessage = {
                                    cometType: AdminMessageType.ShowOnlyVisible,
                                    data: {
                                        showOnlyVisible,
                                    },
                                };
                                sendMessage(message);
                            },
                            iFrameRef,
                            iFrameReady,
                            sendSelectComponent,
                            hoveredSiteRoute: hoveredSiteRoute,
                            sendHoverComponent: (adminRoute) => {
                                const message: IAdminHoverComponentMessage = { cometType: AdminMessageType.HoverComponent, data: { adminRoute } };
                                sendMessage(message);
                            },
                        }}
                    >
                        {children}
                    </IFrameBridgeContext.Provider>
                );
            }}
        </Route>
    );
};
