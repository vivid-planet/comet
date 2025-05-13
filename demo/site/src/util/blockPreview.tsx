"use client";

import { BlockPreviewProvider, IFrameBridgeProvider } from "@comet/site-next";
import { FunctionComponent } from "react";

export const withBlockPreview = (Component: FunctionComponent) => () => {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <Component />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
};
