"use client";

import { createContext } from "react";
import { type UrlObject } from "url";

export type Url = string | UrlObject;

export interface PreviewContextOptions {
    previewType: "SitePreview" | "BlockPreview" | "NoPreview";
    showPreviewSkeletons: boolean;
}

export const defaultPreviewContextValue: PreviewContextOptions = {
    previewType: "NoPreview",
    showPreviewSkeletons: false,
};

export const PreviewContext = createContext<PreviewContextOptions>(defaultPreviewContextValue);
