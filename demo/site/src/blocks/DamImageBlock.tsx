"use client";
import { PixelImageBlock, PreviewSkeleton, PropsWithData, SvgImageBlock, withPreview } from "@comet/cms-site";
import { DamImageBlockData, PixelImageBlockData, SvgImageBlockData } from "@src/blocks.generated";
import { ImageProps } from "next/image";
import * as React from "react";

type Props = PropsWithData<DamImageBlockData> & Omit<ImageProps, "src" | "width" | "height" | "alt"> & { aspectRatio: string | "inherit" };

const DamImageBlock = withPreview(
    ({ data: { block }, aspectRatio, ...imageProps }: Props) => {
        if (!block) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        if (block.type === "pixelImage") {
            return <PixelImageBlock data={block.props as PixelImageBlockData} aspectRatio={aspectRatio} {...imageProps} />;
        } else if (block.type === "svgImage") {
            return <SvgImageBlock data={block.props as SvgImageBlockData} />;
        } else {
            if (process.env.NODE_ENV === "development") {
                return (
                    <pre>
                        Unknown type ({block.type}): {JSON.stringify(block.props)}
                    </pre>
                );
            }

            return null;
        }
    },
    { label: "Image" },
);

export { DamImageBlock };
