import styled from "styled-components";

import { YouTubeVideoBlockData } from "../blocks.generated";

export const getHeightInPercentForAspectRatio = (aspectRatio: YouTubeVideoBlockData["aspectRatio"]) => {
    switch (aspectRatio) {
        case "16X9":
            return 56.25;
        case "4X3":
            return 75;
    }
};

interface VideoContainerProps {
    heightInPercent: number;
}

export const VideoContainer = styled.div<VideoContainerProps>`
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
