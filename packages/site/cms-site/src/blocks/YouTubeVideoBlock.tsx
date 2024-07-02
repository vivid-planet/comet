"use client";
import * as React from "react";
import styled, { css } from "styled-components";

import { YouTubeVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
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

type YouTubeVideoProps = PropsWithData<YouTubeVideoBlockData> & { aspectRatio?: string };

export const YouTubeVideoBlock = withPreview(
    ({ data: { youtubeIdentifier, autoplay, loop, showControls }, aspectRatio = "16x9" }: YouTubeVideoProps) => {
        if (!youtubeIdentifier) return <PreviewSkeleton type="media" hasContent={false} />;
        const identifier = parseYoutubeIdentifier(youtubeIdentifier);

        const searchParams = new URLSearchParams();
        searchParams.append("modestbranding", "1");

        searchParams.append("autoplay", Number(autoplay).toString());
        autoplay && searchParams.append("mute", "1");

        searchParams.append("controls", Number(showControls).toString());

        searchParams.append("loop", Number(loop).toString());
        // the playlist parameter is needed so that the video loops. See https://developers.google.com/youtube/player_parameters#loop
        loop && identifier && searchParams.append("playlist", identifier);

        const youtubeBaseUrl = "https://www.youtube-nocookie.com/embed/";
        const youtubeUrl = new URL(`${youtubeBaseUrl}${identifier ?? ""}`);
        youtubeUrl.search = searchParams.toString();

        return (
            <VideoContainer $aspectRatio={aspectRatio?.replace("x", " / ")}>
                <YouTubeContainer src={youtubeUrl.toString()} />
            </VideoContainer>
        );
    },
    { label: "Video" },
);

const VideoContainer = styled.div<{ $aspectRatio: string }>`
    overflow: hidden;
    position: relative;

    ${({ $aspectRatio }) =>
        css`
            aspect-ratio: ${$aspectRatio};
        `}
`;

const YouTubeContainer = styled.iframe`
    position: absolute;
    border: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;
