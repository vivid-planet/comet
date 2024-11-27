"use client";

import { ReactElement, ReactNode, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { DamVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { pauseDamVideo, playDamVideo } from "./helpers/controlVideos";
import { useIsElementVisible } from "./helpers/useIsElementVisible";
import { VideoPreviewImage, VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import { PropsWithData } from "./PropsWithData";

interface DamVideoBlockProps extends PropsWithData<DamVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage?: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
}

export const DamVideoBlock = withPreview(
    ({
        data: { damFile, autoplay, loop, showControls, previewImage },
        aspectRatio = "16x9",
        previewImageSizes,
        renderPreviewImage,
        fill,
        previewImageIcon,
    }: DamVideoBlockProps) => {
        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const hasPreviewImage = Boolean(previewImage && previewImage.damFile);

        const inViewRef = useRef<HTMLDivElement>(null);
        const videoRef = useRef<HTMLVideoElement>(null);

        const inView = useIsElementVisible(inViewRef);

        inView && autoplay ? playDamVideo(videoRef) : pauseDamVideo(videoRef);

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
                            icon: previewImageIcon,
                        })
                    ) : (
                        <VideoPreviewImage
                            onPlay={() => setShowPreviewImage(false)}
                            image={previewImage}
                            aspectRatio={aspectRatio}
                            sizes={previewImageSizes}
                            fill={fill}
                            icon={previewImageIcon}
                        />
                    )
                ) : (
                    <div ref={inViewRef}>
                        <Video
                            autoPlay={autoplay || (hasPreviewImage && !showPreviewImage)}
                            controls={showControls}
                            loop={loop}
                            playsInline
                            muted={autoplay}
                            ref={videoRef}
                            $aspectRatio={aspectRatio.replace("x", " / ")}
                            $fill={fill}
                        >
                            <source src={damFile.fileUrl} type={damFile.mimetype} />
                        </Video>
                    </div>
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
