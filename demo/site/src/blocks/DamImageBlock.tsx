"use client";
import { PixelImageBlock, PreviewSkeleton, PropsWithData, SvgImageBlock, withPreview } from "@comet/cms-site";
import { DamImageBlockData, PixelImageBlockData, SvgImageBlockData } from "@src/blocks.generated";
import { NextImageBottomPaddingFix } from "@src/components/common/NextImageBottomPaddingFix";
import { ImageProps } from "next/image";
import * as React from "react";

type Props = PropsWithData<DamImageBlockData> &
    Omit<ImageProps, "src" | "width" | "height" | "alt"> & {
        aspectRatio?: string | "inherit";
    } & (
        | { layout?: "fixed" | "intrinsic" }
        // The sizes prop must be specified for images with layout "fill" or "responsive", as recommended in the next/image documentation
        // https://nextjs.org/docs/api-reference/next/image#sizes
        | {
              layout?: "fill" | "responsive";
              sizes: string;
          }
    );

const DamImageBlock = withPreview(
    ({ data: { block }, aspectRatio, layout = "intrinsic", ...imageProps }: Props) => {
        if (!block) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        if (block.type === "pixelImage") {
            return (
                <NextImageBottomPaddingFix>
                    <PixelImageBlock data={block.props as PixelImageBlockData} layout={layout} aspectRatio={aspectRatio} {...imageProps} />
                </NextImageBottomPaddingFix>
            );
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
