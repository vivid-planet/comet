"use client";
import { PixelImageBlock, PreviewSkeleton, type PropsWithData, SvgImageBlock, withPreview } from "@comet/site-nextjs";
import type { DamImageBlockData, PixelImageBlockData, SvgImageBlockData } from "@src/blocks.generated";
import { AiGeneratedBadge } from "@src/common/blocks/AiGeneratedBadge";
import type { ImageProps as NextImageProps } from "next/image";

type DamImageProps = Omit<NextImageProps, "src" | "width" | "height" | "alt"> & {
    aspectRatio: string | "inherit";
    /**
     * Do not set an `alt` attribute. The alt text is set in the DAM.
     */
    alt?: never;
};

export const DamImageBlock = withPreview(
    ({ data: { block }, aspectRatio, ...imageProps }: PropsWithData<DamImageBlockData> & DamImageProps) => {
        if (!block) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        if (block.type === "pixelImage") {
            const pixelImageData = block.props as PixelImageBlockData;
            return (
                <AiGeneratedBadge aiGeneration={pixelImageData.damFile?.aiGeneration} fill={imageProps.fill}>
                    <PixelImageBlock data={pixelImageData} aspectRatio={aspectRatio} {...imageProps} />
                </AiGeneratedBadge>
            );
        } else if (block.type === "svgImage") {
            const svgImageData = block.props as SvgImageBlockData;
            return (
                <AiGeneratedBadge aiGeneration={svgImageData.damFile?.aiGeneration}>
                    <SvgImageBlock data={svgImageData} />
                </AiGeneratedBadge>
            );
        } else {
            return (
                <>
                    Unknown block type: <strong>{block.type}</strong>
                </>
            );
        }
    },
    { label: "Image" },
);
