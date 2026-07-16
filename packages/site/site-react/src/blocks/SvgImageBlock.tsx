"use client";

import type { HTMLAttributes } from "react";

import { AiContentDisclosure, type AiContentDisclosureProps } from "../aiContentDisclosure/AiContentDisclosure";
import { getAiContentAltText } from "../aiContentDisclosure/getAiContentAltText";
import type { SvgImageBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import type { PropsWithData } from "./PropsWithData";
import styles from "./SvgImageBlock.module.scss";

interface SvgImageBlockProps extends PropsWithData<SvgImageBlockData> {
    width?: string | number | "auto";
    height?: string | number | "auto";
    /** Override props passed to the AI content disclosure badge. */
    aiContentDisclosureProps?: Partial<AiContentDisclosureProps>;
    /** Hide the AI content disclosure badge, e.g. when the project renders its own. */
    hideAiContentDisclosure?: boolean;
}

export const SvgImageBlock = withPreview(
    ({
        data: { damFile },
        width = "100%",
        height = "auto",
        aiContentDisclosureProps,
        hideAiContentDisclosure,
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

        if (!damFile.aiContentType || hideAiContentDisclosure) {
            return image;
        }

        return (
            <span className={styles.root}>
                {image}
                <AiContentDisclosure type={damFile.aiContentType} {...aiContentDisclosureProps} />
            </span>
        );
    },
    { label: "SvgImage" },
);
