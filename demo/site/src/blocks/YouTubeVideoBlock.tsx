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

    return (
        <sc.VideoContainer heightInPercent={getHeightInPercentForAspectRatio(aspectRatio)}>
            {/* the playlist parameter is needed so that the video loops. See https://developers.google.com/youtube/player_parameters#loop */}
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeIdentifier}?&modestbranding=1&autoplay=${Number(autoplay)}${
                    autoplay ? `&mute=1` : ""
                }&controls=${Number(showControls)}&loop=${Number(loop)}${loop ? `&playlist=${youtubeIdentifier}` : ""}`}
                frameBorder="0"
            />
        </sc.VideoContainer>
    );
};

export default withPreview(YouTubeVideoBlock, { label: "Video" });
