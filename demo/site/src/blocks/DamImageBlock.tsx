"use client";
import { PixelImageBlock, PreviewSkeleton, PropsWithData, SvgImageBlock, withPreview } from "@comet/cms-site";
import { DamImageBlockData } from "@src/blocks.generated";
import { ImageProps } from "next/image";

type Props = PropsWithData<DamImageBlockData> & Omit<ImageProps, "src" | "width" | "height" | "alt"> & { aspectRatio: string | number | "inherit" };

const DamImageBlock = withPreview(
    ({ data: { block }, aspectRatio, ...imageProps }: Props) => {
        if (!block) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        if (block.type === "pixelImage" && "cropArea" in block.props) {
            return <PixelImageBlock data={block.props} aspectRatio={aspectRatio} {...imageProps} />;
        } else if (block.type === "svgImage") {
            return <SvgImageBlock data={block.props} />;
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
