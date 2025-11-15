"use client";

import clsx from "clsx";
import { type ReactElement, type ReactNode, useRef, useState } from "react";

import { type YouTubeVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { useIsElementInViewport } from "./helpers/useIsElementInViewport";
import { type VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import { type PropsWithData } from "./PropsWithData";
import styles from "./YouTubeVideoBlock.module.scss";

const EXPECTED_YT_ID_LENGTH = 11;

const parseYoutubeIdentifier = (value: string): string | undefined => {
    // regex from https://stackoverflow.com/a/51870158
    const regExp =
        /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-zA-Z-]+)/;
    const match = value.match(regExp);
    const youtubeId = value.length === EXPECTED_YT_ID_LENGTH ? value : match && match[8].length === EXPECTED_YT_ID_LENGTH ? match[8] : null;

    return youtubeId ?? undefined;
};
interface YouTubeVideoBlockProps extends PropsWithData<YouTubeVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
    playButtonAriaLabel?: string;
}

export const YouTubeVideoBlock = withPreview(
    ({
        data: { youtubeIdentifier, autoplay, loop, showControls, previewImage },
        aspectRatio = "16x9",
        previewImageSizes,
        renderPreviewImage,
        fill,
        previewImageIcon,
        playButtonAriaLabel,
    }: YouTubeVideoBlockProps) => {
        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const hasPreviewImage = !!(previewImage && previewImage.damFile);
        const iframeRef = useRef<HTMLIFrameElement>(null);
        const inViewRef = useRef<HTMLDivElement>(null);

        const pauseYouTubeVideo = () => {
            iframeRef.current?.contentWindow?.postMessage(`{"event":"command","func":"pauseVideo","args":""}`, "https://www.youtube-nocookie.com");
        };

        const playYouTubeVideo = () => {
            iframeRef.current?.contentWindow?.postMessage(`{"event":"command","func":"playVideo","args":""}`, "https://www.youtube-nocookie.com");
        };

        useIsElementInViewport(inViewRef, (inView: boolean) => {
            if (autoplay) {
                if (inView) {
                    playYouTubeVideo();
                } else {
                    pauseYouTubeVideo();
                }
            }
        });

        if (!youtubeIdentifier) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const identifier = parseYoutubeIdentifier(youtubeIdentifier);
        const searchParams = new URLSearchParams();
        searchParams.append("modestbranding", "1");
        searchParams.append("rel", "0");
        searchParams.append("enablejsapi", "1");

        // start playing the video when the preview image has been hidden
        if (hasPreviewImage && !showPreviewImage) searchParams.append("autoplay", "1");

        if (autoplay) searchParams.append("mute", "1");

        if (showControls !== undefined) searchParams.append("controls", Number(showControls).toString());

        if (loop !== undefined) searchParams.append("loop", Number(loop).toString());
        if (loop && identifier) searchParams.append("playlist", identifier);

        const youtubeBaseUrl = "https://www.youtube-nocookie.com/embed/";
        const youtubeUrl = new URL(`${youtubeBaseUrl}${identifier ?? ""}`);
        youtubeUrl.search = searchParams.toString();

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
                    <div
                        ref={inViewRef}
                        className={clsx(styles.videoContainer, fill && styles.fill)}
                        style={!fill ? { "--aspect-ratio": aspectRatio.replace("x", "/") } : undefined}
                    >
                        <iframe
                            ref={iframeRef}
                            className={styles.youtubeContainer}
                            allow="autoplay"
                            referrerPolicy="strict-origin-when-cross-origin"
                            src={youtubeUrl.toString()}
                        />
                    </div>
                )}
            </>
        );
    },
    { label: "Video" },
);
