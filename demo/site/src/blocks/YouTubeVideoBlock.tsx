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

const parseYoutubeIdentifier = (value: string): string | undefined => {
    // regex from https://stackoverflow.com/a/51870158
    const regExp =
        /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-zA-Z-]+)/;
    const match = value.match(regExp);
    const youtubeId = value.length === EXPECTED_YT_ID_LENGTH ? value : match && match[8].length == EXPECTED_YT_ID_LENGTH ? match[8] : null;

    return youtubeId ?? undefined;
};

const YouTubeVideoBlock: React.FunctionComponent<PropsWithData<YouTubeVideoBlockData>> = ({
    data: { youtubeIdentifier, autoplay, loop, showControls, aspectRatio },
}) => {
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
        <sc.VideoContainer heightInPercent={getHeightInPercentForAspectRatio(aspectRatio)}>
            <iframe src={youtubeUrl.toString()} style={{ border: 0 }} />
        </sc.VideoContainer>
    );
};

export default withPreview(YouTubeVideoBlock, { label: "Video" });
