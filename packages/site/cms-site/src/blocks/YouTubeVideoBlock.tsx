import * as React from "react";
import styled from "styled-components";

import { YouTubeVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PropsWithData } from "./PropsWithData";

interface VideoContainerProps {
    heightInPercent: number;
}

const VideoContainer = styled.div<VideoContainerProps>`
    height: 0;
    overflow: hidden;
    padding-top: ${({ heightInPercent }) => heightInPercent}%;
    position: relative;

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`;

const getHeightInPercentForAspectRatio = (aspectRatio: YouTubeVideoBlockData["aspectRatio"]) => {
    switch (aspectRatio) {
        case "16X9":
            return 56.25;
        case "4X3":
            return 75;
    }
};

const EXPECTED_YT_ID_LENGTH = 11;

const parseYoutubeIdentifier = (value: string): string | undefined => {
    // regex from https://stackoverflow.com/a/51870158
    const regExp =
        /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-zA-Z-]+)/;
    const match = value.match(regExp);
    const youtubeId = value.length === EXPECTED_YT_ID_LENGTH ? value : match && match[8].length == EXPECTED_YT_ID_LENGTH ? match[8] : null;

    return youtubeId ?? undefined;
};

export const YouTubeVideoBlock = withPreview(
    ({ data: { youtubeIdentifier, autoplay, loop, showControls, aspectRatio } }: PropsWithData<YouTubeVideoBlockData>) => {
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
            <VideoContainer heightInPercent={getHeightInPercentForAspectRatio(aspectRatio)}>
                <iframe src={youtubeUrl.toString()} style={{ border: 0 }} />
            </VideoContainer>
        );
    },
    { label: "Video" },
);
