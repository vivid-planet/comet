"use client";
import { PreviewSkeleton, type PropsWithData, useIsElementInViewport, withPreview } from "@comet/site-react";
import clsx from "clsx";
import { type ReactElement, type ReactNode, useCallback, useRef, useState } from "react";

import { type VimeoVideoBlockData } from "../blocks.generated";
import { PlayPauseButton } from "./helpers/PlayPauseButton";
import { VideoPreviewImage, type VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import styles from "./VimeoVideoBlock.module.scss";

function parseVimeoIdentifier(vimeoIdentifier: string): string | undefined {
    const urlRegEx = /^(https?:\/\/)?((www\.|player\.)?vimeo\.com\/?(showcase\/)*([0-9a-z]*\/)*([0-9]{6,11})[?]?.*)$/;
    const idRegEx = /^([0-9]{6,11})$/;

    const urlRegExMatch = vimeoIdentifier.match(urlRegEx);
    const idRegExMatch = vimeoIdentifier.match(idRegEx);

    if (!urlRegExMatch && !idRegExMatch) return undefined;

    if (urlRegExMatch) {
        return urlRegExMatch[6];
    } else if (idRegExMatch) {
        return idRegExMatch[1];
    }
}

interface VimeoVideoBlockProps extends PropsWithData<VimeoVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage?: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
    playButtonAriaLabel?: string;
}

export const VimeoVideoBlock = withPreview(
    ({
        data: { vimeoIdentifier, autoplay, loop, showControls, previewImage },
        aspectRatio = "16x9",
        previewImageSizes,
        renderPreviewImage,
        fill,
        previewImageIcon,
        playButtonAriaLabel,
    }: VimeoVideoBlockProps) => {
        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const hasPreviewImage = !!(previewImage && previewImage.damFile);
        const inViewRef = useRef<HTMLDivElement>(null);
        const iframeRef = useRef<HTMLIFrameElement>(null);
        const [isHandledManually, setIsHandledManually] = useState(!autoplay);

        const pauseVimeoVideo = (iframe: HTMLIFrameElement | null) => {
            iframe?.contentWindow?.postMessage(JSON.stringify({ method: "pause" }), "https://player.vimeo.com");
        };

        const playVimeoVideo = (iframe: HTMLIFrameElement | null) => {
            iframe?.contentWindow?.postMessage(JSON.stringify({ method: "play" }), "https://player.vimeo.com");
        };

        const handleInView = useCallback(
            (isVisible: boolean) => {
                if (!isHandledManually) {
                    if (isVisible && autoplay) {
                        playVimeoVideo(iframeRef.current);
                    } else {
                        pauseVimeoVideo(iframeRef.current);
                    }
                }
            },
            [autoplay, isHandledManually],
        );

        useIsElementInViewport(inViewRef, handleInView, (hasPreviewImage && !showPreviewImage) || !hasPreviewImage);

        if (!vimeoIdentifier) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const identifier = parseVimeoIdentifier(vimeoIdentifier);

        const searchParams = new URLSearchParams();
        if (hasPreviewImage && !showPreviewImage) searchParams.append("autoplay", "1");
        if (autoplay) searchParams.append("muted", "1");

        if (loop !== undefined) searchParams.append("loop", Number(loop).toString());

        if (showControls !== undefined) searchParams.append("controls", Number(showControls).toString());

        searchParams.append("dnt", "1");

        const vimeoBaseUrl = "https://player.vimeo.com/video/";
        const vimeoUrl = new URL(`${vimeoBaseUrl}${identifier ?? ""}`);
        vimeoUrl.search = searchParams.toString();

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
                    <div
                        ref={inViewRef}
                        className={clsx(styles.videoContainer, fill && styles.fill)}
                        style={!fill ? { "--aspect-ratio": aspectRatio.replace("x", "/") } : undefined}
                    >
                        <iframe ref={iframeRef} className={styles.vimeoContainer} src={vimeoUrl.toString()} allow="autoplay" allowFullScreen />
                        {!showControls && (
                            <PlayPauseButton
                                className={styles.playPause}
                                isPlaying={isHandledManually}
                                onClick={() => {
                                    setIsHandledManually(!isHandledManually);
                                    if (isHandledManually) {
                                        playVimeoVideo(iframeRef.current);
                                    } else {
                                        pauseVimeoVideo(iframeRef.current);
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
