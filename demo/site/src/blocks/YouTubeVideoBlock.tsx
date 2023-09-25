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

const YouTubeVideoBlock: React.FunctionComponent<PropsWithData<YouTubeVideoBlockData>> = ({
    data: { youtubeIdentifier, autoplay, loop, showControls, aspectRatio },
}) => {
    try {
        const url = new URL(youtubeIdentifier);
        const searchParams = url.searchParams;
        if (!searchParams.has("v")) {
            throw new Error("URL has no ID (v) param");
        }
        youtubeIdentifier = searchParams.get("v") as string;
    } catch (error) {
        // no url, but ID was specified
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
            <iframe src={youtubeUrl.toString()} frameBorder="0" />
        </sc.VideoContainer>
    );
};

export default withPreview(YouTubeVideoBlock, { label: "Video" });
