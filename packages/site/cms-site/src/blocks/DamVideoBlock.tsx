"use client";
import * as React from "react";
import styled, { css } from "styled-components";

import { DamVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { VideoPreviewImage, VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import { PropsWithData } from "./PropsWithData";

interface DamVideoBlockProps extends PropsWithData<DamVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage?: (props: VideoPreviewImageProps) => React.ReactElement;
    fill?: boolean;
}

export const DamVideoBlock = withPreview(
    ({
        data: { damFile, autoplay, loop, showControls, previewImage },
        aspectRatio = "16x9",
        previewImageSizes,
        renderPreviewImage,
        fill,
    }: DamVideoBlockProps) => {
        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        const [showPreviewImage, setShowPreviewImage] = React.useState(true);
        const hasPreviewImage = Boolean(previewImage && previewImage.damFile);

        return (
            <>
                {hasPreviewImage && showPreviewImage ? (
                    renderPreviewImage ? (
                        renderPreviewImage({
                            onPlay: () => setShowPreviewImage(false),
                            image: previewImage,
                            aspectRatio,
                            sizes: previewImageSizes,
                            fill: fill,
                        })
                    ) : (
                        <VideoPreviewImage
                            onPlay={() => setShowPreviewImage(false)}
                            image={previewImage}
                            aspectRatio={aspectRatio}
                            sizes={previewImageSizes}
                            fill={fill}
                        />
                    )
                ) : (
                    <Video
                        autoPlay={autoplay || (hasPreviewImage && !showPreviewImage)}
                        controls={showControls}
                        loop={loop}
                        playsInline
                        muted={autoplay}
                        $aspectRatio={aspectRatio.replace("x", " / ")}
                        $fill={fill}
                    >
                        <source src={damFile.fileUrl} type={damFile.mimetype} />
                    </Video>
                )}
            </>
        );
    },
    { label: "Video" },
);

const Video = styled.video<{ $aspectRatio: string; $fill?: boolean }>`
    width: 100%;
    object-fit: cover;

    ${({ $aspectRatio, $fill }) =>
        $fill
            ? css`
                  height: 100%;
              `
            : css`
                  aspect-ratio: ${$aspectRatio};
              `}
`;
