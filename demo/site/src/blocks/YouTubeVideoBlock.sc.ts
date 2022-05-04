import styled from "styled-components";

export interface VideoContainerProps {
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
