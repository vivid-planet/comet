"use client";
import * as React from "react";
import styled, { css } from "styled-components";

import { DamVideoBlockData, PixelImageBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

interface VideoPreviewImageProps {
    onClick: () => void;
    image: PixelImageBlockData;
    aspectRatio?: string;
    sizes?: string;
}

interface DamVideoBlockProps extends PropsWithData<DamVideoBlockData> {
    aspectRatio?: string;
    sizes?: string;
    VideoPreviewImage?: (props: VideoPreviewImageProps) => React.ReactElement;
}

export const DamVideoBlock = withPreview(
    ({ data: { damFile, autoplay, loop, showControls, previewImage }, aspectRatio, sizes = "100vw", VideoPreviewImage }: DamVideoBlockProps) => {
        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        const [showPreviewImage, setShowPreviewImage] = React.useState(true);
        const hasPreviewImage = previewImage && previewImage.damFile;

        return (
            <>
                {hasPreviewImage && showPreviewImage && VideoPreviewImage ? (
                    <VideoPreviewImage onClick={() => setShowPreviewImage(false)} image={previewImage} aspectRatio={aspectRatio} sizes={sizes} />
                ) : (
                    <Video
                        autoPlay={autoplay || (hasPreviewImage && !showPreviewImage)}
                        controls={showControls}
                        loop={loop}
                        playsInline
                        muted={autoplay}
                        $aspectRatio={aspectRatio ? aspectRatio.replace("x", " / ") : undefined}
                    >
                        <source src={damFile.fileUrl} type={damFile.mimetype} />
                    </Video>
                )}
            </>
        );
    },
    { label: "Video" },
);

const Video = styled.video<{ $aspectRatio?: string }>`
    width: 100%;
    object-fit: cover;

    ${({ $aspectRatio }) =>
        $aspectRatio &&
        css`
            aspect-ratio: ${$aspectRatio};
        `}
`;
