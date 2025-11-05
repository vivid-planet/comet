"use client";
import { PreviewSkeleton, type PropsWithData, SvgImageBlock, withPreview } from "@comet/site-react";
import { type DamImageBlockData, type PixelImageBlockData, type SvgImageBlockData } from "@src/blocks.generated";
import { PixelImageBlock } from "@src/futureLib/PixelImageBlock";
import type { ComponentProps } from "react";

type DamImageProps = Omit<ComponentProps<"img">, "src" | "width" | "height" | "alt"> & {
    aspectRatio: string | "inherit";
    /**
     * Do not set an `alt` attribute. The alt text is set in the DAM.
     */
    alt?: never;

    fill?: boolean;
};

export const DamImageBlock = withPreview(
    ({ data: { block }, aspectRatio, ...imageProps }: PropsWithData<DamImageBlockData> & DamImageProps) => {
        if (!block) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        if (block.type === "pixelImage") {
            return <PixelImageBlock data={block.props as PixelImageBlockData} aspectRatio={aspectRatio} {...imageProps} />;
        } else if (block.type === "svgImage") {
            return <SvgImageBlock data={block.props as SvgImageBlockData} />;
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
