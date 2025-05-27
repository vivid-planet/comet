"use client";

import { BlockPreviewProvider, IFrameBridgeProvider } from "@comet/site-nextjs";
import { type FunctionComponent } from "react";

export const withBlockPreview = (Component: FunctionComponent) => () => {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <Component />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
};
