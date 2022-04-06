import * as React from "react";
import { UrlObject } from "url";

export type Url = string | UrlObject;

export interface PreviewContextOptions {
    previewType: "SitePreview" | "BlockPreview" | "NoPreview";
    showPreviewSkeletons: boolean;
    // internal links only
    pathToPreviewPath: (originalPagePath: Url) => Url;

    // converts a previewpath to a path
    previewPathToPath: (previewPath: string) => string;
}

export const defaultPreviewContextValue: PreviewContextOptions = {
    previewType: "NoPreview",
    showPreviewSkeletons: false,
    pathToPreviewPath: (path) => path,
    previewPathToPath: (previewUrl: string) => previewUrl,
};

export const PreviewContext = React.createContext<PreviewContextOptions>(defaultPreviewContextValue);
