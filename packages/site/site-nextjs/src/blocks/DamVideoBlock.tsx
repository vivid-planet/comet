"use client";

import { useIsElementInViewport } from "@comet/site-react";
import clsx from "clsx";
import { type ReactElement, type ReactNode, useRef, useState } from "react";

import { type DamVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import styles from "./DamVideoBlock.module.scss";
import { type VideoPreviewImageProps, VideoPreviewImage } from "./helpers/VideoPreviewImage";
import { type PropsWithData } from "./PropsWithData";

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

        const videoRef = useRef<HTMLVideoElement>(null);

        useIsElementInViewport(videoRef, (inView) => {
            if (autoplay && videoRef.current) {
                inView ? videoRef.current.play() : videoRef.current.pause();
            }
        });

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
                    <video
                        autoPlay={autoplay || (hasPreviewImage && !showPreviewImage)}
                        controls={showControls}
                        loop={loop}
                        playsInline
                        muted={autoplay}
                        ref={videoRef}
                        className={clsx(styles.video, fill && styles.fill)}
                        style={!fill ? { "--aspect-ratio": aspectRatio.replace("x", " / ") } : undefined}
                    >
                        <source src={damFile.fileUrl} type={damFile.mimetype} />
                    </video>
                )}
            </>
        );
    },
    { label: "Video" },
);
