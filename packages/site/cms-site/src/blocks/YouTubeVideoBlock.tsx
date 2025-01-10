"use client";

import { styled } from "@pigment-css/react";
import { ReactElement, ReactNode, useState } from "react";

import { YouTubeVideoBlockData } from "../blocks.generated";
import { VideoPreviewImage, VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import { PropsWithData } from "./PropsWithData";

const EXPECTED_YT_ID_LENGTH = 11;

const parseYoutubeIdentifier = (value: string): string | undefined => {
    // regex from https://stackoverflow.com/a/51870158
    const regExp =
        /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-zA-Z-]+)/;
    const match = value.match(regExp);
    const youtubeId = value.length === EXPECTED_YT_ID_LENGTH ? value : match && match[8].length == EXPECTED_YT_ID_LENGTH ? match[8] : null;

    return youtubeId ?? undefined;
};

interface YouTubeVideoBlockProps extends PropsWithData<YouTubeVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage?: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
}

export const YouTubeVideoBlock = ({
    data: { youtubeIdentifier, autoplay, loop, showControls, previewImage },
    aspectRatio = "16x9",
    previewImageSizes,
    renderPreviewImage,
    fill,
    previewImageIcon,
}: YouTubeVideoBlockProps) => {
    const [showPreviewImage, setShowPreviewImage] = useState(true);
    const hasPreviewImage = !!(previewImage && previewImage.damFile);

    /*if (!youtubeIdentifier) {
        return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
    }*/
    if (!youtubeIdentifier) {
        return null;
    }

    const identifier = parseYoutubeIdentifier(youtubeIdentifier);
    const searchParams = new URLSearchParams();
    searchParams.append("modestbranding", "1");
    searchParams.append("rel", "0");

    if (autoplay !== undefined || (hasPreviewImage && !showPreviewImage))
        searchParams.append("autoplay", Number(autoplay || (hasPreviewImage && !showPreviewImage)).toString());
    if (autoplay) searchParams.append("mute", "1");

    if (showControls !== undefined) searchParams.append("controls", Number(showControls).toString());

    if (loop !== undefined) searchParams.append("loop", Number(loop).toString());
    // the playlist parameter is needed so that the video loops. See https://developers.google.com/youtube/player_parameters#loop
    if (loop && identifier) searchParams.append("playlist", identifier);

    const youtubeBaseUrl = "https://www.youtube-nocookie.com/embed/";
    const youtubeUrl = new URL(`${youtubeBaseUrl}${identifier ?? ""}`);
    youtubeUrl.search = searchParams.toString();

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
                <VideoContainer $aspectRatio={aspectRatio.replace("x", "/")} $fill={fill}>
                    <YouTubeContainer src={youtubeUrl.toString()} allow="autoplay" />
                </VideoContainer>
            )}
        </>
    );
};

//export default withPreview(YouTubeVideoBlock, { label: "Video" });

const VideoContainer = styled.div<{ $aspectRatio: string; $fill?: boolean }>({
    overflow: "hidden",
    position: "relative",
    width: ({ $fill }) => ($fill != null ? "100%" : undefined),
    height: ({ $fill }) => ($fill ? "100%" : "auto"),
    aspectRatio: ({ $fill, $aspectRatio }) => ($fill ? undefined : $aspectRatio),
});

const YouTubeContainer = styled.iframe`
    position: absolute;
    border: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;
