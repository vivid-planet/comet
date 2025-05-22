"use client";

<<<<<<< HEAD
import { BlockPreviewProvider, IFrameBridgeProvider } from "@comet/cms-site";
import { type FunctionComponent } from "react";
=======
import { BlockPreviewProvider, IFrameBridgeProvider } from "@comet/site-nextjs";
import { FunctionComponent } from "react";
>>>>>>> main

export const withBlockPreview = (Component: FunctionComponent) => () => {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <Component />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
};
