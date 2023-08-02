import { PropsWithData, withPreview } from "@comet/cms-site";
import { YouTubeVideoBlockData } from "@src/blocks.generated";
import * as React from "react";

import * as sc from "./YouTubeVideoBlock.sc";

const getHeightInPercentForAspectRatio = (aspectRatio: YouTubeVideoBlockData["aspectRatio"]) => {
    switch (aspectRatio) {
        case "16X9":
            return 56.25;
        case "4X3":
            return 75;
    }
};

const EXPECTED_YT_ID_LENGTH = 11;

const parseYoutubeUrl = (url: string) => {
    // regex from https://stackoverflow.com/a/27728417
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
    const match = url.match(regExp);
    const youtubeId = match && match[1].length == EXPECTED_YT_ID_LENGTH ? match[1] : null;

    if (youtubeId) return youtubeId;
    else throw new Error("Invalid YouTube URL");
};

const YouTubeVideoBlock: React.FunctionComponent<PropsWithData<YouTubeVideoBlockData>> = ({
    data: { youtubeIdentifier, autoplay, loop, showControls, aspectRatio },
}) => {
    try {
        youtubeIdentifier = parseYoutubeUrl(youtubeIdentifier);
    } catch (error) {
        youtubeIdentifier = "";
    }

    const searchParams = new URLSearchParams();
    searchParams.append("modestbranding", "1");

    searchParams.append("autoplay", Number(autoplay).toString());
    autoplay && searchParams.append("mute", "1");

    searchParams.append("controls", Number(showControls).toString());

    searchParams.append("loop", Number(loop).toString());
    // the playlist parameter is needed so that the video loops. See https://developers.google.com/youtube/player_parameters#loop
    loop && searchParams.append("playlist", youtubeIdentifier);

    const youtubeBaseUrl = "https://www.youtube-nocookie.com/embed/";
    const youtubeUrl = new URL(`${youtubeBaseUrl}${youtubeIdentifier}`);
    youtubeUrl.search = searchParams.toString();

    return (
        <sc.VideoContainer heightInPercent={getHeightInPercentForAspectRatio(aspectRatio)}>
            <iframe src={youtubeUrl.toString()} style={{ border: 0 }} />
        </sc.VideoContainer>
    );
};

export default withPreview(YouTubeVideoBlock, { label: "Video" });
