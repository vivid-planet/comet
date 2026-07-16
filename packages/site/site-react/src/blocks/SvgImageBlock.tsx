"use client";

import type { HTMLAttributes } from "react";

import { AiContentDisclosure } from "../aiContentDisclosure/AiContentDisclosure";
import { getAiContentAltText } from "../aiContentDisclosure/getAiContentAltText";
import type { SvgImageBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import type { PropsWithData } from "./PropsWithData";
import styles from "./SvgImageBlock.module.scss";

interface SvgImageBlockProps extends PropsWithData<SvgImageBlockData> {
    width?: string | number | "auto";
    height?: string | number | "auto";
}

export const SvgImageBlock = withPreview(
    ({
        data: { damFile },
        width = "100%",
        height = "auto",
        ...restProps
    }: SvgImageBlockProps & Omit<HTMLAttributes<HTMLImageElement>, "width" | "height">) => {
        const altText = getAiContentAltText({ aiContentType: damFile?.aiContentType, description: damFile?.altText });

        if (!damFile) {
            return <PreviewSkeleton type="media" hasContent={false} height={height === "auto" ? undefined : height} />;
        }

        const image = (
            <img
                src={damFile.fileUrl}
                width={width === "auto" ? undefined : width}
                height={height === "auto" ? undefined : height}
                alt={altText}
                title={damFile.title ?? ""}
                {...restProps}
            />
        );

        if (!damFile.aiContentType) {
            return image;
        }

        return (
            <span className={styles.root}>
                {image}
                <AiContentDisclosure type={damFile.aiContentType} />
            </span>
        );
    },
    { label: "SvgImage" },
);
