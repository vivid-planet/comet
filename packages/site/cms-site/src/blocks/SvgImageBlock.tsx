"use client";
import * as React from "react";

import { SvgImageBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

interface SvgImageBlockProps extends PropsWithData<SvgImageBlockData> {
    width?: string | number | "auto";
    height?: string | number | "auto";
}

export const SvgImageBlock = withPreview(
    ({ data: { damFile }, width = "100%", height = "auto" }: SvgImageBlockProps) => {
        if (!damFile) return <PreviewSkeleton type="media" hasContent={false} />;
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={damFile.fileUrl}
                width={width === "auto" ? undefined : width}
                height={height === "auto" ? undefined : height}
                alt={damFile.altText}
            />
        );
    },
    { label: "SvgImage" },
);
