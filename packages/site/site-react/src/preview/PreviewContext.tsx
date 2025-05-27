"use client";

import { createContext } from "react";

export interface PreviewContextOptions {
    previewType: "SitePreview" | "BlockPreview" | "NoPreview";
    showPreviewSkeletons: boolean;
}

const defaultPreviewContextValue: PreviewContextOptions = {
    previewType: "NoPreview",
    showPreviewSkeletons: false,
};

export const PreviewContext = createContext<PreviewContextOptions>(defaultPreviewContextValue);
