"use client";

import { PropsWithChildren } from "react";

import { PreviewContext } from "./PreviewContext";

export const BlockPreviewProvider = ({ children }: PropsWithChildren) => {
    return (
        <PreviewContext.Provider
            value={{
                previewType: "BlockPreview",
                showPreviewSkeletons: true,
            }}
        >
            {children}
        </PreviewContext.Provider>
    );
};
