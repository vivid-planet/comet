"use client";
import { type ReactNode, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { type VimeoVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { useIsElementInViewport } from "./helpers/useIsElementVisible";
import { type VideoPreviewImageProps, VideoPreviewImage } from "./helpers/VideoPreviewImage";
import { type PropsWithData } from "./PropsWithData";

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
    renderPreviewImage?: (props: VideoPreviewImageProps) => React.ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
}

export const VimeoVideoBlock = withPreview(
    ({
        data: { vimeoIdentifier, autoplay, loop, showControls, previewImage },
        aspectRatio = "16x9",
        previewImageSizes,
        renderPreviewImage,
        fill,
        previewImageIcon,
    }: VimeoVideoBlockProps) => {
        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const hasPreviewImage = !!(previewImage && previewImage.damFile);
        const inViewRef = useRef<HTMLDivElement>(null);
        const iframeRef = useRef<HTMLIFrameElement | null>(null);

        const handleVisibilityChange = (isVisible: boolean) => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({ method: isVisible && autoplay ? "play" : "pause" }),
                    "https://player.vimeo.com",
                );
            }
        };

        useIsElementInViewport(inViewRef, handleVisibilityChange);

        if (!vimeoIdentifier) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const identifier = parseVimeoIdentifier(vimeoIdentifier);

        const searchParams = new URLSearchParams();
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
                        />
                    )
                ) : (
                    <VideoContainer ref={inViewRef} $aspectRatio={aspectRatio.replace("x", "/")} $fill={fill}>
                        <VimeoContainer ref={iframeRef} src={vimeoUrl.toString()} allow="autoplay" allowFullScreen />
                    </VideoContainer>
                )}
            </>
        );
    },
    { label: "Video" },
);

const VideoContainer = styled.div<{ $aspectRatio: string; $fill?: boolean }>`
    overflow: hidden;
    position: relative;

    ${({ $aspectRatio, $fill }) =>
        $fill
            ? css`
                  width: 100%;
                  height: 100%;
              `
            : css`
                  aspect-ratio: ${$aspectRatio};
              `}
`;

const VimeoContainer = styled.iframe`
    position: absolute;
    border: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;
