"use client";

import clsx from "clsx";
import { type ComponentType, type ReactElement, type ReactNode, useCallback, useEffect, useState } from "react";

import type { DamVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import styles from "./DamVideoBlock.module.scss";
import { PlayPauseButton, type PlayPauseButtonProps } from "./helpers/PlayPauseButton";
import { useIsElementInViewport } from "./helpers/useIsElementInViewport";
import type { VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import type { PropsWithData } from "./PropsWithData";

interface DamVideoBlockProps extends PropsWithData<DamVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
    playButtonAriaLabel?: string;
    pauseButtonAriaLabel?: string;
    playPauseButton?: ComponentType<PlayPauseButtonProps>;
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
        pauseButtonAriaLabel,
        playPauseButton: PlayPauseButtonComponent,
    }: DamVideoBlockProps) => {
        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const [isPlaying, setIsPlaying] = useState(autoplay ?? false);
        const [isHandledManually, setIsHandledManually] = useState(false);
        const hasPreviewImage = Boolean(previewImage && previewImage.damFile);

        const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

        const handleInView = useCallback(
            (inView: boolean) => {
                if (!autoplay || isHandledManually || !videoElement) {
                    return;
                }
                if (inView) {
                    void videoElement.play();
                    setIsPlaying(true);
                } else {
                    videoElement.pause();
                    setIsPlaying(false);
                }
            },
            [autoplay, isHandledManually, videoElement],
        );

        useIsElementInViewport({ current: videoElement }, handleInView);

        // When the user dismisses the preview image, the <video> mounts fresh. Trigger play()
        // explicitly — the autoPlay attribute alone is often ignored by the browser after a
        // React remount, and the click counts as user activation so playback can be unmuted.
        useEffect(() => {
            if (!videoElement || showPreviewImage || autoplay) {
                return;
            }
            videoElement
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                    // Playback rejected — leave button in "play" state so the user can retry
                });
        }, [videoElement, showPreviewImage, autoplay]);

        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const handlePlayPauseClick = () => {
            if (isPlaying) {
                setIsPlaying(false);
                setIsHandledManually(true);
                videoElement?.pause();
            } else {
                setIsPlaying(true);
                setIsHandledManually(true);
                void videoElement?.play();
            }
        };

        return (
            <>
                {hasPreviewImage && showPreviewImage ? (
                    renderPreviewImage({
                        onPlay: () => {
                            setShowPreviewImage(false);
                            setIsHandledManually(true);
                        },
                        image: previewImage,
                        aspectRatio,
                        sizes: previewImageSizes,
                        fill: fill,
                        icon: previewImageIcon,
                        playButtonAriaLabel,
                    })
                ) : (
                    <div className={styles.root}>
                        <video
                            autoPlay={autoplay || !showPreviewImage}
                            controls={showControls}
                            loop={loop}
                            playsInline
                            muted={autoplay && !isHandledManually}
                            ref={setVideoElement}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            className={clsx(styles.video, fill && styles.fill)}
                            style={!fill ? { "--aspect-ratio": aspectRatio.replace("x", " / ") } : undefined}
                        >
                            {damFile.captions?.map((caption) => {
                                return <track key={caption.id} src={caption.fileUrl} kind="captions" srcLang={caption.language} />;
                            })}
                            <source src={damFile.fileUrl} type={damFile.mimetype} />
                        </video>
                        {!showControls &&
                            (PlayPauseButtonComponent ? (
                                <PlayPauseButtonComponent isPlaying={isPlaying} onClick={handlePlayPauseClick} />
                            ) : (
                                <PlayPauseButton
                                    isPlaying={isPlaying}
                                    onClick={handlePlayPauseClick}
                                    ariaLabelPlay={playButtonAriaLabel}
                                    ariaLabelPause={pauseButtonAriaLabel}
                                />
                            ))}
                    </div>
                )}
            </>
        );
    },
    { label: "Video" },
);
