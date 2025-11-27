"use client";

import clsx from "clsx";
import { type ComponentType, type ReactElement, type ReactNode, useCallback, useState } from "react";

import { type DamVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import styles from "./DamVideoBlock.module.scss";
import { PlayPauseButton, type PlayPauseButtonProps } from "./helpers/PlayPauseButton";
import { useIsElementInViewport } from "./helpers/useIsElementInViewport";
import { type VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import { type PropsWithData } from "./PropsWithData";

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
        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const [isHandledManually, setIsHandledManually] = useState(!autoplay);
        const hasPreviewImage = Boolean(previewImage && previewImage.damFile);

        const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
        const videoRef = setVideoElement;

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

        const handlePlayPauseClick = () => {
            setIsHandledManually(!isHandledManually);
            if (videoElement) {
                if (videoElement.paused) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            }
        };

        return (
            <>
                {hasPreviewImage && showPreviewImage ? (
                    renderPreviewImage({
                        onPlay: () => setShowPreviewImage(false),
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
                            autoPlay={autoplay || (hasPreviewImage && !showPreviewImage)}
                            controls={showControls}
                            loop={loop}
                            playsInline
                            muted={autoplay}
                            ref={videoRef}
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
                                <PlayPauseButtonComponent isPlaying={isHandledManually} onClick={handlePlayPauseClick} />
                            ) : (
                                <PlayPauseButton
                                    isPlaying={isHandledManually}
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
