import { Video } from "@comet/admin-icons";
import * as React from "react";
import styled from "styled-components";

const VideoThumbnailWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    border: solid 1px ${({ theme }) => theme.palette.grey[100]};
`;

const StyledVideoIcon = styled(Video)`
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.palette.primary.main};
`;

export const VideoThumbnail = (): React.ReactElement => {
    return (
        <VideoThumbnailWrapper>
            <StyledVideoIcon />
        </VideoThumbnailWrapper>
    );
};
