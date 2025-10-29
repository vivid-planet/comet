"use client";

import { PreviewSkeleton, type PropsWithData, useIsElementInViewport, withPreview } from "@comet/site-react";
import clsx from "clsx";
import { type ReactElement, type ReactNode, useCallback, useState } from "react";

import { type DamVideoBlockData } from "../blocks.generated";
import styles from "./DamVideoBlock.module.scss";
import { PlayPauseButton } from "./helpers/PlayPauseButton";
import { VideoPreviewImage, type VideoPreviewImageProps } from "./helpers/VideoPreviewImage";

interface DamVideoBlockProps extends PropsWithData<DamVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage?: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
    playButtonAriaLabel?: string;
}

export const DamVideoBlock = withPreview(
    ({
        data: { damFile, autoplay, loop, showControls, previewImage },
        aspectRatio = "16x9",
        previewImageSizes,
        renderPreviewImage,
        fill,
        previewImageIcon,
        playButtonAriaLabel,
    }: DamVideoBlockProps) => {
        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const [isHandledManually, setIsHandledManually] = useState(!autoplay);
        const hasPreviewImage = Boolean(previewImage && previewImage.damFile);

        const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
        const videoRef = useCallback((node: HTMLVideoElement | null) => {
            setVideoElement(node);
        }, []);

        const handleInView = useCallback(
            (inView: boolean) => {
                if (autoplay && videoElement && !isHandledManually) {
                    if (inView) {
                        videoElement.play();
                    } else {
                        videoElement.pause();
                    }
                }
            },
            [autoplay, isHandledManually, videoElement],
        );

        useIsElementInViewport({ current: videoElement }, handleInView);

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
                            playButtonAriaLabel={playButtonAriaLabel}
                        />
                    )
                ) : (
                    <div className={styles.root}>
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
                            {damFile.captions.map((caption) => {
                                return <track key={caption.id} src={caption.fileUrl} kind="captions" srcLang={caption.language} />;
                            })}
                            <source src={damFile.fileUrl} type={damFile.mimetype} />
                        </video>
                        {!showControls && (
                            <PlayPauseButton
                                className={styles.playPause}
                                isPlaying={isHandledManually}
                                onClick={() => {
                                    setIsHandledManually(!isHandledManually);
                                    if (videoElement) {
                                        if (videoElement.paused) {
                                            videoElement.play();
                                        } else {
                                            videoElement.pause();
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>
                )}
            </>
        );
    },
    { label: "Video" },
);
