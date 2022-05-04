import { PixelImageBlock, PreviewSkeleton, PropsWithData, SvgImageBlock, withPreview } from "@comet/cms-site";
import { ImageBlockData, PixelImageBlockData } from "@src/blocks.generated";
import { ImageProps } from "next/image";
import * as React from "react";
import styled, { css } from "styled-components";

type Props = PropsWithData<ImageBlockData> &
    Omit<ImageProps, "src" | "width" | "height"> & {
        hasShadow?: boolean;
        isRound?: boolean;
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

export const ImageBlock = withPreview(
    ({ data: { block }, hasShadow = true, isRound = false, aspectRatio = "16x9", layout = "intrinsic", ...imageProps }: Props) => {
        if (!block) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        if (block.type === "pixelImage") {
            return (
                <ImageWrapper hasShadow={hasShadow} isRound={isRound}>
                    <PixelImageBlock data={block.props as PixelImageBlockData} layout={layout} aspectRatio={aspectRatio} {...imageProps} />
                </ImageWrapper>
            );
        } else if (block.type === "svgImage") {
            return (
                <ImageWrapper hasShadow={hasShadow} isRound={isRound}>
                    <SvgImageBlock data={block.props as PixelImageBlockData} />
                </ImageWrapper>
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

interface ImageWrapperProps {
    hasShadow?: boolean;
    isRound?: boolean;
}

const ImageWrapper = styled.div<ImageWrapperProps>`
    ${({ hasShadow }) =>
        hasShadow === true &&
        css`
            box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.15);

            ${({ theme }) => theme.breakpoints.b960.mediaQuery} {
                box-shadow: 20px 20px 20px rgba(0, 0, 0, 0.15);
            }
        `};

    ${({ isRound }) =>
        isRound === true &&
        css`
            border-radius: 50%;
        `};
`;
